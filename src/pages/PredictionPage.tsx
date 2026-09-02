import { useState, useMemo } from 'react';
import {
  Brain,
  Play,
  RotateCcw,
  MapPin,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Droplets,
  Gauge,
  Mountain,
  Leaf,
  Route,
  Thermometer,
  History,
  Clock,
  Cloud,
} from 'lucide-react';
import { demoTag } from '@/components/ui/DemoTag';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { riskZones, environmentalReadings, getRiskLevel } from '@/data/demoData';
import type { PredictionFeatures, PredictionResult } from '@/types';

type ScenarioKey = 'current' | 'normal' | 'heavy-rain' | 'dry';

const scenarios: { key: ScenarioKey; label: string; description: string }[] = [
  { key: 'current', label: 'Current Conditions', description: 'Use the latest environmental readings for this zone' },
  { key: 'normal', label: 'Normal / Calm', description: 'Low rainfall, moderate moisture — typical dry season' },
  { key: 'heavy-rain', label: 'Heavy Rainfall Event', description: 'Simulate an intense monsoon rainfall scenario' },
  { key: 'dry', label: 'Dry Season', description: 'Minimal rainfall, low soil moisture' },
];

function buildFeatures(zoneIndex: number, scenario: ScenarioKey): PredictionFeatures {
  const zone = riskZones[zoneIndex];
  const reading = environmentalReadings[zoneIndex];

  switch (scenario) {
    case 'normal':
      return {
        lat: zone.lat,
        lng: zone.lng,
        rainfall1h: 1.2,
        rainfall24h: 15,
        rainfall7d: 45,
        soilMoisture: 35,
        temperature: 24,
        elevation: reading.elevation,
        slope: zone.slope,
        historicalLandslideCount: zone.historicalEvents,
        vegetationIndex: reading.vegetationIndex,
        distanceToRoad: reading.distanceToRoad,
      };
    case 'heavy-rain':
      return {
        lat: zone.lat,
        lng: zone.lng,
        rainfall1h: Math.round((zone.rainfall24h / 24) * 2.5 * 10) / 10,
        rainfall24h: Math.round(zone.rainfall24h * 1.4),
        rainfall7d: Math.round(zone.rainfall24h * 3.2 * 1.3),
        soilMoisture: Math.min(95, zone.soilMoisture + 15),
        temperature: Math.round((reading.temperature - 2) * 10) / 10,
        elevation: reading.elevation,
        slope: zone.slope,
        historicalLandslideCount: zone.historicalEvents,
        vegetationIndex: reading.vegetationIndex,
        distanceToRoad: reading.distanceToRoad,
      };
    case 'dry':
      return {
        lat: zone.lat,
        lng: zone.lng,
        rainfall1h: 0,
        rainfall24h: 2,
        rainfall7d: 8,
        soilMoisture: 18,
        temperature: Math.round((reading.temperature + 3) * 10) / 10,
        elevation: reading.elevation,
        slope: zone.slope,
        historicalLandslideCount: zone.historicalEvents,
        vegetationIndex: Math.min(0.85, reading.vegetationIndex + 0.15),
        distanceToRoad: reading.distanceToRoad,
      };
    default:
      return {
        lat: zone.lat,
        lng: zone.lng,
        rainfall1h: reading.rainfall1h,
        rainfall24h: reading.rainfall24h,
        rainfall7d: reading.rainfall7d,
        soilMoisture: reading.soilMoisture,
        temperature: reading.temperature,
        elevation: reading.elevation,
        slope: reading.slope,
        historicalLandslideCount: zone.historicalEvents,
        vegetationIndex: reading.vegetationIndex,
        distanceToRoad: reading.distanceToRoad,
      };
  }
}

