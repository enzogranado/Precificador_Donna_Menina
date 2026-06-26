import React from 'react';
import { Layers, Search, Plus, Edit3, Trash2, Clock, PlusCircle, X } from 'lucide-react';
import type { Material, Produto, MaterialUsado } from '../types';
import EmptyState from '../components/EmptyState';
import InfoNote from '../components/InfoNote';
import PriceDisplayBox from '../components/PriceDisplayBox';
import MetricCard from '../components/MetricCard';
import DecimalInput from '../components/DecimalInput';

interface ProdutosProps {
  produtos: Produto[];
  materiais: Material[];
  custoPorMinuto: number;
  searchProduto: string;
  setSearchProduto: (v: string) => void;
  isCreatingProduto: boolean;
  setIsCreatingProduto: (v: boolean) => void;
  editingProdutoId: string | null;
  setEditingProdutoId: (v: string | null) => void;
  produtoForm: { nome: string; descricao: string; tempoProducao: number; margemLucro: number; materiaisUsados: MaterialUsado[]; rendimento: number; precoVendaManual?: number; };
  setProdutoForm: React.Dispatch<React.SetStateAction<{ nome: string; descricao: string; tempoProducao: number; margemLucro: number; materiaisUsados: MaterialUsado[]; rendimento: number; precoVendaManual?: number; }>>;
  tempMaterialId: string;
  setTempMaterialId: (v: string) => void;
  tempQuantidade: string;
  setTempQuantidade: (v: string) => void;
  expandedProdutoId: string | null;
  setExpandedProdutoId: (v: string | null) => void;
  handleAddMaterialAoProduto: () => void;
  handleRemoverMaterialDoProduto: (matId: string) => void;
  handleSaveProduto: (e: React.FormEvent) => void;
  handleEditProduto: (prod: Produto) => void;
  handleDeleteProduto: (id: string) => void;
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

export default function Produtos({
  produtos,
  materiais,
  custoPorMinuto,
  searchProduto,
  setSearchProduto,
  isCreatingProduto,
  setIsCreatingProduto,
  editingProdutoId,
  setEditingProdutoId,
  produtoForm,
  setProdutoForm,
  tempMaterialId,
  setTempMaterialId,
  tempQuantidade,
  setTempQuantidade,
  expandedProdutoId,
  setExpandedProdutoId,
  handleAddMaterialAoProduto,
  handleRemoverMaterialDoProduto,
  handleSaveProduto,
  handleEditProduto,
  handleDeleteProduto,
  obterDetalhesPrecificacao
}: ProdutosProps) {
  
  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(searchProduto.toLowerCase())
  );

  const calcularResumoFormularioProduto = () => {
    const custoMateriais = produtoForm.materiaisUsados.reduce((sum, item) => {
      const mat = materiais.find(m => m.id === item.materialId);
      if (!mat) return sum;
      return sum + (item.quantidadeNecessaria * mat.precoUnitario);
    }, 0);

    const custoMaoObra = produtoForm.tempoProducao * custoPorMinuto;
    const custoTotal = custoMateriais + custoMaoObra;

    const divisor = (100 - produtoForm.margemLucro) / 100;
    const precoVenda = divisor > 0 ? (custoTotal / divisor) : custoTotal * 1.5;
    const lucroReal = precoVenda - custoTotal;
    const rendimento = produtoForm.rendimento || 1;

    const precoManualTotal = produtoForm.precoVendaManual ? (produtoForm.precoVendaManual * rendimento) : undefined;
    const margemLucroManualReal = (precoManualTotal !== undefined && precoManualTotal > 0)
      ? ((precoManualTotal - custoTotal) / precoManualTotal) * 100
      : undefined;
    const lucroManualReal = precoManualTotal !== undefined ? (precoManualTotal - custoTotal) : undefined;
    const lucroManualUnitario = (lucroManualReal !== undefined) ? (lucroManualReal / rendimento) : undefined;

    return {
      custoMateriais,
      custoMaoObra,
      custoTotal,
      precoVenda,
      lucroReal,
      precoVendaUnitario: precoVenda / rendimento,
      custoUnitario: custoTotal / rendimento,
      lucroUnitario: lucroReal / rendimento,
      precoVendaManual: produtoForm.precoVendaManual,
      precoManualTotal,
      margemLucroManualReal,
      lucroManualReal,
      lucroManualUnitario
    };
  };

