import { TrendingUp, Package, Layers, Briefcase, Gift } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsCreatingProduto: (isCreating: boolean) => void;
}

export default function Navbar({ activeTab, setActiveTab, setIsCreatingProduto }: NavbarProps) {
  return (
    <nav className="tabs-container">
      <button 
        className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => { setActiveTab('dashboard'); setIsCreatingProduto(false); }}
      >
        <TrendingUp size={16} /> Dashboard
      </button>
      <button 
        className={`tab-button ${activeTab === 'materiais' ? 'active' : ''}`}
        onClick={() => { setActiveTab('materiais'); setIsCreatingProduto(false); }}
      >
        <Package size={16} /> Insumos & Materiais
      </button>
      <button 
        className={`tab-button ${activeTab === 'produtos' ? 'active' : ''}`}
        onClick={() => { setActiveTab('produtos'); }}
      >
        <Layers size={16} /> Produtos e Receitas
      </button>
      <button 
        className={`tab-button ${activeTab === 'kits' ? 'active' : ''}`}
        onClick={() => { setActiveTab('kits'); setIsCreatingProduto(false); }}
      >
        <Gift size={16} /> Kits de Produtos
      </button>
      <button 
        className={`tab-button ${activeTab === 'custos' ? 'active' : ''}`}
        onClick={() => { setActiveTab('custos'); setIsCreatingProduto(false); }}
      >
        <Briefcase size={16} /> Custos Fixos & Mão de Obra
      </button>
    </nav>
  );
}
