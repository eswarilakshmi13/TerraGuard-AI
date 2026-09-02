import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accentColor?: string;
  sublabel?: string;
}

export function StatCard({ label, value, icon: Icon, accentColor = 'text-ink-300', sublabel }: StatCardProps) {
  return (
    <div className="card card-hover p-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-ink-50 mt-1.5 font-mono">{value}</p>
          {sublabel && <p className="text-[11px] text-ink-500 mt-0.5">{sublabel}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-ink-800/60 ${accentColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
