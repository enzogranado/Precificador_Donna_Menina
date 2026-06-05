import React from 'react';
import { Package, Layers, Search, Plus, Edit3, Trash2, X } from 'lucide-react';
import type { Material } from '../types';
import EmptyState from '../components/EmptyState';
import DecimalInput from '../components/DecimalInput';

interface MateriaisProps {
  materiais: Material[];
  materialForm: Partial<Material>;
  setMaterialForm: React.Dispatch<React.SetStateAction<Partial<Material>>>;
  editingMaterialId: string | null;
  setEditingMaterialId: (id: string | null) => void;
  searchMaterial: string;
  setSearchMaterial: (v: string) => void;
  handleSaveMaterial: (e: React.FormEvent) => void;
  handleEditMaterial: (mat: Material) => void;
  handleDeleteMaterial: (id: string) => void;
}

export default function Materiais({
  materiais,
  materialForm,
  setMaterialForm,
  editingMaterialId,
  setEditingMaterialId,
  searchMaterial,
  setSearchMaterial,
  handleSaveMaterial,
  handleEditMaterial,
  handleDeleteMaterial
}: MateriaisProps) {
  const materiaisFiltrados = materiais.filter(m => 
    m.nome.toLowerCase().includes(searchMaterial.toLowerCase())
  );

  return (
    <div className="two-col-layout" style={{ animation: 'cardFadeIn 0.4s ease-out' }}>
      
      {/* Painel Esquerdo: Cadastro / Edição */}
      <div className="premium-card">
        <div className="card-title-group">
          <div className="card-title-left">
            <Package size={18} />
            <h2 className="card-title">{editingMaterialId ? 'Editar Material de Compra' : 'Novo Material de Compra'}</h2>
          </div>
          {editingMaterialId && (
            <button 
              className="btn-danger-outline" 
              onClick={() => {
                setEditingMaterialId(null);
                setMaterialForm({ nome: '', precoTotal: undefined, quantidadeTotal: undefined, unidadeMedida: 'g' });
              }}
              title="Cancelar Edição"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <form onSubmit={handleSaveMaterial}>
          <div className="form-group">
            <label className="form-label" htmlFor="mat-nome">Nome do Insumo *</label>
            <input 
              id="mat-nome"
              type="text" 
              className="premium-input"
              placeholder="Ex: Cera de Coco, Essência Lavanda, Pavio..."
              value={materialForm.nome || ''}
              onChange={e => setMaterialForm(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
          </div>

          <div className="flex-row-gap">
            <div className="form-group">
              <label className="form-label" htmlFor="mat-preco">Preço de Compra *</label>
              <div className="input-wrapper">
                <span className="input-prefix">R$</span>
                <DecimalInput 
                  id="mat-preco"
                  className="premium-input has-prefix"
                  placeholder="0,00"
                  value={materialForm.precoTotal}
                  onChange={val => setMaterialForm(prev => ({ ...prev, precoTotal: val }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mat-qtd">Quantidade Comprada *</label>
              <DecimalInput 
                id="mat-qtd"
                className="premium-input"
                placeholder="Ex: 1000, 100, 50"
                value={materialForm.quantidadeTotal}
                onChange={val => setMaterialForm(prev => ({ ...prev, quantidadeTotal: val }))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Unidade de Medida *</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input 
                  type="radio" 
                  name="unidadeMedida" 
                  value="g" 
                  checked={materialForm.unidadeMedida === 'g'}
                  onChange={() => setMaterialForm(prev => ({ ...prev, unidadeMedida: 'g' }))}
                  style={{ accentColor: 'var(--color-gold)' }}
                />
                Gramas (g)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input 
                  type="radio" 
                  name="unidadeMedida" 
                  value="ml" 
                  checked={materialForm.unidadeMedida === 'ml'}
                  onChange={() => setMaterialForm(prev => ({ ...prev, unidadeMedida: 'ml' }))}
                  style={{ accentColor: 'var(--color-gold)' }}
                />
                Mililitros (ml)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input 
                  type="radio" 
                  name="unidadeMedida" 
                  value="un" 
                  checked={materialForm.unidadeMedida === 'un'}
                  onChange={() => setMaterialForm(prev => ({ ...prev, unidadeMedida: 'un' }))}
                  style={{ accentColor: 'var(--color-gold)' }}
                />
                Unidades (un)
              </label>
            </div>
          </div>

          {/* Pré-visualização do Custo Unitário */}
          {materialForm.precoTotal !== undefined && materialForm.quantidadeTotal !== undefined && materialForm.precoTotal > 0 && materialForm.quantidadeTotal > 0 && (
            <div className="price-display-box" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
              <span className="price-display-title">Custo Unitário Calculado</span>
              <div className="price-display-value" style={{ fontSize: '1.8rem' }}>
                R$ {(materialForm.precoTotal / materialForm.quantidadeTotal).toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                por {materialForm.unidadeMedida} de insumo
              </span>
            </div>
          )}

          <button type="submit" className="btn-premium" style={{ width: '100%' }}>
            {editingMaterialId ? 'Atualizar Material' : 'Cadastrar Insumo'} <Plus size={16} />
          </button>
        </form>
      </div>

      {/* Painel Direito: Tabela / Listagem */}
      <div className="premium-card">
        <div className="card-title-group">
          <div className="card-title-left">
            <Layers size={18} />
            <h2 className="card-title">Insumos Cadastrados</h2>
          </div>
          <span className="badge gold">{materiaisFiltrados.length} Total</span>
        </div>

        {/* Caixa de Busca */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <div className="input-wrapper">
            <span className="input-prefix" style={{ left: '0.8rem' }}><Search size={16} /></span>
            <input 
              type="text" 
              className="premium-input"
              style={{ paddingLeft: '2.2rem' }}
              placeholder="Pesquisar insumo pelo nome..."
              value={searchMaterial}
              onChange={e => setSearchMaterial(e.target.value)}
            />
          </div>
        </div>

        {materiaisFiltrados.length === 0 ? (
          <EmptyState 
            icon={<Package size={40} />} 
            title="Nenhum insumo encontrado" 
            description="Tente reescrever a busca ou adicione um novo material ao lado."
          />
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Lote Compra</th>
                  <th>Custo Unitário</th>
                  <th style={{ width: '90px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {materiaisFiltrados.map(m => (
                  <tr key={m.id} style={{ background: editingMaterialId === m.id ? 'rgba(197, 163, 94, 0.05)' : '' }}>
                    <td>
                      <div className="font-bold">{m.nome}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {m.id}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>R$ {m.precoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Qtd: {m.quantidadeTotal} {m.unidadeMedida}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold" style={{ color: 'var(--color-gold)' }}>
                        R$ {m.precoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                      </div>
                      <span className="badge-unit">por {m.unidadeMedida}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button 
                          className="btn-danger-outline" 
                          style={{ color: 'var(--color-gold)', borderColor: 'rgba(197, 163, 94, 0.2)' }}
                          onClick={() => handleEditMaterial(m)}
                          title="Editar Material"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button 
                          className="btn-danger-outline" 
                          onClick={() => handleDeleteMaterial(m.id)}
                          title="Excluir Material"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
