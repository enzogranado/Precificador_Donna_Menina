import { LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <>
      {/* Botão de Logout Fictício */}
      <div className="logout-container">
        <button 
          className="tab-button btn-secondary" 
          onClick={onLogout} 
          style={{ border: '1px solid rgba(195, 92, 89, 0.2)', color: 'var(--color-danger)' }}
        >
          <LogOut size={16} /> Sair do Painel
        </button>
      </div>

      {/* Cabeçalho */}
      <header className="app-header">
        <p className="brand-subtitle">Ateliê de Saboaria & Velas Aromáticas</p>
        <h1 className="brand-title">Donna Menina</h1>
      </header>
    </>
  );
}
