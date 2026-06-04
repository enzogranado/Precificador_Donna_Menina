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
      <div className="metric-label">{label}</div>
      <div className={getValueClass()}>{value}</div>
      {badgeText && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          {badgeText}
        </p>
      )}
    </div>
  );
}
