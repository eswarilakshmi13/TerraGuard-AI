import { BellRing, MapPin, Clock, Users, ShieldCheck } from 'lucide-react';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { demoTag } from '@/components/ui/DemoTag';
import { alerts } from '@/data/demoData';

export function WarningsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={demoTag}>DEMO DATA</span>
        <p className="text-sm text-ink-400">
          Alerts are generated from simulated risk assessments. No SMS or push notification delivery is active — this
          is an alert generation interface for demonstration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <BellRing className="w-4 h-4 text-red-400" /> Active Alerts
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{alerts.length}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-400" /> Critical Severity
          </div>
          <p className="text-2xl font-bold font-mono text-red-400">
            {alerts.filter((a) => a.severity === 'CRITICAL').length}
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <Users className="w-4 h-4 text-accent-400" /> Zones Affected
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{new Set(alerts.map((a) => a.zoneName)).size}</p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="card card-hover p-5">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-3">
                <RiskBadge level={alert.severity} />
                <div>
                  <h3 className="text-base font-semibold text-ink-50">{alert.zoneName}</h3>
                  <div className="flex items-center gap-3 text-xs text-ink-500 mt-0.5">
                    <span className="font-mono">{alert.id}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-400">Risk Probability</p>
                <p className="text-2xl font-bold font-mono text-ink-50">{alert.riskProbability}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-2">Triggering Factors</p>
                <ul className="space-y-1.5">
                  {alert.triggers.map((trigger, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                      {trigger}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-2">
                  Recommended Action
                </p>
                <p className="text-sm text-ink-300 leading-relaxed">{alert.recommendedAction}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-ink-800 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-ink-500">Target audience:</span>
              {alert.targetAudience.map((aud) => (
                <span
                  key={aud}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-ink-800 text-ink-300 border border-ink-700"
                >
                  {aud}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h3 className="section-title mb-1">Audience-Specific Alert Previews</h3>
        <p className="section-subtitle mb-4">
          The same risk event generates different messaging for each user group.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Citizen Alert</span>
            </div>
            <p className="text-xs text-ink-300 leading-relaxed">
              "High landslide risk has been detected in your area. Avoid vulnerable hillside routes and follow official
              local instructions."
            </p>
          </div>
          <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-400">Field Officer Alert</span>
            </div>
            <p className="text-xs text-ink-300 leading-relaxed">
              Zone A — Risk 87%. Heavy rainfall + high soil moisture + steep slope. Inspect SH-4 debris flow. Submit
              assessment report.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">Authority Alert</span>
            </div>
            <div className="text-xs text-ink-300 leading-relaxed space-y-0.5">
              <p>2 zones at critical/high risk.</p>
              <p>SH-4 partially blocked. 12,400 population exposed.</p>
              <p>Priority 1 — initiate emergency response.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
