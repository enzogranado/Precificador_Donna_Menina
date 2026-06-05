import React, { useState } from 'react';
import { Gift, Search, Plus, Edit3, Trash2, X, PlusCircle } from 'lucide-react';
import type { Produto, Kit } from '../types';
import EmptyState from '../components/EmptyState';
import InfoNote from '../components/InfoNote';
import PriceDisplayBox from '../components/PriceDisplayBox';
import MetricCard from '../components/MetricCard';

interface KitsProps {
  produtos: Produto[];
  kits: Kit[];
  searchKit: string;
  setSearchKit: (v: string) => void;
  isCreatingKit: boolean;
  setIsCreatingKit: (v: boolean) => void;
  editingKitId: string | null;
  setEditingKitId: (v: string | null) => void;
  kitForm: {
    nome: string;
    descricao: string;
    margemLucroKit: number;
    produtos: { produtoId: string; quantidade: number }[];
  };
  setKitForm: React.Dispatch<React.SetStateAction<{
    nome: string;
    descricao: string;
    margemLucroKit: number;
    produtos: { produtoId: string; quantidade: number }[];
  }>>;
  handleSaveKit: (e: React.FormEvent) => void;
  handleEditKit: (kit: Kit) => void;
  handleDeleteKit: (id: string) => void;
  obterDetalhesPrecificacao: (p: Produto) => {
    custoMateriais: number;
    custoMaoObra: number;
    custoTotal: number;
    precoVenda: number;
    lucroReal: number;
    precoVendaUnitario: number;
    custoUnitario: number;
    lucroUnitario: number;
    precoManualTotal?: number;
    margemLucroManualReal?: number;
    lucroManualReal?: number;
    lucroManualUnitario?: number;
  };
}

