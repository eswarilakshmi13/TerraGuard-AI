import { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PredictionPage } from '@/pages/PredictionPage';
import { MapPage } from '@/pages/MapPage';
import { WarningsPage } from '@/pages/WarningsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { WeatherPage } from '@/pages/WeatherPage';
import { PriorityPage } from '@/pages/PriorityPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { ExplanationPage } from '@/pages/ExplanationPage';
import { AboutPage } from '@/pages/AboutPage';
import { Loader2 } from 'lucide-react';

const pageConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'AI-Powered Landslide Early Warning & Risk Monitoring',
  },
  prediction: {
    title: 'Risk Prediction',
    subtitle: 'Select a zone and scenario to assess landslide risk',
  },
  map: {
    title: 'Live Risk Map',
    subtitle: 'Interactive GIS visualization of monitored zones',
  },
  warnings: {
    title: 'Early Warnings',
    subtitle: 'Active alerts and audience-specific notifications',
  },
  reports: {
    title: 'Incident Reports',
    subtitle: 'Field and citizen reporting with status tracking',
  },
  weather: {
    title: 'Weather & Environmental Data',
    subtitle: 'Rainfall, soil moisture, temperature, and terrain monitoring',
  },
  priority: {
    title: 'Emergency Prioritization',
    subtitle: 'Ranked zone priority for response coordination',
  },
  history: {
    title: 'Historical Analysis',
    subtitle: 'Landslide event trends and regional analysis',
  },
  explanation: {
    title: 'AI Risk Explanation',
    subtitle: 'Explainable AI — understanding why predictions are made',
  },
  about: {
    title: 'About / System Information',
    subtitle: 'TerraGuard AI architecture and development roadmap',
  },
};

function AppContent() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const config = pageConfig[activePage] ?? pageConfig.dashboard;

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-accent-400 animate-spin" />
          <p className="text-sm text-ink-400">Loading TerraGuard AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'prediction':
        return <PredictionPage />;
      case 'map':
        return <MapPage />;
      case 'warnings':
        return <WarningsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'weather':
        return <WeatherPage />;
      case 'priority':
        return <PriorityPage />;
      case 'history':
        return <HistoryPage />;
      case 'explanation':
        return <ExplanationPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOnline={true}
        lastSync="2026-08-30 08:42"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={config.title} subtitle={config.subtitle} lastUpdate="2026-08-30 08:42 IST" />
        <main className="flex-1 p-6 overflow-x-hidden">{renderPage()}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
