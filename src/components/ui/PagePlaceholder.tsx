import type { LucideIcon } from 'lucide-react';
import { demoTag } from '../ui/DemoTag';

interface PagePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: 'Planned' | 'In Progress';
  upcomingFeatures: string[];
}

export function PagePlaceholder({ icon: Icon, title, description, status, upcomingFeatures }: PagePlaceholderProps) {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="card p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20">
            <Icon className="w-7 h-7 text-accent-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-ink-50">{title}</h2>
              <span
                className={`badge px-2.5 py-1 text-xs ${
                  status === 'In Progress'
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    : 'bg-ink-700/50 text-ink-400 border border-ink-600'
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-sm text-ink-400 mt-2 leading-relaxed max-w-2xl">{description}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="section-title mb-1">Planned Capabilities</h3>
        <p className="section-subtitle mb-4">Features to be implemented in upcoming development phases.</p>
        <ul className="space-y-2.5">
          {upcomingFeatures.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-ink-300">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4 flex items-center justify-between">
        <p className="text-xs text-ink-500">
          This module is part of the TerraGuard AI development roadmap. Data shown elsewhere in the application is
          clearly labeled as demonstration data.
        </p>
        <span className={demoTag}>DEMO DATA</span>
      </div>
    </div>
  );
}
