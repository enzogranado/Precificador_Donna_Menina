import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoginProps {
  emailInput: string;
  setEmailInput: (v: string) => void;
  senhaInput: string;
  setSenhaInput: (v: string) => void;
  loginError: string;
  onLogin: (e: React.FormEvent) => void;
}

export default function Login({
  emailInput,
  setEmailInput,
  senhaInput,
  setSenhaInput,
  loginError,
  onLogin
}: LoginProps) {
  return (
    <div className="login-overlay">
      <div className="login-card">
        <div className="text-center">
          <div className="login-logo">Donna Menina</div>
          <div className="login-title">Sabonetes & Velas</div>
          <p className="login-subtitle">
            Portal Inteligente de Precificação. Gerencie insumos, calcule tempos de produção e blinde sua margem de lucro.
          </p>
        </div>

        <form onSubmit={onLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="login-email">E-mail Corporativo</label>
            <input 
              id="login-email"
              type="email" 
              className="premium-input"
              placeholder="exemplo@donamenina.com.br"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="login-senha">Senha de Acesso</label>
            <input 
              id="login-senha"
              type="password" 
              className="premium-input"
              placeholder="••••••••"
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              required
            />
          </div>

          {loginError && (
            <div className="badge danger" style={{ padding: '0.5rem', width: '100%', justifyContent: 'center' }}>
              {loginError}
            </div>
          )}

          <button type="submit" className="btn-premium" style={{ marginTop: '0.5rem' }}>
            Acessar Ateliê <Sparkles size={18} />
          </button>
        </form>


      </div>
    </div>
  );
}