const inputFields: { key: keyof PredictionFeatures; label: string; unit: string; step: string; icon: typeof MapPin }[] = [
  { key: 'lat', label: 'Latitude', unit: '°N', step: '0.01', icon: MapPin },
  { key: 'lng', label: 'Longitude', unit: '°E', step: '0.01', icon: MapPin },
  { key: 'rainfall1h', label: 'Rainfall (1 hour)', unit: 'mm', step: '0.1', icon: CloudRain },
  { key: 'rainfall24h', label: 'Rainfall (24 hours)', unit: 'mm', step: '0.1', icon: CloudRain },
  { key: 'rainfall7d', label: 'Rainfall (7 days)', unit: 'mm', step: '0.1', icon: Cloud },
  { key: 'soilMoisture', label: 'Soil Moisture', unit: '%', step: '1', icon: Droplets },
  { key: 'temperature', label: 'Temperature', unit: '°C', step: '0.1', icon: Thermometer },
  { key: 'elevation', label: 'Elevation', unit: 'm', step: '1', icon: Mountain },
  { key: 'slope', label: 'Slope Angle', unit: '°', step: '0.1', icon: Gauge },
  { key: 'historicalLandslideCount', label: 'Historical Landslides', unit: 'events', step: '1', icon: History },
  { key: 'vegetationIndex', label: 'Vegetation (NDVI)', unit: '', step: '0.01', icon: Leaf },
  { key: 'distanceToRoad', label: 'Distance to Road', unit: 'm', step: '1', icon: Route },
];

