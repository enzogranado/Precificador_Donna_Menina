import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ marginTop: '5rem', borderTop: '1px solid rgba(197, 163, 94, 0.1)', paddingTop: '2rem', paddingBottom: '2rem', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <Sparkles size={14} style={{ color: 'var(--color-gold)' }} />
        <span>Garantia de Margem Protetiva Donna Menina Sabonetes & Velas</span>
      </div>
      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
        Tecnologia Light Luxury integrada • Todos os direitos reservados.
      </p>
    </footer>
  );
}
