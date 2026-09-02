import { useState } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, ArrowRight, BarChart3 } from 'lucide-react';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { demoTag } from '@/components/ui/DemoTag';
import { riskZones } from '@/data/demoData';

interface FeatureContribution {
  feature: string;
  value: string;
  shap: number;
  direction: 'positive' | 'negative';
  label: string;
  description: string;
}

const zoneContributions: Record<string, FeatureContribution[]> = {
  'Z-001': [
    { feature: 'Rainfall (24h)', value: '142 mm', shap: 0.28, direction: 'positive', label: 'Major contributor', description: 'Extreme rainfall saturates soil, reducing slope stability' },
    { feature: 'Soil Moisture', value: '78%', shap: 0.22, direction: 'positive', label: 'Major contributor', description: 'High moisture indicates saturated ground, increasing pore water pressure' },
    { feature: 'Slope Angle', value: '38°', shap: 0.18, direction: 'positive', label: 'Significant contributor', description: 'Steep slope increases gravitational driving force' },
    { feature: 'Historical Events', value: '14', shap: 0.12, direction: 'positive', label: 'Moderate contributor', description: 'High recurrence indicates terrain susceptibility' },
    { feature: 'Rainfall (7d)', value: '320 mm', shap: 0.10, direction: 'positive', label: 'Moderate contributor', description: 'Sustained rainfall has progressively weakened soil structure' },
    { feature: 'Vegetation Index', value: '0.32', shap: -0.08, direction: 'negative', label: 'Minor reducer', description: 'Low vegetation reduces root cohesion and slope stabilization' },
    { feature: 'Distance to Road', value: '120 m', shap: 0.04, direction: 'positive', label: 'Minor contributor', description: 'Proximity to road cut may affect slope toe stability' },
  ],
  'Z-002': [
    { feature: 'Rainfall (24h)', value: '98 mm', shap: 0.20, direction: 'positive', label: 'Major contributor', description: 'Heavy rainfall increases soil saturation' },
    { feature: 'Soil Moisture', value: '65%', shap: 0.16, direction: 'positive', label: 'Significant contributor', description: 'Elevated moisture reduces effective stress' },
    { feature: 'Slope Angle', value: '31°', shap: 0.14, direction: 'positive', label: 'Significant contributor', description: 'Moderate-to-steep slope angle' },
    { feature: 'Historical Events', value: '8', shap: 0.10, direction: 'positive', label: 'Moderate contributor', description: 'Prior events indicate terrain vulnerability' },
    { feature: 'Vegetation Index', value: '0.38', shap: -0.06, direction: 'negative', label: 'Minor reducer', description: 'Moderate vegetation provides some stabilization' },
  ],
  'Z-003': [
    { feature: 'Rainfall (24h)', value: '85 mm', shap: 0.18, direction: 'positive', label: 'Significant contributor', description: 'Sustained rainfall saturates upper soil layer' },
    { feature: 'Slope Angle', value: '34°', shap: 0.16, direction: 'positive', label: 'Significant contributor', description: 'Steep terrain increases failure probability' },
    { feature: 'Soil Moisture', value: '60%', shap: 0.14, direction: 'positive', label: 'Significant contributor', description: 'High moisture content reduces soil strength' },
    { feature: 'Historical Events', value: '6', shap: 0.08, direction: 'positive', label: 'Moderate contributor', description: 'Multiple past events in this zone' },
  ],
  'Z-004': [
    { feature: 'Rainfall (24h)', value: '54 mm', shap: 0.12, direction: 'positive', label: 'Moderate contributor', description: 'Moderate rainfall, within seasonal norms' },
    { feature: 'Slope Angle', value: '26°', shap: 0.10, direction: 'positive', label: 'Moderate contributor', description: 'Moderate slope angle' },
    { feature: 'Soil Moisture', value: '48%', shap: 0.08, direction: 'positive', label: 'Moderate contributor', description: 'Moderate moisture levels' },
    { feature: 'Vegetation Index', value: '0.49', shap: -0.10, direction: 'negative', label: 'Moderate reducer', description: 'Good vegetation cover stabilizes slope' },
  ],
  'Z-005': [
    { feature: 'Rainfall (24h)', value: '41 mm', shap: 0.10, direction: 'positive', label: 'Moderate contributor', description: 'Moderate rainfall' },
    { feature: 'Slope Angle', value: '22°', shap: 0.08, direction: 'positive', label: 'Minor contributor', description: 'Moderate slope' },
    { feature: 'Soil Moisture', value: '42%', shap: 0.06, direction: 'positive', label: 'Minor contributor', description: 'Moderate moisture' },
    { feature: 'Vegetation Index', value: '0.53', shap: -0.12, direction: 'negative', label: 'Significant reducer', description: 'Dense vegetation provides strong slope stabilization' },
  ],
  'Z-006': [
    { feature: 'Rainfall (24h)', value: '12 mm', shap: 0.03, direction: 'positive', label: 'Minor contributor', description: 'Low rainfall' },
    { feature: 'Slope Angle', value: '18°', shap: 0.06, direction: 'positive', label: 'Minor contributor', description: 'Gentle slope' },
    { feature: 'Vegetation Index', value: '0.71', shap: -0.15, direction: 'negative', label: 'Significant reducer', description: 'Dense vegetation strongly stabilizes the slope' },
    { feature: 'Soil Moisture', value: '28%', shap: 0.03, direction: 'positive', label: 'Minor contributor', description: 'Low moisture' },
  ],
  'Z-007': [
    { feature: 'Rainfall (24h)', value: '8 mm', shap: 0.02, direction: 'positive', label: 'Minor contributor', description: 'Very low rainfall' },
    { feature: 'Slope Angle', value: '14°', shap: 0.04, direction: 'positive', label: 'Minor contributor', description: 'Gentle terrain' },
    { feature: 'Vegetation Index', value: '0.69', shap: -0.14, direction: 'negative', label: 'Significant reducer', description: 'Good vegetation cover' },
    { feature: 'Soil Moisture', value: '22%', shap: 0.02, direction: 'positive', label: 'Minor contributor', description: 'Low moisture levels' },
  ],
  'Z-008': [
    { feature: 'Rainfall (24h)', value: '88 mm', shap: 0.19, direction: 'positive', label: 'Major contributor', description: 'Heavy sustained rainfall' },
    { feature: 'Slope Angle', value: '33°', shap: 0.15, direction: 'positive', label: 'Significant contributor', description: 'Steep mountainous terrain' },
    { feature: 'Soil Moisture', value: '62%', shap: 0.13, direction: 'positive', label: 'Significant contributor', description: 'High moisture saturation' },
    { feature: 'Historical Events', value: '7', shap: 0.10, direction: 'positive', label: 'Moderate contributor', description: 'Prior landslide activity in sector' },
    { feature: 'Road Connectivity', value: 'Blocked', shap: 0.06, direction: 'positive', label: 'Moderate contributor', description: 'Blocked road indicates possible active ground movement' },
  ],
};

