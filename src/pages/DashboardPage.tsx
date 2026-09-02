import { StatCard } from '@/components/ui/StatCard';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { demoTag } from '@/components/ui/DemoTag';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
  BellRing,
  FileClock,
  Activity,
  MapPin,
  CloudRain,
  Droplets,
  TrendingUp,
  Gauge,
} from 'lucide-react';
import { riskZones, alerts, riskTrend } from '@/data/demoData';
import type { RiskLevel } from '@/types';

export function DashboardPage() {
  const lowCount = riskZones.filter((z) => z.riskLevel === 'LOW').length;
  const modCount = riskZones.filter((z) => z.riskLevel === 'MODERATE').length;
  const highCount = riskZones.filter((z) => z.riskLevel === 'HIGH').length;
  const critCount = riskZones.filter((z) => z.riskLevel === 'CRITICAL').length;
  const activeAlerts = alerts.filter((a) => a.status === 'Active').length;

  const sortedZones = [...riskZones].sort((a, b) => b.riskProbability - a.riskProbability);
  const maxRisk = Math.max(...riskTrend.map((d) => d.risk));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={demoTag}>DEMO DATA</span>
        <p className="text-sm text-ink-400">
          Simulated monitoring data for demonstration. No live government feeds are connected.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <StatCard label="Monitored Zones" value={riskZones.length} icon={Layers} accentColor="text-accent-400" />
        <StatCard label="Low Risk" value={lowCount} icon={CheckCircle2} accentColor="text-green-400" />
        <StatCard label="Moderate" value={modCount} icon={AlertTriangle} accentColor="text-yellow-400" />
        <StatCard label="High Risk" value={highCount} icon={AlertTriangle} accentColor="text-orange-400" />
        <StatCard label="Critical" value={critCount} icon={OctagonAlert} accentColor="text-red-400" />
        <StatCard label="Active Alerts" value={activeAlerts} icon={BellRing} accentColor="text-red-400" />
        <StatCard label="Pending Reports" value={2} icon={FileClock} accentColor="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Risk Zone Overview</h3>
              <p className="section-subtitle">All monitored zones ranked by risk probability</p>
            </div>
            <Activity className="w-5 h-5 text-accent-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-400 uppercase tracking-wider border-b border-ink-700">
                  <th className="pb-2 pr-4 font-medium">Zone</th>
                  <th className="pb-2 pr-4 font-medium">Risk</th>
                  <th className="pb-2 pr-4 font-medium text-right">Prob.</th>
                  <th className="pb-2 pr-4 font-medium text-right hidden md:table-cell">Rainfall</th>
                  <th className="pb-2 pr-4 font-medium text-right hidden md:table-cell">Moisture</th>
                  <th className="pb-2 pr-4 font-medium text-right hidden lg:table-cell">Slope</th>
                  <th className="pb-2 font-medium text-right hidden lg:table-cell">Roads</th>
                </tr>
              </thead>
              <tbody>
                {sortedZones.map((zone) => (
                  <tr key={zone.id} className="border-b border-ink-800/50 hover:bg-ink-800/30 transition-colors">
                    <td className="py-2.5 pr-4">
                      <div className="font-medium text-ink-100">{zone.name}</div>
                      <div className="text-xs text-ink-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {zone.district}, {zone.state}
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <RiskBadge level={zone.riskLevel as RiskLevel} size="sm" />
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono text-ink-200">{zone.riskProbability}%</td>
                    <td className="py-2.5 pr-4 text-right font-mono text-ink-300 hidden md:table-cell">
                      {zone.rainfall24h}mm
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono text-ink-300 hidden md:table-cell">
                      {zone.soilMoisture}%
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono text-ink-300 hidden lg:table-cell">
                      {zone.slope}°
                    </td>
                    <td className="py-2.5 text-right hidden lg:table-cell">
                      <span
                        className={`text-xs font-medium ${
                          zone.roadConnectivity === 'Blocked'
                            ? 'text-red-400'
                            : zone.roadConnectivity === 'Partially Blocked'
                              ? 'text-orange-400'
                              : 'text-green-400'
                        }`}
                      >
                        {zone.roadConnectivity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">7-Day Risk Trend</h3>
              <p className="section-subtitle">Zone A — Cherrapunji Ridge</p>
            </div>
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div className="flex items-end gap-2 h-40">
            {riskTrend.map((d) => {
              const heightPct = (d.risk / maxRisk) * 100;
              const barColor =
                d.risk >= 80
                  ? 'bg-red-500'
                  : d.risk >= 60
                    ? 'bg-orange-500'
                    : d.risk >= 35
                      ? 'bg-yellow-500'
                      : 'bg-green-500';
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-mono text-ink-300">{d.risk}</span>
                  <div className="w-full bg-ink-800/50 rounded-t flex items-end" style={{ height: '100px' }}>
                    <div
                      className={`w-full ${barColor} rounded-t transition-all duration-500`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-ink-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Active Alerts</h3>
              <p className="section-subtitle">Current warning notifications</p>
            </div>
            <BellRing className="w-5 h-5 text-red-400" />
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg bg-ink-800/40 border border-ink-700/50 hover:border-ink-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <RiskBadge level={alert.severity} size="sm" />
                  <span className="text-[10px] font-mono text-ink-500">{alert.id}</span>
                </div>
                <p className="text-sm font-medium text-ink-100">{alert.zoneName}</p>
                <p className="text-xs text-ink-400 mt-1">{alert.recommendedAction}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Environmental Snapshot</h3>
              <p className="section-subtitle">Highest-risk zone readings</p>
            </div>
            <CloudRain className="w-5 h-5 text-accent-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-ink-800/40">
              <div className="flex items-center gap-2 text-xs text-ink-400 mb-1">
                <CloudRain className="w-4 h-4" /> Rainfall (24h)
              </div>
              <p className="text-lg font-bold font-mono text-ink-50">142mm</p>
            </div>
            <div className="p-3 rounded-lg bg-ink-800/40">
              <div className="flex items-center gap-2 text-xs text-ink-400 mb-1">
                <Droplets className="w-4 h-4" /> Soil Moisture
              </div>
              <p className="text-lg font-bold font-mono text-ink-50">78%</p>
            </div>
            <div className="p-3 rounded-lg bg-ink-800/40">
              <div className="flex items-center gap-2 text-xs text-ink-400 mb-1">
                <Gauge className="w-4 h-4" /> Slope Angle
              </div>
              <p className="text-lg font-bold font-mono text-ink-50">38°</p>
            </div>
            <div className="p-3 rounded-lg bg-ink-800/40">
              <div className="flex items-center gap-2 text-xs text-ink-400 mb-1">
                <Activity className="w-4 h-4" /> Risk Probability
              </div>
              <p className="text-lg font-bold font-mono text-red-400">87%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
