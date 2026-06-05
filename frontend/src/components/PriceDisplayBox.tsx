import { CheckCircle } from 'lucide-react';

interface PriceDisplayBoxProps {
  value: number;
  label: string;
  showBadge?: boolean;
}

export default function PriceDisplayBox({ value, label, showBadge = true }: PriceDisplayBoxProps) {
  return (
    <div className="price-display-box">
      <span className="price-display-title">{label}</span>
      <div className="price-display-value">
        R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      {showBadge && (
        <span className="price-display-subtitle">
          <CheckCircle size={14} style={{ color: 'var(--color-success)' }} /> Margem Protetiva Donna Menina
        </span>
      )}
    </div>
  );
}
