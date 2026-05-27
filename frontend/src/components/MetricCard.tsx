interface MetricCardProps {
  label: string;
  value: string | number;
  badgeText?: string;
  variation?: 'gold' | 'rose' | 'success' | 'default';
}

export default function MetricCard({ label, value, badgeText, variation = 'default' }: MetricCardProps) {
  const getValueClass = () => {
    if (variation === 'gold') return 'metric-value gold';
    if (variation === 'rose') return 'metric-value rose';
    if (variation === 'success') return 'metric-value success';
    return 'metric-value';
  };

  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <span className={getValueClass()}>{value}</span>
      {badgeText && (
        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {badgeText}
        </p>
      )}
    </div>
  );
}
