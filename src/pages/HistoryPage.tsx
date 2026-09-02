import { useState } from 'react';
import { History, Filter, MapPin, Calendar, CloudRain, TrendingUp } from 'lucide-react';
import { BarChart, ScatterChart } from '@/components/ui/Charts';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { demoTag } from '@/components/ui/DemoTag';
import { historicalEvents, eventsByState, eventsByYear, riskZones, riskLevelConfig } from '@/data/demoData';
import type { RiskLevel } from '@/types';

export function HistoryPage() {
  const [stateFilter, setStateFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All');

  const states = ['All', ...Array.from(new Set(historicalEvents.map((e) => e.state)))];
  const riskLevels: (RiskLevel | 'All')[] = ['All', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'];

  const filteredEvents = historicalEvents.filter((e) => {
    if (stateFilter !== 'All' && e.state !== stateFilter) return false;
    if (riskFilter !== 'All' && e.magnitude !== riskFilter) return false;
    return true;
  });

  const stateData = eventsByState.map((d) => ({ label: d.state, value: d.events }));
  const yearData = eventsByYear.map((d) => ({ label: d.year, value: d.events }));
  const scatterData = historicalEvents.map((e) => ({
    x: e.rainfallTrigger,
    y: e.casualties,
    label: `${e.state.slice(0, 3)} ${e.year}`,
  }));

  const riskDistribution = (['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((level) => ({
    label: level,
    value: historicalEvents.filter((e) => e.magnitude === level).length,
  }));

  const totalEvents = historicalEvents.length;
  const totalCasualties = historicalEvents.reduce((s, e) => s + e.casualties, 0);
  const criticalCount = historicalEvents.filter((e) => e.magnitude === 'CRITICAL').length;

  const sortedZones = [...riskZones].sort((a, b) => b.historicalEvents - a.historicalEvents).slice(0, 5);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={demoTag}>DEMO DATA</span>
        <p className="text-sm text-ink-400">
          Historical events are simulated for demonstration. Real data will come from Geological Survey of India, ISRO/
          NRSC, and NASA Global Landslide Catalog.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <History className="w-4 h-4 text-accent-400" /> Total Events
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{totalEvents}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <Calendar className="w-4 h-4 text-orange-400" /> Critical Events
          </div>
          <p className="text-2xl font-bold font-mono text-red-400">{criticalCount}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <TrendingUp className="w-4 h-4 text-amber-400" /> Total Casualties
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{totalCasualties}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <MapPin className="w-4 h-4 text-blue-400" /> States Affected
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{states.length - 1}</p>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-ink-400" />
          <h3 className="text-sm font-semibold text-ink-200">Filters</h3>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-ink-400">State:</label>
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="input-field max-w-[180px]">
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-ink-400">Risk Level:</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'All')}
              className="input-field max-w-[150px]"
            >
              {riskLevels.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <span className="text-xs text-ink-500">
            Showing {filteredEvents.length} of {totalEvents} events
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Events by State</h3>
              <p className="section-subtitle">Distribution across NER states</p>
            </div>
            <MapPin className="w-5 h-5 text-blue-400" />
          </div>
          <BarChart data={stateData} color="#3b82f6" height={200} />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Events Over Time</h3>
              <p className="section-subtitle">Yearly landslide occurrence (2018–2024)</p>
            </div>
            <Calendar className="w-5 h-5 text-accent-400" />
          </div>
          <BarChart data={yearData} color="#14b88a" height={200} />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Rainfall vs Casualties</h3>
              <p className="section-subtitle">Correlation between rainfall trigger and impact</p>
            </div>
            <CloudRain className="w-5 h-5 text-cyan-400" />
          </div>
          <ScatterChart data={scatterData} xLabel="Rainfall Trigger (mm)" yLabel="Casualties" height={220} />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Risk Distribution</h3>
              <p className="section-subtitle">Events by severity level</p>
            </div>
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div className="space-y-3 mt-4">
            {riskDistribution.map((d) => {
              const config = riskLevelConfig[d.label as RiskLevel];
              return (
                <div key={d.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${config.text}`}>{d.label}</span>
                    <span className="font-mono text-ink-300">{d.value} events</span>
                  </div>
                  <div className="h-4 bg-ink-800/40 rounded-md overflow-hidden">
                    <div
                      className={`h-full ${config.dot} rounded-md transition-all duration-500`}
                      style={{ width: `${(d.value / totalEvents) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">High-Risk Locations</h3>
            <p className="section-subtitle">Zones with most historical landslide activity</p>
          </div>
          <History className="w-5 h-5 text-accent-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-400 uppercase tracking-wider border-b border-ink-700">
                <th className="pb-2 pr-4 font-medium">Zone</th>
                <th className="pb-2 pr-4 font-medium hidden md:table-cell">State</th>
                <th className="pb-2 pr-4 font-medium text-right">Historical Events</th>
                <th className="pb-2 pr-4 font-medium text-right hidden md:table-cell">Population</th>
                <th className="pb-2 font-medium">Current Risk</th>
              </tr>
            </thead>
            <tbody>
              {sortedZones.map((zone) => (
                <tr key={zone.id} className="border-b border-ink-800/50 hover:bg-ink-800/30 transition-colors">
                  <td className="py-2.5 pr-4 font-medium text-ink-100">{zone.name}</td>
                  <td className="py-2.5 pr-4 text-ink-400 hidden md:table-cell">{zone.state}</td>
                  <td className="py-2.5 pr-4 text-right font-mono text-ink-200">{zone.historicalEvents}</td>
                  <td className="py-2.5 pr-4 text-right font-mono text-ink-300 hidden md:table-cell">
                    {zone.population.toLocaleString()}
                  </td>
                  <td className="py-2.5">
                    <RiskBadge level={zone.riskLevel} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-start gap-2.5">
          <span className={demoTag}>DATA SOURCE</span>
          <p className="text-xs text-ink-500 leading-relaxed">
            Historical events are simulated for demonstration. When connected, data will be sourced from the Geological
            Survey of India (GSI), ISRO/NRSC Bhuvan, and the NASA Global Landslide Catalog. Each record will carry
            source attribution, date, geographic coverage, and license information.
          </p>
        </div>
      </div>
    </div>
  );
}
