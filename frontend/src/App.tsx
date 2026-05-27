import { useState, useEffect } from 'react';

// Tipagens
import type { User, Material, MaterialUsado, Produto, CustoFixo, ConfiguracaoTempo } from './types';

const API_BASE = 'http://localhost:3001/api';

// Componentes Globais
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas / Abas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Materiais from './pages/Materiais';
import Produtos from './pages/Produtos';
import CustosFixos from './pages/CustosFixos';

export default function App() {
  // ==========================================
  // ESTADOS PRINCIPAIS
  // ==========================================

  // Autenticação Fictícia (Parte 4)
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('donamenina_user');
    return saved ? JSON.parse(saved) : { email: '', isLoggedIn: false };
  });

  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Navegação
  const [activeTab, setActiveTab] = useState('dashboard');

  // Materiais (Parte 1)
  const [materiais, setMateriais] = useState<Material[]>([]);

  const [searchMaterial, setSearchMaterial] = useState('');
  const [materialForm, setMaterialForm] = useState<Partial<Material>>({
    nome: '',
    precoTotal: undefined,
    quantidadeTotal: undefined,
    unidadeMedida: 'g'
  });
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);

  // Custos Fixos (Parte 3)
  const [custosFixos, setCustosFixos] = useState<CustoFixo[]>([]);

  const [custoFixoForm, setCustoFixoForm] = useState<Partial<CustoFixo>>({
    nome: '',
    valor: undefined
  });

  // Configuração do Tempo (Parte 3)
  const [configTempo, setConfigTempo] = useState<ConfiguracaoTempo>({
    proLabore: 2500,
    horasTrabalhoMes: 120
  });

  // Produtos (Parte 2)
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [searchProduto, setSearchProduto] = useState('');
  const [isCreatingProduto, setIsCreatingProduto] = useState(false);
  const [editingProdutoId, setEditingProdutoId] = useState<string | null>(null);

  // Formulário de Produto
  const [produtoForm, setProdutoForm] = useState<{
    nome: string;
    descricao: string;
    tempoProducao: number;
    margemLucro: number;
    materiaisUsados: MaterialUsado[];
    rendimento: number;
  }>({
    nome: '',
    descricao: '',
    tempoProducao: 20,
    margemLucro: 40,
    materiaisUsados: [],
    rendimento: 1
  });

  // Inserção temporária de material no produto
  const [tempMaterialId, setTempMaterialId] = useState('');
  const [tempQuantidade, setTempQuantidade] = useState<number | undefined>(undefined);

  // Visualização Detalhada do Produto
  const [expandedProdutoId, setExpandedProdutoId] = useState<string | null>(null);

  // ==========================================
  // EFEITOS DE PERSISTÊNCIA (LOCALSTORAGE)
  // ==========================================

  useEffect(() => {
    localStorage.setItem('donamenina_user', JSON.stringify(user));
  }, [user]);

  // Carregamento de dados a partir da API do MongoDB Atlas
  useEffect(() => {
    if (!user.isLoggedIn) return;

    const carregarDados = async () => {
      try {
        const [resMat, resCustos, resConfig, resProd] = await Promise.all([
          fetch(`${API_BASE}/materiais`),
          fetch(`${API_BASE}/custosfixos`),
          fetch(`${API_BASE}/configtempo`),
          fetch(`${API_BASE}/produtos`)
        ]);

        if (resMat.ok) setMateriais(await resMat.json());
        if (resCustos.ok) setCustosFixos(await resCustos.json());
        if (resConfig.ok) setConfigTempo(await resConfig.json());
        if (resProd.ok) setProdutos(await resProd.json());
      } catch (err) {
        console.error('Erro ao carregar dados do banco:', err);
      }
    };

    carregarDados();
  }, [user.isLoggedIn]);

  // ==========================================
  // LÓGICA DE CÁLCULO DE CUSTOS OPERACIONAIS
  // ==========================================

  const totalCustosFixos = custosFixos.reduce((sum, item) => sum + item.valor, 0);
  const totalDespesasTrabalho = totalCustosFixos + configTempo.proLabore;
  const totalMinutosTrabalho = configTempo.horasTrabalhoMes * 60;
  
  // Taxa de mão de obra por minuto
  const custoPorMinuto = totalMinutosTrabalho > 0 ? (totalDespesasTrabalho / totalMinutosTrabalho) : 0;
  const custoPorHora = custoPorMinuto * 60;

  // Função auxiliar para calcular detalhes de precificação de um produto
  const obterDetalhesPrecificacao = (prod: Produto) => {
    // Custo dos materiais
    const custoMateriais = prod.materiaisUsados.reduce((sum, item) => {
      const mat = materiais.find(m => m.id === item.materialId);
      if (!mat) return sum;
      return sum + (item.quantidadeNecessaria * mat.precoUnitario);
    }, 0);

    // Custo de mão de obra tempo de produção
    const custoMaoObra = prod.tempoProducao * custoPorMinuto;
    const custoTotal = custoMateriais + custoMaoObra;

    // Preço de venda sugerido (Margem simples de markup multiplicada sobre o custo)
    const precoVenda = custoTotal * (1 + prod.margemLucro / 100);

    const lucroReal = precoVenda - custoTotal;
    const rendimento = prod.rendimento || 1;

    return {
      custoMateriais,
      custoMaoObra,
      custoTotal,
      precoVenda,
      lucroReal,
      precoVendaUnitario: precoVenda / rendimento,
      custoUnitario: custoTotal / rendimento,
      lucroUnitario: lucroReal / rendimento
    };
  };

  // ==========================================
  // OPERAÇÕES: AUTENTICAÇÃO
  // ==========================================

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !senhaInput.trim()) {
      setLoginError('Por favor, preencha todos os campos.');
      return;
    }
    setUser({
      email: emailInput,
      isLoggedIn: true
    });
    setLoginError('');
  };

  const handleLogout = () => {
    setUser({ email: '', isLoggedIn: false });
    setActiveTab('dashboard');
    setEmailInput('');
    setSenhaInput('');
  };

  // ==========================================
  // OPERAÇÕES: MATERIAIS
  // ==========================================

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nome, precoTotal, quantidadeTotal, unidadeMedida } = materialForm;

    if (!nome?.trim() || precoTotal === undefined || quantidadeTotal === undefined || precoTotal <= 0 || quantidadeTotal <= 0) {
      alert('Por favor, insira valores válidos.');
      return;
    }

    const precoUnitario = precoTotal / quantidadeTotal;

    try {
      const body: any = {
        nome: nome.trim(),
        precoTotal,
        quantidadeTotal,
        unidadeMedida: unidadeMedida as 'g' | 'ml' | 'un',
        precoUnitario
      };
      if (editingMaterialId) {
        body.id = editingMaterialId;
      }

      const response = await fetch(`${API_BASE}/materiais`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(errData.error || 'Erro ao salvar material.');
        return;
      }

      const savedMaterial = await response.json();

      if (editingMaterialId) {
        setMateriais(prev => prev.map(m => m.id === editingMaterialId ? savedMaterial : m));
        setEditingMaterialId(null);
      } else {
        setMateriais(prev => [savedMaterial, ...prev]);
      }

      setMaterialForm({
        nome: '',
        precoTotal: undefined,
        quantidadeTotal: undefined,
        unidadeMedida: 'g'
      });
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao conectar ao servidor.');
    }
  };

  const handleEditMaterial = (mat: Material) => {
    setEditingMaterialId(mat.id);
    setMaterialForm({
      nome: mat.nome,
      precoTotal: mat.precoTotal,
      quantidadeTotal: mat.quantidadeTotal,
      unidadeMedida: mat.unidadeMedida
    });
  };

  const handleDeleteMaterial = async (id: string) => {
    const emUso = produtos.some(p => p.materiaisUsados.some(mu => mu.materialId === id));
    if (emUso) {
      alert('Este material não pode ser excluído porque está sendo usado na receita de um ou mais produtos cadastrados.');
      return;
    }

    if (window.confirm('Tem certeza que deseja remover este material?')) {
      try {
        const response = await fetch(`${API_BASE}/materiais/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errData = await response.json();
          alert(errData.error || 'Erro ao deletar material.');
          return;
        }

        setMateriais(prev => prev.filter(m => m.id !== id));
        if (editingMaterialId === id) {
          setEditingMaterialId(null);
          setMaterialForm({ nome: '', precoTotal: undefined, quantidadeTotal: undefined, unidadeMedida: 'g' });
        }
      } catch (err) {
        console.error(err);
        alert('Ocorreu um erro ao conectar ao servidor.');
      }
    }
  };

  // ==========================================
  // OPERAÇÕES: CUSTOS FIXOS E TEMPO
  // ==========================================

  const handleSaveCustoFixo = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nome, valor } = custoFixoForm;

    if (!nome?.trim() || valor === undefined || valor <= 0) {
      alert('Insira um nome e valor válidos para a despesa.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/custosfixos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim(), valor })
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(errData.error || 'Erro ao salvar despesa fixa.');
        return;
      }

      const savedCusto = await response.json();
      setCustosFixos(prev => [...prev, savedCusto]);
      setCustoFixoForm({ nome: '', valor: undefined });
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao conectar ao servidor.');
    }
  };

  const handleDeleteCustoFixo = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta despesa fixa?')) {
      try {
        const response = await fetch(`${API_BASE}/custosfixos/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errData = await response.json();
          alert(errData.error || 'Erro ao deletar despesa fixa.');
          return;
        }

        setCustosFixos(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error(err);
        alert('Ocorreu um erro ao conectar ao servidor.');
      }
    }
  };

  const handleConfigTempoChange = async (field: keyof ConfiguracaoTempo, value: number) => {
    const novoValor = Math.max(1, value);
    const novaConfig = {
      ...configTempo,
      [field]: novoValor
    };
    
    setConfigTempo(novaConfig);

    try {
      await fetch(`${API_BASE}/configtempo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaConfig)
      });
    } catch (err) {
      console.error('Erro ao salvar parâmetros de tempo em background:', err);
    }
  };

  // ==========================================
  // OPERAÇÕES: PRODUTOS
  // ==========================================

  const handleAddMaterialAoProduto = () => {
    if (!tempMaterialId || tempQuantidade === undefined || tempQuantidade <= 0) {
      alert('Selecione um material e insira uma quantidade válida.');
      return;
    }

    const existe = produtoForm.materiaisUsados.some(mu => mu.materialId === tempMaterialId);
    if (existe) {
      setProdutoForm(prev => ({
        ...prev,
        materiaisUsados: prev.materiaisUsados.map(mu => 
          mu.materialId === tempMaterialId 
            ? { ...mu, quantidadeNecessaria: mu.quantidadeNecessaria + tempQuantidade }
            : mu
        )
      }));
    } else {
      setProdutoForm(prev => ({
        ...prev,
        materiaisUsados: [...prev.materiaisUsados, { materialId: tempMaterialId, quantidadeNecessaria: tempQuantidade }]
      }));
    }

    setTempMaterialId('');
    setTempQuantidade(undefined);
  };

  const handleRemoverMaterialDoProduto = (matId: string) => {
    setProdutoForm(prev => ({
      ...prev,
      materiaisUsados: prev.materiaisUsados.filter(mu => mu.materialId !== matId)
    }));
  };

  const handleSaveProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nome, descricao, tempoProducao, margemLucro, materiaisUsados, rendimento } = produtoForm;

    if (!nome.trim() || tempoProducao <= 0 || margemLucro < 0 || rendimento <= 0) {
      alert('Preencha os campos obrigatórios com valores válidos. A margem deve ser maior ou igual a 0% e o rendimento maior que 0.');
      return;
    }

    if (materiaisUsados.length === 0) {
      if (!window.confirm('Você está cadastrando um produto sem nenhum ingrediente/material. Deseja continuar?')) {
        return;
      }
    }

    try {
      const body: any = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        tempoProducao,
        margemLucro,
        rendimento,
        materiaisUsados
      };

      if (editingProdutoId) {
        body.id = editingProdutoId;
      }

      const response = await fetch(`${API_BASE}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(errData.error || 'Erro ao salvar produto.');
        return;
      }

      const savedProd = await response.json();

      if (editingProdutoId) {
        setProdutos(prev => prev.map(p => p.id === editingProdutoId ? savedProd : p));
        setEditingProdutoId(null);
      } else {
        setProdutos(prev => [savedProd, ...prev]);
      }

      setProdutoForm({
        nome: '',
        descricao: '',
        tempoProducao: 20,
        margemLucro: 40,
        materiaisUsados: [],
        rendimento: 1
      });
      setIsCreatingProduto(false);
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao conectar ao servidor.');
    }
  };

  const handleEditProduto = (prod: Produto) => {
    setEditingProdutoId(prod.id);
    setProdutoForm({
      nome: prod.nome,
      descricao: prod.descricao,
      tempoProducao: prod.tempoProducao,
      margemLucro: prod.margemLucro,
      materiaisUsados: [...prod.materiaisUsados],
      rendimento: prod.rendimento || 1
    });
    setIsCreatingProduto(true);
  };

  const handleDeleteProduto = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const response = await fetch(`${API_BASE}/produtos/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errData = await response.json();
          alert(errData.error || 'Erro ao excluir produto.');
          return;
        }

        setProdutos(prev => prev.filter(p => p.id !== id));
        if (expandedProdutoId === id) setExpandedProdutoId(null);
      } catch (err) {
        console.error(err);
        alert('Ocorreu um erro ao conectar ao servidor.');
      }
    }
  };

  // ==========================================
  // RENDERIZAÇÃO
  // ==========================================

  // Se o usuário não estiver logado, exibe a tela de login
  if (!user.isLoggedIn) {
    return (
      <Login 
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        senhaInput={senhaInput}
        setSenhaInput={setSenhaInput}
        loginError={loginError}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Cabeçalho do Ateliê */}
      <Header onLogout={handleLogout} />

      {/* Navegação por abas horizontais */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsCreatingProduto={setIsCreatingProduto}
      />

      {/* Visualização de cada aba/page individual */}
      {activeTab === 'dashboard' && (
        <Dashboard 
          email={user.email}
          custoPorMinuto={custoPorMinuto}
          custoPorHora={custoPorHora}
          materiaisCount={materiais.length}
          produtosCount={produtos.length}
          totalCustosFixos={totalCustosFixos}
          produtos={produtos}
          materiais={materiais}
          obterDetalhesPrecificacao={obterDetalhesPrecificacao}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'materiais' && (
        <Materiais 
          materiais={materiais}
          materialForm={materialForm}
          setMaterialForm={setMaterialForm}
          editingMaterialId={editingMaterialId}
          setEditingMaterialId={setEditingMaterialId}
          searchMaterial={searchMaterial}
          setSearchMaterial={setSearchMaterial}
          handleSaveMaterial={handleSaveMaterial}
          handleEditMaterial={handleEditMaterial}
          handleDeleteMaterial={handleDeleteMaterial}
        />
      )}

      {activeTab === 'produtos' && (
        <Produtos 
          produtos={produtos}
          materiais={materiais}
          custoPorMinuto={custoPorMinuto}
          searchProduto={searchProduto}
          setSearchProduto={setSearchProduto}
          isCreatingProduto={isCreatingProduto}
          setIsCreatingProduto={setIsCreatingProduto}
          editingProdutoId={editingProdutoId}
          setEditingProdutoId={setEditingProdutoId}
          produtoForm={produtoForm}
          setProdutoForm={setProdutoForm}
          tempMaterialId={tempMaterialId}
          setTempMaterialId={setTempMaterialId}
          tempQuantidade={tempQuantidade}
          setTempQuantidade={setTempQuantidade}
          expandedProdutoId={expandedProdutoId}
          setExpandedProdutoId={setExpandedProdutoId}
          handleAddMaterialAoProduto={handleAddMaterialAoProduto}
          handleRemoverMaterialDoProduto={handleRemoverMaterialDoProduto}
          handleSaveProduto={handleSaveProduto}
          handleEditProduto={handleEditProduto}
          handleDeleteProduto={handleDeleteProduto}
          obterDetalhesPrecificacao={obterDetalhesPrecificacao}
        />
      )}

      {activeTab === 'custos' && (
        <CustosFixos 
          custosFixos={custosFixos}
          custoFixoForm={custoFixoForm}
          setCustoFixoForm={setCustoFixoForm}
          configTempo={configTempo}
          handleSaveCustoFixo={handleSaveCustoFixo}
          handleDeleteCustoFixo={handleDeleteCustoFixo}
          handleConfigTempoChange={handleConfigTempoChange}
          totalCustosFixos={totalCustosFixos}
          custoPorMinuto={custoPorMinuto}
          custoPorHora={custoPorHora}
          totalDespesasTrabalho={totalDespesasTrabalho}
          totalMinutosTrabalho={totalMinutosTrabalho}
        />
      )}

      {/* Rodapé Premium */}
      <Footer />
    </div>
  );
}
