import type { RiskLevel } from '@/types';
import { riskLevelConfig } from '@/data/demoData';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const config = riskLevelConfig[level];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`badge ${sizeClasses} ${config.bg} ${config.text} ${config.border} border`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {level}
    </span>
  );
}
