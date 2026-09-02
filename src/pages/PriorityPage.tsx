import { Siren, Users, Route, Building2, History, FileText } from 'lucide-react';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { demoTag } from '@/components/ui/DemoTag';
import { priorityEntries } from '@/data/demoData';

const tierConfig = {
  'Priority 1': { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Critical' },
  'Priority 2': { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'High' },
  'Priority 3': { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: 'Moderate' },
};

export function PriorityPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={demoTag}>DEMO DATA</span>
        <p className="text-sm text-ink-400">
          Priority ranking uses transparent configurable weights. Weights are documented below — not hidden or
          fabricated.
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-ink-200 mb-2">Priority Scoring Weights (Configurable)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex justify-between items-center p-2 rounded bg-ink-800/40">
            <span className="text-ink-400">Risk Probability</span>
            <span className="font-mono text-accent-300 font-bold">35%</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-ink-800/40">
            <span className="text-ink-400">Population Exposure</span>
            <span className="font-mono text-accent-300 font-bold">25%</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-ink-800/40">
            <span className="text-ink-400">Road Connectivity</span>
            <span className="font-mono text-accent-300 font-bold">20%</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-ink-800/40">
            <span className="text-ink-400">Historical + Reports</span>
            <span className="font-mono text-accent-300 font-bold">20%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {priorityEntries.map((entry) => {
          const tier = tierConfig[entry.tier];
          return (
            <div key={entry.rank} className={`card card-hover p-5 border-l-4 ${tier.border}`}>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${tier.bg} ${tier.color}`}
                  >
                    {entry.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${tier.color}`}>
                        {entry.tier} — {tier.label}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-ink-50 mt-0.5">{entry.zoneName}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ink-400">Risk Probability</p>
                  <p className={`text-2xl font-bold font-mono ${tier.color}`}>{entry.riskProbability}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-ink-800/40">
                  <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                    <Users className="w-3.5 h-3.5" /> Population
                  </div>
                  <p className="text-sm font-mono font-semibold text-ink-100">
                    {entry.population.toLocaleString()}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-800/40">
                  <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                    <Route className="w-3.5 h-3.5" /> Road Status
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      entry.roadConnectivity === 'Blocked'
                        ? 'text-red-400'
                        : entry.roadConnectivity === 'Partially Blocked'
                          ? 'text-orange-400'
                          : 'text-green-400'
                    }`}
                  >
                    {entry.roadConnectivity}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-800/40">
                  <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                    <Building2 className="w-3.5 h-3.5" /> Infrastructure
                  </div>
                  <p className="text-xs text-ink-300 leading-tight">{entry.infrastructure}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-800/40">
                  <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                    <History className="w-3.5 h-3.5" /> Historical Events
                  </div>
                  <p className="text-sm font-mono font-semibold text-ink-100">{entry.historicalVulnerability}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-ink-800/30 border border-ink-700/30">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-ink-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-ink-400 mb-1">Why this priority?</p>
                    <p className="text-sm text-ink-300 leading-relaxed">{entry.rationale}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-ink-500">Active field reports:</span>
                <span className="text-xs font-mono text-amber-400">{entry.activeReports}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
