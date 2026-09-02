import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Map as MapIcon, Layers, X, MapPin, CloudRain, Droplets, Gauge, History, Route, Users, Clock } from 'lucide-react';
import { riskZones, incidentReports, riskLevelConfig } from '@/data/demoData';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { demoTag } from '@/components/ui/DemoTag';
import type { RiskZone, RiskLevel } from '@/types';

const riskColors: Record<RiskLevel, string> = {
  LOW: '#16a34a',
  MODERATE: '#ca8a04',
  HIGH: '#ea580c',
  CRITICAL: '#dc2626',
};

function createMarkerIcon(color: string, isReport = false) {
  const svg = isReport
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="#0a1929" stroke-width="1.5"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="2.5" fill="#0a1929"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${color}" stroke="#0a1929" stroke-width="1.5"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/><circle cx="12" cy="9" r="3" fill="#0a1929"/></svg>`;

  return L.divIcon({
    html: svg,
    className: 'terraguard-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
}

const reportCategoryColors: Record<string, string> = {
  'Road Blockage': '#ea580c',
  'Ground Crack': '#ca8a04',
  'Slope Movement': '#dc2626',
  Rockfall: '#ea580c',
  Landslide: '#dc2626',
  'Infrastructure Damage': '#ca8a04',
  Other: '#627d98',
};

type LayerKey = 'zones' | 'reports';

export function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<Record<LayerKey, boolean>>({ zones: true, reports: true });
  const [showLegend, setShowLegend] = useState(true);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [25.5, 93.0],
      zoom: 6,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    const zoneMarkers: L.Marker[] = [];
    riskZones.forEach((zone) => {
      const marker = L.marker([zone.lat, zone.lng], {
        icon: createMarkerIcon(riskColors[zone.riskLevel]),
      }).addTo(map);

      marker.bindTooltip(
        `<div style="font-family:Inter,sans-serif;font-size:12px;font-weight:600;color:#102a43">${zone.name}</div>`,
        { direction: 'top', offset: [0, -20] }
      );

      marker.on('click', () => setSelectedZone(zone));
      zoneMarkers.push(marker);
    });

    const reportMarkers: L.Marker[] = [];
    incidentReports.forEach((report) => {
      const color = reportCategoryColors[report.category] ?? '#627d98';
      const marker = L.marker([report.lat, report.lng], {
        icon: createMarkerIcon(color, true),
      }).addTo(map);

      marker.bindTooltip(
        `<div style="font-family:Inter,sans-serif;font-size:11px;color:#102a43"><strong>${report.category}</strong><br/>${report.location}</div>`,
        { direction: 'top', offset: [0, -20] }
      );

      reportMarkers.push(marker);
    });

    (map as unknown as { _zoneMarkers: L.Marker[] })._zoneMarkers = zoneMarkers;
    (map as unknown as { _reportMarkers: L.Marker[] })._reportMarkers = reportMarkers;

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const zoneMarkers = (map as unknown as { _zoneMarkers?: L.Marker[] })._zoneMarkers ?? [];
    const reportMarkers = (map as unknown as { _reportMarkers?: L.Marker[] })._reportMarkers ?? [];

    zoneMarkers.forEach((m) => {
      if (visibleLayers.zones) {
        if (!map.hasLayer(m)) m.addTo(map);
      } else {
        if (map.hasLayer(m)) map.removeLayer(m);
      }
    });

    reportMarkers.forEach((m) => {
      if (visibleLayers.reports) {
        if (!map.hasLayer(m)) m.addTo(map);
      } else {
        if (map.hasLayer(m)) map.removeLayer(m);
      }
    });
  }, [visibleLayers]);

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={demoTag}>DEMO DATA</span>
        <p className="text-sm text-ink-400">
          Interactive map of the North Eastern Region. Click any marker for zone details. Map tiles from OpenStreetMap / CARTO.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-ink-400" />
          <span className="text-xs font-medium text-ink-400 mr-1">Layers:</span>
        </div>
        {([
          { key: 'zones' as LayerKey, label: 'Risk Zones', color: 'bg-accent-500' },
          { key: 'reports' as LayerKey, label: 'Incident Reports', color: 'bg-orange-500' },
        ]).map((layer) => (
          <button
            key={layer.key}
            onClick={() => setVisibleLayers((prev) => ({ ...prev, [layer.key]: !prev[layer.key] }))}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              visibleLayers[layer.key]
                ? 'bg-ink-800 text-ink-100 border-ink-600'
                : 'bg-ink-900/40 text-ink-500 border-ink-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${visibleLayers[layer.key] ? layer.color : 'bg-ink-600'}`} />
            {layer.label}
          </button>
        ))}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-ink-800 text-ink-200 border border-ink-700 hover:bg-ink-700 transition-colors"
        >
          {showLegend ? 'Hide Legend' : 'Show Legend'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-1 relative overflow-hidden" style={{ minHeight: '500px' }}>
          <div ref={mapContainerRef} className="w-full h-full rounded-lg" style={{ minHeight: '500px', zIndex: 0 }} />

          {showLegend && (
            <div className="absolute bottom-3 left-3 z-[1000] card p-3 space-y-1.5 pointer-events-none">
              <p className="text-xs font-semibold text-ink-200 mb-1">Risk Levels</p>
              {(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((level) => (
                <div key={level} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: riskColors[level] }} />
                  <span className="text-xs text-ink-300">{level}</span>
                </div>
              ))}
              <div className="border-t border-ink-700 mt-1.5 pt-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500 border border-ink-900" />
                  <span className="text-xs text-ink-300">Incident Report</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card p-5 max-h-[500px] overflow-y-auto">
          {selectedZone ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-ink-50">{selectedZone.name}</h3>
                  <p className="text-xs text-ink-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {selectedZone.district}, {selectedZone.state}
                  </p>
                </div>
                <button onClick={() => setSelectedZone(null)} className="text-ink-500 hover:text-ink-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-ink-800/40">
                <RiskBadge level={selectedZone.riskLevel} />
                <div className="ml-auto text-right">
                  <p className="text-xs text-ink-400">Risk Probability</p>
                  <p className="text-2xl font-bold font-mono" style={{ color: riskColors[selectedZone.riskLevel] }}>
                    {selectedZone.riskProbability}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-ink-800/40">
                  <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                    <CloudRain className="w-3.5 h-3.5" /> Rainfall 24h
                  </div>
                  <p className="text-sm font-mono font-semibold text-ink-100">{selectedZone.rainfall24h} mm</p>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-800/40">
                  <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                    <Droplets className="w-3.5 h-3.5" /> Soil Moisture
                  </div>
                  <p className="text-sm font-mono font-semibold text-ink-100">{selectedZone.soilMoisture}%</p>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-800/40">
                  <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                    <Gauge className="w-3.5 h-3.5" /> Slope
                  </div>
                  <p className="text-sm font-mono font-semibold text-ink-100">{selectedZone.slope}°</p>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-800/40">
                  <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                    <History className="w-3.5 h-3.5" /> Past Events
                  </div>
                  <p className="text-sm font-mono font-semibold text-ink-100">{selectedZone.historicalEvents}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-800/40">
                  <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                    <Users className="w-3.5 h-3.5" /> Population
                  </div>
                  <p className="text-sm font-mono font-semibold text-ink-100">
                    {selectedZone.population.toLocaleString()}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-800/40">
                  <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                    <Route className="w-3.5 h-3.5" /> Road Status
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      selectedZone.roadConnectivity === 'Blocked'
                        ? 'text-red-400'
                        : selectedZone.roadConnectivity === 'Partially Blocked'
                          ? 'text-orange-400'
                          : 'text-green-400'
                    }`}
                  >
                    {selectedZone.roadConnectivity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-ink-500 pt-2 border-t border-ink-800">
                <Clock className="w-3 h-3" />
                Last update: <span className="font-mono">{selectedZone.lastUpdate}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MapIcon className="w-10 h-10 text-ink-600 mb-3" />
              <p className="text-sm text-ink-400 font-medium">Click a marker on the map</p>
              <p className="text-xs text-ink-500 mt-1">Select any zone or report pin to view detailed information here.</p>
              <div className="mt-6 w-full space-y-2">
                <p className="text-xs font-medium text-ink-400 uppercase tracking-wider text-left">Quick Select</p>
                {riskZones.slice(0, 5).map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-ink-800/40 hover:bg-ink-800/70 transition-colors text-left"
                  >
                    <span className="text-xs text-ink-200">{zone.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: riskColors[zone.riskLevel] }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
