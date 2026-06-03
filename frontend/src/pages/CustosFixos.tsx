import React from 'react';
import { Briefcase, Plus, Trash2, Clock } from 'lucide-react';
import type { CustoFixo, ConfiguracaoTempo } from '../types';
import EmptyState from '../components/EmptyState';
import InfoNote from '../components/InfoNote';
import DecimalInput from '../components/DecimalInput';

interface CustosFixosProps {
  custosFixos: CustoFixo[];
  custoFixoForm: Partial<CustoFixo>;
  setCustoFixoForm: React.Dispatch<React.SetStateAction<Partial<CustoFixo>>>;
  configTempo: ConfiguracaoTempo;
  handleSaveCustoFixo: (e: React.FormEvent) => void;
  handleDeleteCustoFixo: (id: string) => void;
  handleConfigTempoChange: (field: keyof ConfiguracaoTempo, value: number) => void;
  totalCustosFixos: number;
  custoPorMinuto: number;
  custoPorHora: number;
  totalDespesasTrabalho: number;
  totalMinutosTrabalho: number;
}

export default function CustosFixos({
  custosFixos,
  custoFixoForm,
  setCustoFixoForm,
  configTempo,
  handleSaveCustoFixo,
  handleDeleteCustoFixo,
  handleConfigTempoChange,
  totalCustosFixos,
  custoPorMinuto,
  custoPorHora,
  totalDespesasTrabalho,
  totalMinutosTrabalho
}: CustosFixosProps) {
  return (
    <div className="two-col-layout" style={{ animation: 'cardFadeIn 0.4s ease-out' }}>
      
      {/* Painel Esquerdo: Cadastro de Despesas Fixas */}
      <div className="premium-card">
        <div className="card-title-group">
          <div className="card-title-left">
            <Briefcase size={18} />
            <h2 className="card-title">1. Despesas Fixas do Ateliê</h2>
          </div>
          <span className="badge warning">Mensal</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Adicione suas despesas fixas recorrentes de infraestrutura ou operação básica. Elas compõem a base do custo do seu minuto de trabalho.
        </p>

        <form onSubmit={handleSaveCustoFixo} style={{ marginBottom: '2rem' }}>
          <div className="flex-row-gap">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="custo-nome">Nome da Despesa *</label>
              <input 
                id="custo-nome"
                type="text" 
                className="premium-input"
                placeholder="Ex: Aluguel do Ateliê, Internet, Assinatura Canva..."
                value={custoFixoForm.nome || ''}
                onChange={e => setCustoFixoForm(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0, maxWidth: '160px' }}>
              <label className="form-label" htmlFor="custo-val">Valor Mensal *</label>
              <div className="input-wrapper">
                <span className="input-prefix">R$</span>
                <DecimalInput 
                  id="custo-val"
                  className="premium-input has-prefix"
                  placeholder="0,00"
                  value={custoFixoForm.valor}
                  onChange={val => setCustoFixoForm(prev => ({ ...prev, valor: val }))}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-premium" style={{ width: '100%', marginTop: '1.25rem' }}>
            Incluir Despesa Fixa <Plus size={16} />
          </button>
        </form>

        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Despesas Atuais Cadastradas
        </h3>

        {custosFixos.length === 0 ? (
          <EmptyState 
            icon={<Briefcase size={28} />} 
            title="Nenhum custo fixo"
          />
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Despesa</th>
                  <th>Valor Mensal</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {custosFixos.map(cf => (
                  <tr key={cf.id}>
                    <td>{cf.nome}</td>
                    <td className="font-bold">R$ {cf.valor.toFixed(2)}</td>
                    <td>
                      <button 
                        className="btn-danger-outline"
                        onClick={() => handleDeleteCustoFixo(cf.id)}
                        title="Remover Despesa"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--bg-subtle)', fontWeight: 700 }}>
                  <td>TOTAL ACUMULADO</td>
                  <td style={{ color: 'var(--color-gold)' }} colSpan={2}>
                    R$ {totalCustosFixos.toFixed(2)} / mês
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Painel Direito: Configuração da Taxa de Mão de Obra e Minuto */}
      <div className="premium-card">
        <div className="card-title-group">
          <div className="card-title-left">
            <Clock size={18} />
            <h2 className="card-title">2. Parametrização do Valor do Tempo</h2>
          </div>
          <span className="badge gold">Mão de Obra</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Para precificar o tempo físico de confecção de suas velas ou sabonetes, defina suas metas e carga horária abaixo.
        </p>

        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="form-label" htmlFor="param-prolabore">
            Salário / Pró-labore Desejado
            <span className="form-label-value">R$ {configTempo.proLabore.toFixed(2)}</span>
          </label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              id="param-prolabore"
              type="range"
              min="1000"
              max="12000"
              step="100"
              className="premium-range"
              value={configTempo.proLabore}
              onChange={e => handleConfigTempoChange('proLabore', parseInt(e.target.value))}
            />
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Quanto você deseja retirar por mês da empresa pelo seu trabalho artesanal.</p>
        </div>

        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
          <label className="form-label" htmlFor="param-horas">
            Horas de Trabalho Mensais Planejadas
            <span className="form-label-value">{configTempo.horasTrabalhoMes} horas/mês</span>
          </label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              id="param-horas"
              type="range"
              min="20"
              max="220"
              step="5"
              className="premium-range"
              value={configTempo.horasTrabalhoMes}
              onChange={e => handleConfigTempoChange('horasTrabalhoMes', parseInt(e.target.value))}
            />
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Média padrão: 40 horas semanais = 160 horas por mês. Menos tempo eleva o custo por minuto.</p>
        </div>

        {/* Resultado Final da Taxa por Minuto */}
        <div className="premium-card pulse-card" style={{ background: '#ffffff', border: '1px solid var(--border-color-focus)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Valor de Mão de Obra Calculado
          </span>
          <div className="price-display-value" style={{ fontSize: '2.8rem', marginTop: '0.25rem', marginBottom: '0.25rem' }}>
            R$ {custoPorMinuto.toFixed(2)} <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/ min</span>
          </div>
          
          <div className="breakdown-table" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
            <div className="breakdown-row">
              <span className="breakdown-name">Custo por Hora</span>
              <span className="breakdown-val">R$ {custoPorHora.toFixed(2)}</span>
            </div>
            <div className="breakdown-row">
              <span className="breakdown-name">Base de Custos Acumulada (Fixo + Salário)</span>
              <span className="breakdown-val">R$ {totalDespesasTrabalho.toFixed(2)}</span>
            </div>
            <div className="breakdown-row">
              <span className="breakdown-name">Total de Minutos de Trabalho</span>
              <span className="breakdown-val">{totalMinutosTrabalho} min/mês</span>
            </div>
          </div>

          <InfoNote 
            text={`Como isso te ajuda? Cada minuto que você passa moldando sabonetes ou envasando velas consome R$ ${custoPorMinuto.toFixed(2)} da sua estrutura geral. Esse cálculo é embutido na aba "Produtos" quando você define o tempo de fabricação de cada receita!`}
          />
        </div>
      </div>
    </div>
  );
}