const labelColors: Record<string, string> = {
  'Major contributor': 'text-red-400 bg-red-500/10 border-red-500/30',
  'Significant contributor': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'Moderate contributor': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'Minor contributor': 'text-ink-300 bg-ink-700/50 border-ink-600',
  'Minor reducer': 'text-green-400 bg-green-500/10 border-green-500/30',
  'Moderate reducer': 'text-green-400 bg-green-500/10 border-green-500/30',
  'Significant reducer': 'text-green-400 bg-green-500/10 border-green-500/30',
};

const globalImportance = [
  { feature: 'Rainfall (24h)', importance: 0.28 },
  { feature: 'Soil Moisture', importance: 0.22 },
  { feature: 'Slope Angle', importance: 0.18 },
  { feature: 'Historical Events', importance: 0.12 },
  { feature: 'Rainfall (7d)', importance: 0.10 },
  { feature: 'Vegetation Index', importance: 0.06 },
  { feature: 'Distance to Road', importance: 0.04 },
];

export function ExplanationPage() {
  const [selectedZoneId, setSelectedZoneId] = useState('Z-001');
  const selectedZone = riskZones.find((z) => z.id === selectedZoneId)!;
  const contributions = zoneContributions[selectedZoneId] ?? [];
  const maxAbsShap = Math.max(...contributions.map((c) => Math.abs(c.shap)), 0.01);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={demoTag}>SAMPLE DATA</span>
        <p className="text-sm text-ink-400">
          Feature contributions are illustrative samples. When the trained ML model is connected, this page will display
          real SHAP values computed from model output.
        </p>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="section-title">Select Zone to Explain</h3>
            <p className="section-subtitle">View feature contributions for a specific risk prediction</p>
          </div>
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="input-field max-w-xs"
          >
            {riskZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} — {z.riskProbability}%
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="section-title">Why is {selectedZone.name} at {selectedZone.riskLevel.toLowerCase()} risk?</h3>
            <Lightbulb className="w-5 h-5 text-accent-400" />
          </div>
          <p className="section-subtitle mb-5">
            Feature contribution breakdown — each bar shows how much that factor pushes the risk prediction up or down
          </p>

          <div className="space-y-3">
            {contributions.map((c, i) => {
              const barWidth = (Math.abs(c.shap) / maxAbsShap) * 100;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {c.direction === 'positive' ? (
                        <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-green-400" />
                      )}
                      <span className="font-medium text-ink-200">{c.feature}</span>
                      <span className="text-ink-500 font-mono">{c.value}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${labelColors[c.label] ?? 'text-ink-400 bg-ink-700/50 border-ink-600'}`}>
                      {c.label}
                    </span>
                  </div>
                  <div className="relative h-6 bg-ink-800/40 rounded-lg overflow-hidden">
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-ink-600" />
                    {c.direction === 'positive' ? (
                      <div
                        className="absolute top-0 bottom-0 left-1/2 bg-gradient-to-r from-orange-500/60 to-red-500/80 rounded-r-md transition-all duration-500"
                        style={{ width: `${barWidth / 2}%` }}
                      />
                    ) : (
                      <div
                        className="absolute top-0 bottom-0 right-1/2 bg-gradient-to-l from-green-500/60 to-green-600/80 rounded-l-md transition-all duration-500"
                        style={{ width: `${barWidth / 2}%` }}
                      />
                    )}
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-[10px] font-mono text-ink-300">
                        SHAP: {c.direction === 'positive' ? '+' : ''}{c.shap.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-ink-500 leading-relaxed pl-6">{c.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="section-title">Prediction Summary</h3>
              <RiskBadge level={selectedZone.riskLevel} size="sm" />
            </div>
            <div className="text-center py-4">
              <p className="text-xs text-ink-400 uppercase tracking-wider mb-1">Risk Probability</p>
              <p className="text-5xl font-bold font-mono text-ink-50">{selectedZone.riskProbability}<span className="text-2xl text-ink-400">%</span></p>
            </div>
            <div className="space-y-2 mt-4 pt-4 border-t border-ink-800">
              <div className="flex justify-between text-xs">
                <span className="text-ink-400">Positive factors</span>
                <span className="font-mono text-orange-400">
                  +{contributions.filter((c) => c.direction === 'positive').reduce((s, c) => s + c.shap, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-400">Reducing factors</span>
                <span className="font-mono text-green-400">
                  {contributions.filter((c) => c.direction === 'negative').reduce((s, c) => s + c.shap, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-ink-800">
                <span className="text-ink-400 font-medium">Net contribution</span>
                <span className="font-mono text-ink-100 font-bold">
                  {contributions.reduce((s, c) => s + c.shap, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-4 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/90 leading-relaxed">
                These values are <strong>illustrative samples</strong>, not computed from a trained model. SHAP values
                will be calculated from the actual ML model (Random Forest / XGBoost) once it is trained and deployed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">Global Feature Importance</h3>
            <p className="section-subtitle">Which factors matter most across all predictions (model-level)</p>
          </div>
          <BarChart3 className="w-5 h-5 text-accent-400" />
        </div>
        <div className="space-y-2.5">
          {globalImportance.map((g, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-medium text-ink-300 w-36 shrink-0">{g.feature}</span>
              <div className="flex-1 h-5 bg-ink-800/40 rounded-md overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-500/60 to-accent-400/80 rounded-md transition-all duration-500"
                  style={{ width: `${(g.importance / 0.28) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-ink-400 w-12 text-right">{(g.importance * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 flex items-center gap-3">
        <ArrowRight className="w-5 h-5 text-accent-400 shrink-0" />
        <p className="text-xs text-ink-400">
          <strong className="text-ink-300">How it works:</strong> SHAP (SHapley Additive exPlanations) assigns each
          feature a contribution value for every individual prediction. Positive values (orange) increase risk; negative
          values (green) decrease it. The sum of all contributions approximates the difference between the actual
          prediction and the baseline average risk.
        </p>
      </div>
    </div>
  );
}
