import { Sparkles, Package, Layers } from 'lucide-react';
import type { Material, Produto } from '../types';
import MetricCard from '../components/MetricCard';
import EmptyState from '../components/EmptyState';

interface DashboardProps {
  email: string;
  custoPorMinuto: number;
  custoPorHora: number;
  materiaisCount: number;
  produtosCount: number;
  totalCustosFixos: number;
  produtos: Produto[];
  materiais: Material[];
  obterDetalhesPrecificacao: (p: Produto) => {
    custoMateriais: number;
    custoMaoObra: number;
    custoTotal: number;
    precoVenda: number;
    lucroReal: number;
    precoVendaUnitario: number;
    custoUnitario: number;
    lucroUnitario: number;
  };
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({
  email,
  custoPorMinuto,
  custoPorHora,
  materiaisCount,
  produtosCount,
  totalCustosFixos,
  produtos,
  materiais,
  obterDetalhesPrecificacao,
  setActiveTab
}: DashboardProps) {
  return (
    <div style={{ animation: 'cardFadeIn 0.4s ease-out' }}>
      {/* Executive Intro Card */}
      <div className="premium-card" style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(247, 244, 238, 0.7))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(197, 163, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Bem-vindo de volta ao Ateliê!</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Operando sob a sessão: <strong>{email}</strong></p>
          </div>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '800px' }}>
          Suas margens estão protegidas. Este painel integra automaticamente as flutuações de preços dos seus <strong>materiais de compra</strong> e seus <strong>custos de estrutura fixos</strong> com o tempo exato gasto na confecção de cada vela ou sabonete.
        </p>
      </div>

      {/* Grid de Métricas */}
      <div className="metric-row">
        <MetricCard 
          label="Mão de Obra / Minuto" 
          value={`R$ ${custoPorMinuto.toFixed(2)}`} 
          badgeText={`R$ ${custoPorHora.toFixed(2)} / hora`}
          variation="gold"
        />
        <MetricCard 
          label="Materiais Cadastrados" 
          value={materiaisCount} 
          badgeText="Glicerina, ceras, aromas..."
          variation="success"
        />
        <MetricCard 
          label="Catálogo de Produtos" 
          value={produtosCount} 
          badgeText="Fórmulas e precificações"
          variation="rose"
        />
        <MetricCard 
          label="Despesas Fixas Mensais" 
          value={`R$ ${totalCustosFixos.toFixed(2)}`} 
          badgeText="Luz, assinaturas, extras..."
        />
      </div>

      {/* Quick Overview Tables */}
      <div className="dashboard-grid">
        <div className="premium-card">
          <div className="card-title-group">
            <div className="card-title-left">
              <Layers size={18} />
              <h2 className="card-title">Resumo do Portfólio de Vendas</h2>
            </div>
            <button className="btn-premium btn-sm" onClick={() => setActiveTab('produtos')}>
              Ver Todos
            </button>
          </div>

          {produtos.length === 0 ? (
            <EmptyState 
              icon={<Layers size={36} />} 
              title="Nenhum produto cadastrado" 
              description="Cadastre seu primeiro produto com receita na aba correspondente."
            />
          ) : (
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Custo Total</th>
                    <th>Preço Sugerido</th>
                    <th>Margem</th>
                    <th>Retorno Líquido</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.slice(0, 4).map(p => {
                    const calc = obterDetalhesPrecificacao(p);
                    const rend = p.rendimento || 1;
                    return (
                      <tr key={p.id}>
                        <td className="font-bold">
                          {p.nome}
                          {rend > 1 && (
                            <span className="badge-unit" style={{ marginLeft: '0.4rem', fontSize: '0.65rem' }}>
                              Lote: {rend} un
                            </span>
                          )}
                        </td>
                        <td>R$ {calc.custoTotal.toFixed(2)}</td>
                        <td className="font-bold" style={{ color: 'var(--color-gold)' }}>
                          R$ {(rend > 1 ? calc.precoVendaUnitario : calc.precoVenda).toFixed(2)}
                          {rend > 1 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}> / un</span>}
                        </td>
                        <td><span className="badge gold">{p.margemLucro}%</span></td>
                        <td className="font-bold" style={{ color: 'var(--color-success)' }}>
                          R$ {(rend > 1 ? calc.lucroUnitario : calc.lucroReal).toFixed(2)}
                          {rend > 1 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}> / un</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="premium-card">
          <div className="card-title-group">
            <div className="card-title-left">
              <Package size={18} />
              <h2 className="card-title">Lista de Insumos Rápidos</h2>
            </div>
            <button className="btn-premium btn-sm" onClick={() => setActiveTab('materiais')}>
              Ver Todos
            </button>
          </div>

          {materiais.length === 0 ? (
            <EmptyState 
              icon={<Package size={36} />} 
              title="Sem insumos"
            />
          ) : (
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Tipo</th>
                    <th>Custo Unitário</th>
                  </tr>
                </thead>
                <tbody>
                  {materiais.slice(0, 5).map(m => (
                    <tr key={m.id}>
                      <td>{m.nome}</td>
                      <td><span className="badge rose">{m.unidadeMedida}</span></td>
                      <td className="font-bold">R$ {m.precoUnitario.toFixed(3)} / {m.unidadeMedida}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