export function PredictionPage() {
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
  const [scenario, setScenario] = useState<ScenarioKey>('current');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [features, setFeatures] = useState<PredictionFeatures>(() => buildFeatures(0, 'current'));
  const [featuresDirty, setFeaturesDirty] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const selectedZone = riskZones[selectedZoneIndex];

  const handleZoneChange = (index: number) => {
    setSelectedZoneIndex(index);
    const newFeatures = buildFeatures(index, scenario);
    setFeatures(newFeatures);
    setFeaturesDirty(false);
    setResult(null);
  };

  const handleScenarioChange = (newScenario: ScenarioKey) => {
    setScenario(newScenario);
    const newFeatures = buildFeatures(selectedZoneIndex, newScenario);
    setFeatures(newFeatures);
    setFeaturesDirty(false);
    setResult(null);
  };

  const handleFieldChange = (key: keyof PredictionFeatures, value: string) => {
    const numValue = parseFloat(value);
    setFeatures((prev) => ({ ...prev, [key]: isNaN(numValue) ? 0 : numValue }));
    setFeaturesDirty(true);
  };

  const handlePredict = () => {
    setIsCalculating(true);
    setResult(null);

    setTimeout(() => {
      const probability = Math.round(
        Math.min(
          99,
          Math.max(
            5,
            features.rainfall24h * 0.35 +
              features.soilMoisture * 0.25 +
              features.slope * 0.4 +
              features.historicalLandslideCount * 1.5 +
              features.rainfall7d * 0.05 -
              features.vegetationIndex * 20
          )
        )
      );
      setResult({
        probability,
        riskLevel: getRiskLevel(probability),
        features,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        isDemo: true,
      });
      setIsCalculating(false);
    }, 600);
  };

  const handleReset = () => {
    const resetFeatures = buildFeatures(selectedZoneIndex, scenario);
    setFeatures(resetFeatures);
    setFeaturesDirty(false);
    setResult(null);
  };

  const featureSummary = useMemo(
    () => [
      { icon: CloudRain, label: 'Rainfall 24h', value: `${features.rainfall24h} mm` },
      { icon: Droplets, label: 'Soil Moisture', value: `${features.soilMoisture}%` },
      { icon: Gauge, label: 'Slope', value: `${features.slope}°` },
      { icon: History, label: 'Past Events', value: `${features.historicalLandslideCount}` },
      { icon: Leaf, label: 'Vegetation', value: `${features.vegetationIndex}` },
      { icon: Mountain, label: 'Elevation', value: `${features.elevation} m` },
    ],
    [features]
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={demoTag}>DEMO DATA</span>
        <p className="text-sm text-ink-400">
          Select a zone and scenario to assess landslide risk. Environmental data is auto-loaded from the zone's latest
          readings. The ML model (Random Forest / XGBoost) will be connected in Phase 3.
        </p>
      </div>

      <div className="card p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-400 mb-2 uppercase tracking-wider">
              Select Zone / Location
            </label>
            <select
              value={selectedZoneIndex}
              onChange={(e) => handleZoneChange(Number(e.target.value))}
              className="input-field text-sm"
            >
              {riskZones.map((z, i) => (
                <option key={z.id} value={i}>
                  {z.name} — {z.district}, {z.state}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-3 mt-2 text-xs text-ink-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedZone.lat}°N, {selectedZone.lng}°E
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedZone.lastUpdate}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-400 mb-2 uppercase tracking-wider">
              Scenario
            </label>
            <div className="grid grid-cols-2 gap-2">
              {scenarios.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleScenarioChange(s.key)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    scenario === s.key
                      ? 'bg-accent-500/15 text-accent-300 border-accent-500/40'
                      : 'bg-ink-800/40 text-ink-400 border-ink-700 hover:border-ink-600'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-ink-500 mt-2">
              {scenarios.find((s) => s.key === scenario)?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ink-200">Auto-Loaded Environmental Data</h3>
          {featuresDirty && (
            <span className="text-[10px] font-medium text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              Modified
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {featureSummary.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-2.5 rounded-lg bg-ink-800/40">
                <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </div>
                <p className="text-sm font-mono font-semibold text-ink-100">{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Prediction</h3>
              <p className="section-subtitle">
                Review the auto-loaded data, adjust if needed, then predict
              </p>
            </div>
            <Brain className="w-5 h-5 text-accent-400" />
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-medium text-ink-400 hover:text-ink-200 transition-colors mb-4"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAdvanced ? 'Hide' : 'Show'} Advanced Parameters (manual override)
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-slide-in mb-4 pb-4 border-b border-ink-800">
              {inputFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key}>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-ink-400 mb-1">
                      <Icon className="w-3.5 h-3.5" />
                      {field.label}
                      {field.unit && <span className="text-ink-500">({field.unit})</span>}
                    </label>
                    <input
                      type="number"
                      step={field.step}
                      value={features[field.key]}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="input-field"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={handlePredict} disabled={isCalculating} className="btn-primary">
              <Play className="w-4 h-4" />
              {isCalculating ? 'Analyzing...' : 'Predict Landslide Risk'}
            </button>
            <button onClick={handleReset} className="btn-secondary">
              <RotateCcw className="w-4 h-4" />
              Reset to Zone Data
            </button>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/90 leading-relaxed">
              Risk scores use a <strong>transparent weighted formula</strong> for demonstration — not a trained ML model.
              Confidence metrics are omitted because no validated model is connected yet.
            </p>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title">Prediction Result</h3>
              <p className="section-subtitle">Risk probability and classification</p>
            </div>
            <MapPin className="w-5 h-5 text-accent-400" />
          </div>

          {!result && !isCalculating && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Brain className="w-10 h-10 text-ink-600 mb-3" />
              <p className="text-sm text-ink-500">
                Click "Predict Landslide Risk" to generate a risk assessment for {selectedZone.name}.
              </p>
            </div>
          )}

          {isCalculating && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-ink-400">Analyzing terrain and environmental factors...</p>
            </div>
          )}

          {result && !isCalculating && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-lg bg-ink-800/40 border border-ink-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-ink-400">{selectedZone.name}</p>
                    <span className="text-xs font-medium text-ink-400 uppercase tracking-wider mt-1 block">
                      Risk Probability
                    </span>
                  </div>
                  <RiskBadge level={result.riskLevel} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold font-mono text-ink-50">{result.probability}</span>
                  <span className="text-2xl font-bold text-ink-400">%</span>
                </div>
                <div className="mt-3 h-2 bg-ink-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.riskLevel === 'CRITICAL'
                        ? 'bg-red-500'
                        : result.riskLevel === 'HIGH'
                          ? 'bg-orange-500'
                          : result.riskLevel === 'MODERATE'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                    }`}
                    style={{ width: `${result.probability}%` }}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-2">
                  Factors Used in Prediction
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { label: 'Rainfall (1h)', value: `${result.features.rainfall1h} mm` },
                    { label: 'Rainfall (24h)', value: `${result.features.rainfall24h} mm` },
                    { label: 'Rainfall (7d)', value: `${result.features.rainfall7d} mm` },
                    { label: 'Soil Moisture', value: `${result.features.soilMoisture}%` },
                    { label: 'Temperature', value: `${result.features.temperature}°C` },
                    { label: 'Elevation', value: `${result.features.elevation} m` },
                    { label: 'Slope', value: `${result.features.slope}°` },
                    { label: 'Historical Events', value: `${result.features.historicalLandslideCount}` },
                    { label: 'Vegetation (NDVI)', value: `${result.features.vegetationIndex}` },
                    { label: 'Distance to Road', value: `${result.features.distanceToRoad} m` },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between py-1 px-2 rounded bg-ink-800/30">
                      <span className="text-ink-500">{item.label}</span>
                      <span className="font-mono text-ink-300">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-ink-500 font-mono text-right">Generated: {result.timestamp}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
