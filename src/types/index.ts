export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type ReportStatus = 'Pending' | 'Under Review' | 'Verified' | 'Resolved' | 'Rejected';

export type ReportCategory =
  | 'Road Blockage'
  | 'Ground Crack'
  | 'Slope Movement'
  | 'Rockfall'
  | 'Landslide'
  | 'Infrastructure Damage'
  | 'Other';

export type ReporterType = 'Citizen' | 'Field Officer' | 'Authority';

export type AlertStatus = 'Active' | 'Acknowledged' | 'Cleared';

export type PriorityTier = 'Priority 1' | 'Priority 2' | 'Priority 3';

export interface RiskZone {
  id: string;
  name: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  riskLevel: RiskLevel;
  riskProbability: number;
  rainfall24h: number;
  soilMoisture: number;
  slope: number;
  historicalEvents: number;
  population: number;
  roadConnectivity: 'Connected' | 'Partially Blocked' | 'Blocked';
  lastUpdate: string;
}

export interface Alert {
  id: string;
  zoneName: string;
  severity: RiskLevel;
  riskProbability: number;
  triggers: string[];
  time: string;
  recommendedAction: string;
  targetAudience: ReporterType[];
  status: AlertStatus;
}

export interface IncidentReport {
  id: string;
  reporterType: ReporterType;
  location: string;
  lat: number;
  lng: number;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  timestamp: string;
  severity: RiskLevel;
}

export interface PriorityEntry {
  rank: number;
  tier: PriorityTier;
  zoneName: string;
  riskProbability: number;
  population: number;
  roadConnectivity: 'Connected' | 'Partially Blocked' | 'Blocked';
  infrastructure: string;
  historicalVulnerability: number;
  activeReports: number;
  rationale: string;
}

export interface EnvironmentalReading {
  zoneName: string;
  rainfall1h: number;
  rainfall24h: number;
  rainfall7d: number;
  soilMoisture: number;
  temperature: number;
  elevation: number;
  slope: number;
  vegetationIndex: number;
  distanceToRoad: number;
  timestamp: string;
}

export interface HistoricalEvent {
  id: string;
  year: number;
  state: string;
  district: string;
  magnitude: RiskLevel;
  casualties: number;
  rainfallTrigger: number;
}

export interface PredictionFeatures {
  lat: number;
  lng: number;
  rainfall1h: number;
  rainfall24h: number;
  rainfall7d: number;
  soilMoisture: number;
  temperature: number;
  elevation: number;
  slope: number;
  historicalLandslideCount: number;
  vegetationIndex: number;
  distanceToRoad: number;
}

export interface PredictionResult {
  probability: number;
  riskLevel: RiskLevel;
  features: PredictionFeatures;
  timestamp: string;
  isDemo: boolean;
}
