import { useState } from 'react';
import { CloudRain, Droplets, Thermometer, Mountain, Gauge, Leaf, Route, Clock } from 'lucide-react';
import { LineChart, BarChart } from '@/components/ui/Charts';
import { environmentalReadings, rainfallTrend, soilMoistureTrend, riskTrend, riskLevelConfig } from '@/data/demoData';
import { demoTag } from '@/components/ui/DemoTag';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { riskZones } from '@/data/demoData';

export function WeatherPage() {
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
  const reading = environmentalReadings[selectedZoneIndex];
  const zone = riskZones[selectedZoneIndex];

  const rainfallData = rainfallTrend.map((d) => ({ label: d.day, value: d.rainfall }));
  const moistureData = soilMoistureTrend.map((d) => ({ label: d.day, value: d.moisture }));
  const riskData = riskTrend.map((d) => ({ label: d.day, value: d.risk }));

  const zoneReadings = environmentalReadings.map((r, i) => ({
    label: riskZones[i].name.split('—')[0].trim(),
    value: r.rainfall24h,
  }));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={demoTag}>DEMO / SIMULATED DATA</span>
        <p className="text-sm text-ink-400">
          Environmental readings are simulated for demonstration. Architecture supports future integration with live
          weather APIs and satellite datasets.
        </p>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="section-title">Zone Selector</h3>
            <p className="section-subtitle">Select a monitored zone to view its environmental data</p>
          </div>
          <select
            value={selectedZoneIndex}
            onChange={(e) => setSelectedZoneIndex(Number(e.target.value))}
            className="input-field max-w-xs"
          >
            {riskZones.map((z, i) => (
              <option key={z.id} value={i}>
                {z.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <CloudRain className="w-4 h-4 text-blue-400" /> Rainfall (24h)
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{reading.rainfall24h}<span className="text-sm text-ink-400 ml-1">mm</span></p>
          <p className="text-[11px] text-ink-500 mt-0.5">{reading.rainfall1h}mm in last hour</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <Droplets className="w-4 h-4 text-cyan-400" /> Soil Moisture
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{reading.soilMoisture}<span className="text-sm text-ink-400 ml-1">%</span></p>
          <p className="text-[11px] text-ink-500 mt-0.5">7-day: {reading.rainfall7d}mm cumulative</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <Thermometer className="w-4 h-4 text-orange-400" /> Temperature
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{reading.temperature}<span className="text-sm text-ink-400 ml-1">°C</span></p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <Mountain className="w-4 h-4 text-accent-400" /> Elevation
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{reading.elevation}<span className="text-sm text-ink-400 ml-1">m</span></p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <Gauge className="w-4 h-4 text-amber-400" /> Slope Angle
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{reading.slope}<span className="text-sm text-ink-400 ml-1">°</span></p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <Leaf className="w-4 h-4 text-green-400" /> Vegetation (NDVI)
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{reading.vegetationIndex}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <Route className="w-4 h-4 text-ink-300" /> Distance to Road
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{reading.distanceToRoad}<span className="text-sm text-ink-400 ml-1">m</span></p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <Clock className="w-4 h-4 text-ink-300" /> Last Update
          </div>
          <p className="text-sm font-mono font-semibold text-ink-100 mt-1">{reading.timestamp}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="section-title">Rainfall Trend</h3>
              <p className="section-subtitle">7-day — {zone.name}</p>
            </div>
            <CloudRain className="w-5 h-5 text-blue-400" />
          </div>
          <LineChart data={rainfallData} color="#3b82f6" unit="mm" yLabel="mm" />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="section-title">Soil Moisture Trend</h3>
              <p className="section-subtitle">7-day — {zone.name}</p>
            </div>
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <LineChart data={moistureData} color="#06b6d4" unit="%" yLabel="%" />
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="section-title">Risk Probability Trend</h3>
              <p className="section-subtitle">7-day — {zone.name}</p>
            </div>
            <RiskBadge level={zone.riskLevel} size="sm" />
          </div>
          <LineChart data={riskData} color={riskLevelConfig[zone.riskLevel].dot.replace('bg-', '#').replace('500', '500')} unit="%" yLabel="%" />
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">Rainfall Comparison — All Zones (24h)</h3>
            <p className="section-subtitle">Current rainfall across all monitored zones</p>
          </div>
          <CloudRain className="w-5 h-5 text-blue-400" />
        </div>
        <BarChart
          data={zoneReadings}
          color="#3b82f6"
          unit="mm"
          highlightThreshold={80}
          highlightColor="#dc2626"
          height={200}
        />
      </div>

      <div className="card p-4">
        <div className="flex items-start gap-2.5">
          <div className="flex items-center gap-2 shrink-0">
            <span className={demoTag}>DATA SOURCE</span>
          </div>
          <p className="text-xs text-ink-500 leading-relaxed">
            No live weather API is currently connected. All readings are simulated for demonstration. When integrated,
            data sources will include weather APIs, satellite-based soil moisture datasets, and terrain/elevation
            datasets (SRTM). Each data point will carry source attribution, timestamp, geographic coverage, and license
            information.
          </p>
        </div>
      </div>
    </div>
  );
}
