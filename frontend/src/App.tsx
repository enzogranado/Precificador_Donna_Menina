import { useState, useEffect } from 'react';

// Tipagens e Constantes Mocks
import type { User, Material, MaterialUsado, Produto, CustoFixo, ConfiguracaoTempo } from './types';
import { INGREDIENTES_MOCK, CUSTOS_FIXOS_MOCK, CONFIG_TEMPO_MOCK, PRODUTOS_MOCK } from './constants/mockData';

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
  const [materiais, setMateriais] = useState<Material[]>(() => {
    const saved = localStorage.getItem('donamenina_materiais');
    return saved ? JSON.parse(saved) : INGREDIENTES_MOCK;
  });

  const [searchMaterial, setSearchMaterial] = useState('');
  const [materialForm, setMaterialForm] = useState<Partial<Material>>({
    nome: '',
    precoTotal: undefined,
    quantidadeTotal: undefined,
    unidadeMedida: 'g'
  });
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);

  // Custos Fixos (Parte 3)
  const [custosFixos, setCustosFixos] = useState<CustoFixo[]>(() => {
    const saved = localStorage.getItem('donamenina_custos_fixos');
    return saved ? JSON.parse(saved) : CUSTOS_FIXOS_MOCK;
  });

  const [custoFixoForm, setCustoFixoForm] = useState<Partial<CustoFixo>>({
    nome: '',
    valor: undefined
  });

  // Configuração do Tempo (Parte 3)
  const [configTempo, setConfigTempo] = useState<ConfiguracaoTempo>(() => {
    const saved = localStorage.getItem('donamenina_config_tempo');
    return saved ? JSON.parse(saved) : CONFIG_TEMPO_MOCK;
  });

  // Produtos (Parte 2)
  const [produtos, setProdutos] = useState<Produto[]>(() => {
    const saved = localStorage.getItem('donamenina_produtos');
    return saved ? JSON.parse(saved) : PRODUTOS_MOCK;
  });

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

  useEffect(() => {
    localStorage.setItem('donamenina_materiais', JSON.stringify(materiais));
  }, [materiais]);

  useEffect(() => {
    localStorage.setItem('donamenina_custos_fixos', JSON.stringify(custosFixos));
  }, [custosFixos]);

  useEffect(() => {
    localStorage.setItem('donamenina_config_tempo', JSON.stringify(configTempo));
  }, [configTempo]);

  useEffect(() => {
    localStorage.setItem('donamenina_produtos', JSON.stringify(produtos));
  }, [produtos]);

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

    // Preço de venda sugerido (Markup Divisor)
    const divisor = (100 - prod.margemLucro) / 100;
    const precoVenda = divisor > 0 ? (custoTotal / divisor) : custoTotal * 1.5;

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

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const { nome, precoTotal, quantidadeTotal, unidadeMedida } = materialForm;

    if (!nome?.trim() || precoTotal === undefined || quantidadeTotal === undefined || precoTotal <= 0 || quantidadeTotal <= 0) {
      alert('Por favor, insira valores válidos.');
      return;
    }

    const precoUnitario = precoTotal / quantidadeTotal;

    if (editingMaterialId) {
      setMateriais(prev => prev.map(m => m.id === editingMaterialId ? {
        ...m,
        nome: nome.trim(),
        precoTotal,
        quantidadeTotal,
        unidadeMedida: unidadeMedida as 'g' | 'ml' | 'un',
        precoUnitario
      } : m));
      setEditingMaterialId(null);
    } else {
      const newMaterial: Material = {
        id: `mat-${Date.now()}`,
        nome: nome.trim(),
        precoTotal,
        quantidadeTotal,
        unidadeMedida: unidadeMedida as 'g' | 'ml' | 'un',
        precoUnitario
      };
      setMateriais(prev => [newMaterial, ...prev]);
    }

    setMaterialForm({
      nome: '',
      precoTotal: undefined,
      quantidadeTotal: undefined,
      unidadeMedida: 'g'
    });
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

  const handleDeleteMaterial = (id: string) => {
    const emUso = produtos.some(p => p.materiaisUsados.some(mu => mu.materialId === id));
    if (emUso) {
      alert('Este material não pode ser excluído porque está sendo usado na receita de um ou mais produtos cadastrados.');
      return;
    }

    if (window.confirm('Tem certeza que deseja remover este material?')) {
      setMateriais(prev => prev.filter(m => m.id !== id));
      if (editingMaterialId === id) {
        setEditingMaterialId(null);
        setMaterialForm({ nome: '', precoTotal: undefined, quantidadeTotal: undefined, unidadeMedida: 'g' });
      }
    }
  };

  // ==========================================
  // OPERAÇÕES: CUSTOS FIXOS E TEMPO
  // ==========================================

  const handleSaveCustoFixo = (e: React.FormEvent) => {
    e.preventDefault();
    const { nome, valor } = custoFixoForm;

    if (!nome?.trim() || valor === undefined || valor <= 0) {
      alert('Insira um nome e valor válidos para a despesa.');
      return;
    }

    const newCusto: CustoFixo = {
      id: `fix-${Date.now()}`,
      nome: nome.trim(),
      valor
    };

    setCustosFixos(prev => [...prev, newCusto]);
    setCustoFixoForm({ nome: '', valor: undefined });
  };

  const handleDeleteCustoFixo = (id: string) => {
    setCustosFixos(prev => prev.filter(c => c.id !== id));
  };

  const handleConfigTempoChange = (field: keyof ConfiguracaoTempo, value: number) => {
    setConfigTempo(prev => ({
      ...prev,
      [field]: Math.max(1, value)
    }));
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

  const handleSaveProduto = (e: React.FormEvent) => {
    e.preventDefault();
    const { nome, descricao, tempoProducao, margemLucro, materiaisUsados, rendimento } = produtoForm;

    if (!nome.trim() || tempoProducao <= 0 || margemLucro < 0 || margemLucro >= 100 || rendimento <= 0) {
      alert('Preencha os campos obrigatórios com valores válidos. A margem deve ser menor que 100% e o rendimento maior que 0.');
      return;
    }

    if (materiaisUsados.length === 0) {
      if (!window.confirm('Você está cadastrando um produto sem nenhum ingrediente/material. Deseja continuar?')) {
        return;
      }
    }

    if (editingProdutoId) {
      setProdutos(prev => prev.map(p => p.id === editingProdutoId ? {
        ...p,
        nome: nome.trim(),
        descricao: descricao.trim(),
        tempoProducao,
        margemLucro,
        materiaisUsados,
        rendimento
      } : p));
      setEditingProdutoId(null);
    } else {
      const newProd: Produto = {
        id: `prod-${Date.now()}`,
        nome: nome.trim(),
        descricao: descricao.trim(),
        tempoProducao,
        margemLucro,
        materiaisUsados,
        rendimento
      };
      setProdutos(prev => [newProd, ...prev]);
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

  const handleDeleteProduto = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(prev => prev.filter(p => p.id !== id));
      if (expandedProdutoId === id) setExpandedProdutoId(null);
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
