import {
  LayoutDashboard,
  Brain,
  Map,
  BellRing,
  FileText,
  CloudRain,
  Siren,
  History,
  Lightbulb,
  Info,
  Mountain,
  ShieldAlert,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'prediction', label: 'Risk Prediction', icon: Brain },
  { id: 'map', label: 'Live Risk Map', icon: Map },
  { id: 'warnings', label: 'Early Warnings', icon: BellRing },
  { id: 'reports', label: 'Incident Reports', icon: FileText },
  { id: 'weather', label: 'Weather & Environment', icon: CloudRain },
  { id: 'priority', label: 'Emergency Prioritization', icon: Siren },
  { id: 'history', label: 'Historical Analysis', icon: History },
  { id: 'explanation', label: 'AI Risk Explanation', icon: Lightbulb },
  { id: 'about', label: 'About / System Info', icon: Info },
];

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-9 h-9 rounded-lg bg-accent-500/15 border border-accent-500/30 flex items-center justify-center">
        <Mountain className="w-5 h-5 text-accent-400" />
        <ShieldAlert className="w-3 h-3 text-accent-300 absolute -bottom-0.5 -right-0.5" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-sm font-bold text-ink-50 tracking-tight">TerraGuard</span>
        <span className="text-[10px] font-medium text-accent-400 tracking-widest">AI</span>
      </div>
    </div>
  );
}