export default function Kits({
  produtos,
  kits,
  searchKit,
  setSearchKit,
  isCreatingKit,
  setIsCreatingKit,
  editingKitId,
  setEditingKitId,
  kitForm,
  setKitForm,
  handleSaveKit,
  handleEditKit,
  handleDeleteKit,
  obterDetalhesPrecificacao
}: KitsProps) {
  
  const [tempProdutoId, setTempProdutoId] = useState('');
  const [tempQuantidade, setTempQuantidade] = useState<string>('');
  const [expandedKitId, setExpandedKitId] = useState<string | null>(null);

  const kitsFiltrados = kits.filter(k => 
    k.nome.toLowerCase().includes(searchKit.toLowerCase())
  );

  // Helper to calculate price and profit details for a kit
  const obterDetalhesKit = (kitProdutos: { produtoId: string; quantidade: number }[], margemExtra: number) => {
    let precoBaseTotal = 0;
    let lucroProdutosTotal = 0;
    let custoTotalInsumosMO = 0;

    kitProdutos.forEach(item => {
      const prod = produtos.find(p => p.id === item.produtoId);
      if (!prod) return;

      const calc = obterDetalhesPrecificacao(prod);

      // Price choice: manual if set, otherwise suggested
      const precoPraticadoUnitario = (prod.precoVendaManual !== undefined && prod.precoVendaManual > 0)
        ? prod.precoVendaManual
        : calc.precoVendaUnitario;

      precoBaseTotal += precoPraticadoUnitario * item.quantidade;

      // Profit choice: manual unit profit if set, otherwise suggested unit profit
      const lucroUnitario = (prod.precoVendaManual !== undefined && prod.precoVendaManual > 0 && calc.lucroManualUnitario !== undefined)
        ? calc.lucroManualUnitario
        : calc.lucroUnitario;

      lucroProdutosTotal += lucroUnitario * item.quantidade;
      custoTotalInsumosMO += calc.custoUnitario * item.quantidade;
    });

    // Final price with markup divisor extra margin
    const divisor = (100 - margemExtra) / 100;
    const precoVendaFinal = (margemExtra > 0 && divisor > 0) 
      ? (precoBaseTotal / divisor) 
      : precoBaseTotal;

    const lucroExtraKit = precoVendaFinal - precoBaseTotal;
    const lucroTotalAcumulado = lucroExtraKit + lucroProdutosTotal;

    return {
      precoBaseTotal,
      precoVendaFinal,
      lucroExtraKit,
      lucroProdutosTotal,
      lucroTotalAcumulado,
      custoTotalInsumosMO
    };
  };

  const handleAddProdutoAoKit = () => {
    const qty = parseInt(tempQuantidade) || 0;
    if (!tempProdutoId || qty <= 0) {
      alert('Selecione um produto e insira uma quantidade maior que zero.');
      return;
    }

    const existe = kitForm.produtos.some(p => p.produtoId === tempProdutoId);
    if (existe) {
      setKitForm(prev => ({
        ...prev,
        produtos: prev.produtos.map(p => 
          p.produtoId === tempProdutoId 
            ? { ...p, quantidade: p.quantidade + qty }
            : p
        )
      }));
    } else {
      setKitForm(prev => ({
        ...prev,
        produtos: [...prev.produtos, { produtoId: tempProdutoId, quantidade: qty }]
      }));
    }

    setTempProdutoId('');
    setTempQuantidade('');
  };

  const handleRemoverProdutoDoKit = (prodId: string) => {
    setKitForm(prev => ({
      ...prev,
      produtos: prev.produtos.filter(p => p.produtoId !== prodId)
    }));
  };

  const resumoForm = obterDetalhesKit(kitForm.produtos, kitForm.margemLucroKit);

  return (
    <div style={{ animation: 'cardFadeIn 0.4s ease-out' }}>
      
      {!isCreatingKit ? (
        // ==========================================
        // SUB-ABA: LISTAR KITS
        // ==========================================
        <div className="premium-card">
          <div className="card-title-group">
            <div className="card-title-left">
              <Gift size={20} />
              <h2 className="card-title">Catálogo de Kits Promocionais</h2>
            </div>
            <button 
              className="btn-premium"
              onClick={() => {
                setEditingKitId(null);
                setKitForm({
                  nome: '',
                  descricao: '',
                  margemLucroKit: 0,
                  produtos: []
                });
                setIsCreatingKit(true);
              }}
            >
              Novo Kit <Plus size={18} />
            </button>
          </div>

          <div className="form-group" style={{ maxWidth: '400px', marginBottom: '2rem' }}>
            <div className="input-wrapper">
              <span className="input-prefix"><Search size={16} /></span>
              <input 
                type="text" 
                className="premium-input"
                style={{ paddingLeft: '2.2rem' }}
                placeholder="Pesquisar kit pelo nome..."
                value={searchKit}
                onChange={e => setSearchKit(e.target.value)}
              />
            </div>
          </div>

          {kitsFiltrados.length === 0 ? (
            <EmptyState 
              icon={<Gift size={48} />} 
              title="Nenhum kit promocional" 
              description="Crie combinações de seus produtos artesanais para datas especiais e kits de presente."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {kitsFiltrados.map(k => {
                const calc = obterDetalhesKit(k.produtos, k.margemLucroKit);
                const isExpanded = expandedKitId === k.id;

                return (
                  <div 
                    key={k.id} 
                    className="premium-card" 
                    style={{ 
                      padding: '1.5rem', 
                      borderLeft: '4px solid var(--color-rose)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{k.nome}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '600px' }}>
                          {k.descricao || 'Sem descrição cadastrada.'}
                        </p>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                          <span className="badge rose">
                            {k.produtos.reduce((acc, p) => acc + p.quantidade, 0)} itens no Kit
                          </span>
                          {k.margemLucroKit > 0 && (
                            <span className="badge gold">
                              Margem Extra: {k.margemLucroKit}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Preço do Kit
                          </span>
                          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gold)' }}>
                            R$ {calc.precoVendaFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>
                            Lucro Total: R$ {calc.lucroTotalAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <button 
                            className="btn-premium btn-sm"
                            onClick={() => setExpandedKitId(isExpanded ? null : k.id)}
                          >
                            {isExpanded ? 'Ocultar Detalhes' : 'Ver Composição'}
                          </button>
                          <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'stretch' }}>
                            <button 
                              className="btn-danger-outline" 
                              style={{ flex: 1, color: 'var(--color-gold)', borderColor: 'rgba(197, 163, 94, 0.2)' }}
                              onClick={() => handleEditKit(k)}
                              title="Editar Kit"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button 
                              className="btn-danger-outline" 
                              style={{ flex: 1 }}
                              onClick={() => handleDeleteKit(k.id)}
                              title="Excluir Kit"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes Expandidos da Composição do Kit */}
                    {isExpanded && (
                      <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(197, 163, 94, 0.1)', paddingTop: '1.5rem', animation: 'cardFadeIn 0.3s ease-out' }}>
                        <div className="two-col-layout">
                          {/* Lado Esquerdo: Produtos Utilizados */}
                          <div>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                              Produtos do Kit
                            </h4>
                            <div className="table-container">
                              <table className="premium-table" style={{ fontSize: '0.85rem' }}>
                                <thead>
                                  <tr>
                                    <th>Produto</th>
                                    <th>Qtd</th>
                                    <th>Preço Un. Praticado</th>
                                    <th>Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {k.produtos.map(item => {
                                    const prod = produtos.find(p => p.id === item.produtoId);
                                    if (!prod) return (
                                      <tr key={item.produtoId}>
                                        <td colSpan={4} style={{ color: 'var(--color-danger)' }}>Produto indisponível</td>
                                      </tr>
                                    );
                                    const calcProd = obterDetalhesPrecificacao(prod);
                                    const precoPraticado = (prod.precoVendaManual !== undefined && prod.precoVendaManual > 0)
                                      ? prod.precoVendaManual
                                      : calcProd.precoVendaUnitario;
                                    const subtotal = precoPraticado * item.quantidade;

                                    return (
                                      <tr key={item.produtoId}>
                                        <td className="font-bold">{prod.nome}</td>
                                        <td>{item.quantidade} un</td>
                                        <td>R$ {precoPraticado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="font-bold">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Lado Direito: Detalhamento de Custos e Margens */}
                          <div className="premium-card" style={{ background: 'var(--bg-subtle)', border: 'none', padding: '1.25rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                              Detalhamento de Rentabilidade
                            </h4>

                            <div className="breakdown-table">
                              <div className="breakdown-row">
                                <span className="breakdown-name">Custo de Confecção Acumulado</span>
                                <span className="breakdown-val">R$ {calc.custoTotalInsumosMO.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div className="breakdown-row">
                                <span className="breakdown-name">Preço Base do Kit (Soma Unitária)</span>
                                <span className="breakdown-val">R$ {calc.precoBaseTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div className="breakdown-row">
                                <span className="breakdown-name">Lucro Embutido nos Produtos</span>
                                <span className="breakdown-val success">R$ {calc.lucroProdutosTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              {k.margemLucroKit > 0 && (
                                <>
                                  <div className="breakdown-row">
                                    <span className="breakdown-name">Preço com Margem Extra (+{k.margemLucroKit}%)</span>
                                    <span className="breakdown-val" style={{ color: 'var(--color-gold)', fontWeight: 700 }}>
                                      R$ {calc.precoVendaFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                  <div className="breakdown-row">
                                    <span className="breakdown-name">Lucro Extra do Kit</span>
                                    <span className="breakdown-val success">R$ {calc.lucroExtraKit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                </>
                              )}
                              <div className="breakdown-row" style={{ borderTop: '1px solid rgba(197, 163, 94, 0.15)', marginTop: '0.25rem', paddingTop: '0.5rem' }}>
                                <span className="breakdown-name" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>LUCRO TOTAL ARTESANAL</span>
                                <span className="breakdown-val success" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                                  R$ {calc.lucroTotalAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        // ==========================================
        // SUB-ABA: FORMULÁRIO DE CRIAÇÃO / EDIÇÃO
        // ==========================================
        <div className="premium-card" style={{ animation: 'cardFadeIn 0.4s ease-out' }}>
          <div className="card-title-group">
            <div className="card-title-left">
              <Gift size={18} />
              <h2 className="card-title">{editingKitId ? 'Alterar Kit & Precificação' : 'Montar Novo Kit'}</h2>
            </div>
            <button 
              className="btn-premium btn-secondary btn-sm"
              onClick={() => setIsCreatingKit(false)}
            >
              <X size={14} /> Fechar Criador
            </button>
          </div>

          <div className="two-col-layout">
            {/* Lado Esquerdo do Formulário */}
            <div>
              <form onSubmit={handleSaveKit}>
                <h3 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--color-gold)' }}>1. Dados do Kit</h3>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="kit-nome">Nome do Kit *</label>
                  <input 
                    id="kit-nome"
                    type="text" 
                    className="premium-input"
                    placeholder="Ex: Kit Dia das Mães Especial, Kit Lavanda Relax..."
                    value={kitForm.nome}
                    onChange={e => setKitForm(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="kit-desc">Descrição / Apresentação</label>
                  <textarea 
                    id="kit-desc"
                    className="premium-textarea"
                    placeholder="Descrição sobre as embalagens, fitas de cetim, flores desidratadas inclusas no kit..."
                    value={kitForm.descricao}
                    onChange={e => setKitForm(prev => ({ ...prev, descricao: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="kit-margem">
                    Margem de Lucro Extra do Kit
                    <span className="form-label-value">{kitForm.margemLucroKit}%</span>
                  </label>
                  <input 
                    id="kit-margem"
                    type="range"
                    min="0"
                    max="95"
                    className="premium-range"
                    value={kitForm.margemLucroKit}
                    onChange={e => setKitForm(prev => ({ ...prev, margemLucroKit: parseInt(e.target.value) || 0 }))}
                  />
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Defina 0% para repassar os lucros já embutidos nos produtos individuais, ou adicione uma margem extra sobre o kit completo.</p>
                </div>

                <h3 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-gold)' }}>
                  2. Adicionar Produtos ao Kit
                </h3>

                <div 
                  style={{ 
                    background: 'var(--bg-subtle)', 
                    padding: '1.25rem', 
                    borderRadius: '10px', 
                    border: '1px solid rgba(197, 163, 94, 0.1)', 
                    marginBottom: '1.5rem'
                  }}
                >
                  <div className="flex-row-gap" style={{ alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="kit-select-prod">Selecionar Produto</label>
                      <select 
                        id="kit-select-prod"
                        className="premium-select"
                        value={tempProdutoId}
                        onChange={e => setTempProdutoId(e.target.value)}
                      >
                        <option value="">-- Escolha um Produto --</option>
                        {produtos.map(p => {
                          const calc = obterDetalhesPrecificacao(p);
                          const precoExibido = (p.precoVendaManual !== undefined && p.precoVendaManual > 0)
                            ? p.precoVendaManual
                            : calc.precoVendaUnitario;
                          return (
                            <option key={p.id} value={p.id}>
                              {p.nome} (R$ {precoExibido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {tempProdutoId && (
                      <div className="form-group" style={{ marginBottom: 0, maxWidth: '120px' }}>
                        <label className="form-label" htmlFor="kit-prod-qtd">Qtd</label>
                        <input 
                          id="kit-prod-qtd"
                          type="number"
                          min="1"
                          className="premium-input"
                          placeholder="Ex: 2"
                          value={tempQuantidade}
                          onChange={e => setTempQuantidade(e.target.value)}
                        />
                      </div>
                    )}

                    <button 
                      type="button" 
                      className="btn-premium" 
                      onClick={handleAddProdutoAoKit}
                      style={{ padding: '0.8rem' }}
                    >
                      Incluir <PlusCircle size={16} />
                    </button>
                  </div>
                </div>

                {/* Lista de Produtos Adicionados */}
                <div className="selected-materials-list">
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Produtos Inclusos na Composição ({kitForm.produtos.length})
                  </span>

                  {kitForm.produtos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Nenhum produto incluído no kit ainda. Escolha no painel acima.
                    </div>
                  ) : (
                    kitForm.produtos.map(item => {
                      const prod = produtos.find(p => p.id === item.produtoId);
                      if (!prod) return null;

                      const calcProd = obterDetalhesPrecificacao(prod);
                      const precoExibido = (prod.precoVendaManual !== undefined && prod.precoVendaManual > 0)
                        ? prod.precoVendaManual
                        : calcProd.precoVendaUnitario;
                      const subtotal = precoExibido * item.quantidade;

                      return (
                        <div key={item.produtoId} className="selected-material-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-subtle)', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid rgba(197, 163, 94, 0.08)' }}>
                          <div className="selected-material-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span className="selected-material-name" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prod.nome}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Qtd:</span>
                              <input
                                type="number"
                                min="1"
                                value={item.quantidade}
                                onChange={e => {
                                  const novaQtd = Math.max(1, parseInt(e.target.value) || 1);
                                  setKitForm(prev => ({
                                    ...prev,
                                    produtos: prev.produtos.map(p =>
                                      p.produtoId === item.produtoId ? { ...p, quantidade: novaQtd } : p
                                    )
                                  }));
                                }}
                                className="premium-input"
                                style={{ width: '60px', padding: '0.2rem 0.4rem', height: '28px', fontSize: '0.85rem' }}
                              />
                              <span className="selected-material-meta" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                × R$ {precoExibido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                          <div className="selected-material-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span className="selected-material-cost" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <button 
                              type="button" 
                              className="btn-danger-outline"
                              style={{ padding: '0.25rem' }}
                              onClick={() => handleRemoverProdutoDoKit(item.produtoId)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <button type="submit" className="btn-premium" style={{ width: '100%', padding: '1rem', marginTop: '1.5rem' }}>
                  {editingKitId ? 'Salvar Edição de Kit' : 'Concluir & Registrar Kit'}
                </button>
              </form>
            </div>

            {/* Lado Direito do Formulário: Simulador de Precificação do Kit */}
            <div>
              <div className="premium-card pulse-card" style={{ background: '#ffffff', position: 'sticky', top: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>
                  Precificação do Kit em Tempo Real
                </h3>

                <PriceDisplayBox value={resumoForm.precoVendaFinal} label="Preço Sugerido do Kit Promocional" />

                <div className="metric-row" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <MetricCard label="Lucro Total Acumulado" value={`R$ ${resumoForm.lucroTotalAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} variation="success" />
                </div>

                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Composição Financeira do Kit
                  </h4>

                  <div className="breakdown-table">
                    <div className="breakdown-row">
                      <span className="breakdown-name">Custo Físico dos Produtos</span>
                      <span className="breakdown-val">R$ {resumoForm.custoTotalInsumosMO.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="breakdown-row">
                      <span className="breakdown-name">Preço Base do Kit (Soma)</span>
                      <span className="breakdown-val">R$ {resumoForm.precoBaseTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="breakdown-row">
                      <span className="breakdown-name" style={{ color: 'var(--color-success)', fontWeight: 600 }}>Lucro Original Embutido</span>
                      <span className="breakdown-val success">R$ {resumoForm.lucroProdutosTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    {kitForm.margemLucroKit > 0 && (
                      <>
                        <div className="breakdown-row" style={{ borderTop: '1px solid rgba(197, 163, 94, 0.12)', marginTop: '0.4rem', paddingTop: '0.8rem' }}>
                          <span className="breakdown-name" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Margem Extra do Kit</span>
                          <span className="breakdown-val" style={{ fontSize: '0.95rem' }}>{kitForm.margemLucroKit}%</span>
                        </div>
                        <div className="breakdown-row">
                          <span className="breakdown-name" style={{ color: 'var(--color-success)', fontWeight: 600 }}>Lucro Extra do Kit</span>
                          <span className="breakdown-val success">R$ {resumoForm.lucroExtraKit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <InfoNote 
                    text="Este simulador soma os preços praticados (sugerido ou manual) de cada produto. O controle de margem calcula o valor extra de markup de kit, permitindo descontos ou incrementos adicionais de margem sobre a embalagem/composição."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