  const resumoForm = calcularResumoFormularioProduto();

  return (
    <div style={{ animation: 'cardFadeIn 0.4s ease-out' }}>
      
      {/* Seletor se está CRIANDO ou LISTANDO produtos */}
      {!isCreatingProduto ? (
        // ==========================================
        // SUB-ABA: LISTAR PRODUTOS CADASTRADOS
        // ==========================================
        <div className="premium-card">
          <div className="card-title-group">
            <div className="card-title-left">
              <Layers size={20} />
              <h2 className="card-title">Catálogo de Produtos Donna Menina</h2>
            </div>
            <button 
              className="btn-premium"
              onClick={() => {
                setEditingProdutoId(null);
                setProdutoForm({
                  nome: '',
                  descricao: '',
                  tempoProducao: 20,
                  margemLucro: 40,
                  materiaisUsados: [],
                  rendimento: 1
                });
                setIsCreatingProduto(true);
              }}
            >
              Novo Produto <Plus size={18} />
            </button>
          </div>

          {/* Caixa de busca de produtos */}
          <div className="form-group" style={{ maxWidth: '400px', marginBottom: '2rem' }}>
            <div className="input-wrapper">
              <span className="input-prefix"><Search size={16} /></span>
              <input 
                type="text" 
                className="premium-input"
                style={{ paddingLeft: '2.2rem' }}
                placeholder="Pesquisar produto pelo nome..."
                value={searchProduto}
                onChange={e => setSearchProduto(e.target.value)}
              />
            </div>
          </div>

          {produtosFiltrados.length === 0 ? (
            <EmptyState 
              icon={<Layers size={48} />} 
              title="Nenhum produto cadastrado" 
              description="Cadastre receitas para obter cálculos precisos de custos e markup sugerido."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {produtosFiltrados.map(p => {
                const calc = obterDetalhesPrecificacao(p);
                const isExpanded = expandedProdutoId === p.id;
                const rend = p.rendimento || 1;

                return (
                  <div 
                    key={p.id} 
                    className="premium-card" 
                    style={{ 
                      padding: '1.5rem', 
                      borderLeft: '4px solid var(--color-gold)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div className="product-card-header">
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.nome}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '600px' }}>
                          {p.descricao || 'Sem descrição cadastrada.'}
                        </p>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                          <span className="badge gold">
                            <Clock size={12} style={{ marginRight: '4px' }} /> {p.tempoProducao} min. fabricação
                          </span>
                          <span className="badge rose">
                            {p.materiaisUsados.length} ingredientes
                          </span>
                          <span className="badge success">
                            Margem: {p.margemLucro}%
                          </span>
                          {p.rendimento && p.rendimento > 1 && (
                            <span className="badge warning">
                              Rendimento: {p.rendimento} un.
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="product-card-actions">
                        {p.precoVendaManual && p.precoVendaManual > 0 && (
                          <div className="product-price-block" style={{ borderRight: '1px solid rgba(197, 163, 94, 0.2)', paddingRight: '1.5rem' }}>
                            <span className="price-label" style={{ color: 'var(--text-muted)' }}>
                              Preço Praticado (Manual)
                            </span>
                            <div className="price-value" style={{ color: 'var(--text-primary)' }}>
                              R$ {p.precoVendaManual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <span className="price-subtitle" style={{ color: (calc.lucroManualUnitario || 0) >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                              Margem: {(calc.margemLucroManualReal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                            </span>
                          </div>
                        )}
                        <div className="product-price-block">
                          <span className="price-label">
                            {p.rendimento && p.rendimento > 1 ? 'Sugerido / Unidade' : 'Preço Venda Sugerido'}
                          </span>
                          <div className="price-value" style={{ color: 'var(--color-gold)' }}>
                            R$ {(p.rendimento && p.rendimento > 1 ? calc.precoVendaUnitario : calc.precoVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <span className="price-subtitle" style={{ color: 'var(--color-success)' }}>
                            {p.rendimento && p.rendimento > 1 
                              ? `Lucro Unitário: R$ ${calc.lucroUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : `Lucro Real: R$ ${calc.lucroReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            }
                          </span>
                        </div>

                        <div className="product-btns-col">
                          <button 
                            className="btn-premium btn-sm"
                            onClick={() => setExpandedProdutoId(isExpanded ? null : p.id)}
                          >
                            {isExpanded ? 'Esconder Receita' : 'Ver Detalhes'}
                          </button>
                          <div className="product-btns-row">
                            <button 
                              className="btn-danger-outline" 
                              style={{ flex: 1, color: 'var(--color-gold)', borderColor: 'rgba(197, 163, 94, 0.2)' }}
                              onClick={() => handleEditProduto(p)}
                              title="Editar Produto"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button 
                              className="btn-danger-outline" 
                              style={{ flex: 1 }}
                              onClick={() => handleDeleteProduto(p.id)}
                              title="Excluir Produto"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes Expandidos da Receita */}
                    {isExpanded && (
                      <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(197, 163, 94, 0.1)', paddingTop: '1.5rem', animation: 'cardFadeIn 0.3s ease-out' }}>
                        <div className="two-col-layout">
                          {/* Lado Esquerdo: Ingredientes Usados */}
                          <div>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                              Insumos Utilizados nesta Receita
                            </h4>

                            {p.materiaisUsados.length === 0 ? (
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nenhum material associado.</p>
                            ) : (
                              <div className="table-container">
                                <table className="premium-table" style={{ fontSize: '0.85rem' }}>
                                  <thead>
                                    <tr>
                                      <th>Insumo</th>
                                      <th>Qtd. Necessária</th>
                                      <th>Custo Proporcional</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {p.materiaisUsados.map(mu => {
                                      const mat = materiais.find(m => m.id === mu.materialId);
                                      if (!mat) return (
                                        <tr key={mu.materialId}>
                                          <td colSpan={3} style={{ color: 'var(--color-danger)' }}>Insumo excluído do sistema</td>
                                        </tr>
                                      );
                                      const custoProp = mu.quantidadeNecessaria * mat.precoUnitario;
                                      return (
                                        <tr key={mu.materialId}>
                                          <td>{mat.nome}</td>
                                          <td>{mu.quantidadeNecessaria} {mat.unidadeMedida}</td>
                                          <td className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                            R$ {custoProp.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>

                          {/* Lado Direito: Detalhamento Técnico Financeiro */}
                          <div className="premium-card" style={{ background: 'var(--bg-subtle)', border: 'none', padding: '1.25rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                              Detalhamento de Absorção de Custos
                            </h4>
                            
                            <div className="breakdown-table">
                              <div className="breakdown-row">
                                <span className="breakdown-name">
                                  <span className="breakdown-dot" style={{ background: 'var(--color-rose)' }}></span>
                                  Custo de Insumos
                                </span>
                                <span className="breakdown-val">R$ {calc.custoMateriais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>

                              <div className="breakdown-row">
                                <span className="breakdown-name">
                                  <span className="breakdown-dot" style={{ background: 'var(--color-gold)' }}></span>
                                  Mão de Obra ({p.tempoProducao} min)
                                </span>
                                <span className="breakdown-val">R$ {calc.custoMaoObra.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>

                              <div className="breakdown-row" style={{ borderTop: '1px solid rgba(197, 163, 94, 0.15)', marginTop: '0.25rem', paddingTop: '0.5rem' }}>
                                <span className="breakdown-name" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                  Custo Total Fabricação
                                </span>
                                <span className="breakdown-val" style={{ fontSize: '0.95rem' }}>R$ {calc.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>

                              <div className="breakdown-row">
                                <span className="breakdown-name" style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                                  Lucro Esperado ({p.margemLucro}%)
                                </span>
                                <span className="breakdown-val success" style={{ fontSize: '0.95rem' }}>R$ {calc.lucroReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                            </div>
                            {p.rendimento && p.rendimento > 1 && (
                              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed rgba(197, 163, 94, 0.25)' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
                                  Análise Individual (Rendimento: {p.rendimento} un)
                                </h4>
                                <div className="breakdown-table" style={{ background: '#ffffff', borderRadius: '8px', padding: '0.4rem', border: '1px solid rgba(197, 163, 94, 0.08)' }}>
                                  <div className="breakdown-row" style={{ padding: '0.4rem 0.25rem' }}>
                                    <span className="breakdown-name">Custo Unitário</span>
                                    <span className="breakdown-val">R$ {calc.custoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="breakdown-row" style={{ padding: '0.4rem 0.25rem' }}>
                                    <span className="breakdown-name" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Venda Sugerida/Un</span>
                                    <span className="breakdown-val" style={{ color: 'var(--color-gold)', fontWeight: 800 }}>R$ {calc.precoVendaUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="breakdown-row" style={{ padding: '0.4rem 0.25rem', borderBottom: 'none' }}>
                                    <span className="breakdown-name" style={{ color: 'var(--color-success)', fontWeight: 600 }}>Lucro Unitário</span>
                                    <span className="breakdown-val success">R$ {calc.lucroUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {p.precoVendaManual && p.precoVendaManual > 0 && (
                              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed rgba(197, 163, 94, 0.25)' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-rose)', marginBottom: '0.5rem' }}>
                                  Análise do Preço Praticado (Manual)
                                </h4>
                                <div className="breakdown-table" style={{ background: '#ffffff', borderRadius: '8px', padding: '0.4rem', border: '1px solid rgba(197, 163, 94, 0.08)' }}>
                                  <div className="breakdown-row" style={{ padding: '0.4rem 0.25rem' }}>
                                    <span className="breakdown-name">Custo de Insumos / un</span>
                                    <span className="breakdown-val">R$ {(calc.custoMateriais / rend).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="breakdown-row" style={{ padding: '0.4rem 0.25rem' }}>
                                    <span className="breakdown-name">Custo Mão de Obra / un</span>
                                    <span className="breakdown-val">R$ {(calc.custoMaoObra / rend).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="breakdown-row" style={{ padding: '0.4rem 0.25rem' }}>
                                    <span className="breakdown-name">Preço Praticado / un</span>
                                    <span className="breakdown-val" style={{ color: 'var(--text-primary)', fontWeight: 800 }}>R$ {p.precoVendaManual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  </div>
                                  <div className="breakdown-row" style={{ padding: '0.4rem 0.25rem', borderBottom: 'none' }}>
                                    <span className="breakdown-name" style={{ color: (calc.lucroManualUnitario || 0) >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>Margem Praticada</span>
                                    <span className="breakdown-val" style={{ color: (calc.lucroManualUnitario || 0) >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 800 }}>
                                      {(calc.margemLucroManualReal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
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
              <Layers size={18} />
              <h2 className="card-title">{editingProdutoId ? 'Alterar Produto & Receita' : 'Montar Novo Produto'}</h2>
            </div>
            <button 
              className="btn-premium btn-secondary btn-sm"
              onClick={() => setIsCreatingProduto(false)}
            >
              <X size={14} /> Fechar Criador
            </button>
          </div>

          <div className="two-col-layout">
            {/* Lado Esquerdo do Formulário: Dados Básicos e Escolha de Insumos */}
            <div>
              <form onSubmit={handleSaveProduto}>
                <h3 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--color-gold)' }}>1. Dados do Produto</h3>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-nome">Nome do Produto *</label>
                  <input 
                    id="prod-nome"
                    type="text" 
                    className="premium-input"
                    placeholder="Ex: Vela Capim Limão 180g, Sabonete Argila Verde..."
                    value={produtoForm.nome}
                    onChange={e => setProdutoForm(prev => ({ ...prev, nome: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prod-desc">Descrição / Detalhes</label>
                  <textarea 
                    id="prod-desc"
                    className="premium-textarea"
                    placeholder="Escreva propriedades do produto, tipo de pote, pavio, colorações ou técnicas usadas..."
                    value={produtoForm.descricao}
                    onChange={e => setProdutoForm(prev => ({ ...prev, descricao: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prod-rendimento">
                    Rendimento do Lote / Barra (Unidades) *
                    <span className="form-label-value">{produtoForm.rendimento} unidades</span>
                  </label>
                  <input 
                    id="prod-rendimento"
                    type="text"
                    inputMode="numeric"
                    className="premium-input"
                    placeholder="Ex: 8 sabonetes da barra, 1 vela..."
                    value={produtoForm.rendimento === 0 ? '' : produtoForm.rendimento}
                    onChange={e => {
                      const cleanVal = e.target.value.replace(/[^0-9]/g, '').replace(/^0+/, '');
                      const parsed = parseInt(cleanVal, 10);
                      setProdutoForm(prev => ({ ...prev, rendimento: isNaN(parsed) ? 0 : parsed }));
                    }}
                    onBlur={() => {
                      if (produtoForm.rendimento === 0) {
                        setProdutoForm(prev => ({ ...prev, rendimento: 1 }));
                      }
                    }}
                    required
                  />
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Indique quantas unidades menores esta receita/barra rende (padrão: 1).</p>
                </div>

                <div className="flex-row-gap">
                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-tempo">
                      Tempo de Confecção *
                      <span className="form-label-value">{produtoForm.tempoProducao} minutos</span>
                    </label>
                    <input 
                      id="prod-tempo"
                      type="range"
                      min="1"
                      max="240"
                      className="premium-range"
                      value={produtoForm.tempoProducao}
                      onChange={e => setProdutoForm(prev => ({ ...prev, tempoProducao: parseInt(e.target.value) || 1 }))}
                    />
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Custo estimado M.O: R$ {(produtoForm.tempoProducao * custoPorMinuto).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-margem">
                      Margem de Lucro Desejada *
                      <span className="form-label-value">{produtoForm.margemLucro}%</span>
                    </label>
                    <input 
                      id="prod-margem"
                      type="range"
                      min="5"
                      max="95"
                      className="premium-range"
                      value={produtoForm.margemLucro}
                      onChange={e => setProdutoForm(prev => ({ ...prev, margemLucro: parseInt(e.target.value) || 5 }))}
                    />
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Base de cálculo: Markup Divisor Protetivo</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="prod-preco-manual">
                      Preço de Venda Manual (R$)
                    </label>
                    <div className="input-wrapper">
                      <span className="input-prefix">R$</span>
                      <DecimalInput 
                        id="prod-preco-manual"
                        className="premium-input has-prefix"
                        placeholder="Ex: 15,00 (deixe em branco para sugerido)"
                        value={produtoForm.precoVendaManual}
                        onChange={val => setProdutoForm(prev => ({ ...prev, precoVendaManual: val }))}
                      />
                    </div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Indique o preço real por unidade que você deseja cobrar (opcional).</p>
                  </div>
                </div>

                <h3 style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-gold)' }}>
                  2. Ingredientes / Materiais da Receita
                </h3>

                {/* Caixa de Inserção de Insumo no Produto */}
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
                      <label className="form-label" htmlFor="prod-select-mat">Selecionar Material</label>
                      <select 
                        id="prod-select-mat"
                        className="premium-select"
                        value={tempMaterialId}
                        onChange={e => setTempMaterialId(e.target.value)}
                      >
                        <option value="">-- Escolha um Insumo --</option>
                        {materiais.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.nome} (R$ {m.precoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}/{m.unidadeMedida})
                          </option>
                        ))}
                      </select>
                    </div>

                    {tempMaterialId && (
                      <div className="form-group" style={{ marginBottom: 0, maxWidth: '140px' }}>
                        <label className="form-label" htmlFor="prod-mat-qtd">
                          Qtd. (em {materiais.find(m => m.id === tempMaterialId)?.unidadeMedida})
                        </label>
                        <input 
                          id="prod-mat-qtd"
                          type="text"
                          inputMode="decimal"
                          className="premium-input"
                          placeholder="0,00"
                          value={tempQuantidade}
                          onChange={e => {
                            const val = e.target.value.replace(/[^0-9.,]/g, '');
                            setTempQuantidade(val);
                          }}
                        />
                      </div>
                    )}

                    <button 
                      type="button" 
                      className="btn-premium" 
                      onClick={handleAddMaterialAoProduto}
                      style={{ padding: '0.8rem' }}
                    >
                      Incluir <PlusCircle size={16} />
                    </button>
                  </div>
                </div>

                {/* Lista dos Insumos Incluídos até agora */}
                <div className="selected-materials-list">
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Lista de Insumos da Receita ({produtoForm.materiaisUsados.length})
                  </span>

                  {produtoForm.materiaisUsados.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Nenhum insumo incluído na receita ainda. Escolha no painel acima.
                    </div>
                  ) : (
                    produtoForm.materiaisUsados.map(mu => {
                      const mat = materiais.find(m => m.id === mu.materialId);
                      if (!mat) return null;
                      const custoItem = mu.quantidadeNecessaria * mat.precoUnitario;

                      return (
                        <div key={mu.materialId} className="selected-material-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-subtle)', borderRadius: '8px', marginBottom: '0.5rem', border: '1px solid rgba(197, 163, 94, 0.08)' }}>
                          <div className="selected-material-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span className="selected-material-name" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{mat.nome}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Qtd:</span>
                              <DecimalInput
                                value={mu.quantidadeNecessaria}
                                onChange={val => {
                                  const novaQtd = val === undefined ? 0 : val;
                                  setProdutoForm(prev => ({
                                    ...prev,
                                    materiaisUsados: prev.materiaisUsados.map(item =>
                                      item.materialId === mu.materialId ? { ...item, quantidadeNecessaria: novaQtd } : item
                                    )
                                  }));
                                }}
                                className="premium-input"
                                style={{ width: '85px', padding: '0.2rem 0.4rem', height: '28px', fontSize: '0.85rem' }}
                              />
                              <span className="selected-material-meta" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {mat.unidadeMedida} × R$ {mat.precoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                              </span>
                            </div>
                          </div>
                          <div className="selected-material-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span className="selected-material-cost" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>R$ {custoItem.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <button 
                              type="button" 
                              className="btn-danger-outline"
                              style={{ padding: '0.25rem' }}
                              onClick={() => handleRemoverMaterialDoProduto(mu.materialId)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <button type="submit" className="btn-premium" style={{ width: '100%', padding: '1rem' }}>
                  {editingProdutoId ? 'Salvar Edição de Produto' : 'Concluir & Registrar Produto'}
                </button>
              </form>
            </div>

            {/* Lado Direito do Formulário: Simulador de Precificação do Produto em Tempo Real */}
            <div>
              <div className="premium-card pulse-card" style={{ background: '#ffffff', position: 'sticky', top: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>
                  Simulação da Receita em Tempo Real
                </h3>

                {/* Preço de venda final sugerido */}
                <PriceDisplayBox value={resumoForm.precoVenda} label="Preço Venda Final Sugerido" />

                <div className="metric-row" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <MetricCard label="Lucro Líquido Real" value={`R$ ${resumoForm.lucroReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} variation="success" />
                </div>

                {/* Divisão dos custos */}
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Composição do Preço de Venda
                  </h4>

                  <div className="breakdown-table">
                    <div className="breakdown-row">
                      <span className="breakdown-name">
                        <span className="breakdown-dot" style={{ background: 'var(--color-rose)' }}></span>
                        Custo de Insumos / Insumos
                      </span>
                      <span className="breakdown-val">R$ {resumoForm.custoMateriais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="breakdown-row">
                      <span className="breakdown-name">
                        <span className="breakdown-dot" style={{ background: 'var(--color-gold)' }}></span>
                        Tempo Mão de Obra ({produtoForm.tempoProducao} min)
                      </span>
                      <span className="breakdown-val">R$ {resumoForm.custoMaoObra.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="breakdown-row" style={{ borderTop: '1px solid rgba(197, 163, 94, 0.12)', marginTop: '0.4rem', paddingTop: '0.8rem' }}>
                      <span className="breakdown-name" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        Custo Total Acumulado
                      </span>
                      <span className="breakdown-val" style={{ fontSize: '0.95rem' }}>R$ {resumoForm.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>

                    <div className="breakdown-row">
                      <span className="breakdown-name">
                        <span className="breakdown-dot" style={{ background: 'var(--color-success)', fontWeight: 700 }}></span>
                        Retorno / Margem Desejada
                        <span className="breakdown-percent">{produtoForm.margemLucro}%</span>
                      </span>
                      <span className="breakdown-val success" style={{ fontSize: '0.95rem' }}>R$ {resumoForm.lucroReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {produtoForm.rendimento > 1 && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed rgba(197, 163, 94, 0.25)' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                        Análise por Unidade Individual (Rendimento: {produtoForm.rendimento} un)
                      </h4>
                      <div className="breakdown-table" style={{ background: 'var(--bg-subtle)', borderRadius: '8px', padding: '0.5rem' }}>
                        <div className="breakdown-row" style={{ padding: '0.5rem 0.25rem' }}>
                          <span className="breakdown-name">Custo por Sabonete/Vela</span>
                          <span className="breakdown-val">R$ {resumoForm.custoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="breakdown-row" style={{ padding: '0.5rem 0.25rem' }}>
                          <span className="breakdown-name" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Preço de Venda Unitário</span>
                          <span className="breakdown-val" style={{ color: 'var(--color-gold)', fontWeight: 800 }}>R$ {resumoForm.precoVendaUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="breakdown-row" style={{ padding: '0.5rem 0.25rem', borderBottom: 'none' }}>
                          <span className="breakdown-name" style={{ color: 'var(--color-success)', fontWeight: 600 }}>Lucro Líquido Individual</span>
                          <span className="breakdown-val success">R$ {resumoForm.lucroUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {resumoForm.precoVendaManual !== undefined && resumoForm.precoVendaManual > 0 && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed rgba(197, 163, 94, 0.25)', animation: 'cardFadeIn 0.3s ease-out' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-rose)', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>
                        Análise do Preço Manual Praticado
                      </h4>
                      <div className="breakdown-table" style={{ background: 'var(--bg-subtle)', borderRadius: '8px', padding: '0.5rem' }}>
                        <div className="breakdown-row" style={{ padding: '0.5rem 0.25rem' }}>
                          <span className="breakdown-name">Preço Manual / un</span>
                          <span className="breakdown-val" style={{ color: 'var(--color-gold)', fontWeight: 800 }}>
                            R$ {resumoForm.precoVendaManual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="breakdown-row" style={{ padding: '0.5rem 0.25rem' }}>
                          <span className="breakdown-name">Custo de Insumos / un</span>
                          <span className="breakdown-val">
                            R$ {(resumoForm.custoMateriais / (produtoForm.rendimento || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="breakdown-row" style={{ padding: '0.5rem 0.25rem' }}>
                          <span className="breakdown-name">Custo Mão de Obra / un</span>
                          <span className="breakdown-val">
                            R$ {(resumoForm.custoMaoObra / (produtoForm.rendimento || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="breakdown-row" style={{ padding: '0.5rem 0.25rem' }}>
                          <span className="breakdown-name" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Lucro Líquido / un</span>
                          <span className="breakdown-val success" style={{ color: (resumoForm.lucroManualUnitario || 0) >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            R$ {(resumoForm.lucroManualUnitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="breakdown-row" style={{ padding: '0.5rem 0.25rem', borderBottom: 'none' }}>
                          <span className="breakdown-name" style={{ color: 'var(--color-success)', fontWeight: 600 }}>Margem Real Calculada</span>
                          <span className="breakdown-val success" style={{ color: (resumoForm.lucroManualUnitario || 0) >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 800 }}>
                            {(resumoForm.margemLucroManualReal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nota de Cálculo */}
                  <InfoNote 
                    text={`Fórmula Markup Divisor: garante que a margem de ${produtoForm.margemLucro}% recaia sobre o Preço de Venda Final, blindando você contra perdas operacionais invisíveis.`}
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
