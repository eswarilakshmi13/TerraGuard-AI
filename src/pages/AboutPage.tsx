import { useState } from 'react';
import { Info, GitBranch, Database, Shield, Code, Cpu, ChevronDown, ChevronUp, HelpCircle, MapPin, Users, Layers } from 'lucide-react';
import { riskZones } from '@/data/demoData';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'What is TerraGuard AI in simple terms?',
    answer:
      'TerraGuard AI is a system that helps predict where landslides might happen in the hill regions of North East India. Think of it like a weather forecast, but instead of telling you if it will rain, it tells you if a hillside might collapse. It looks at things like how much it has rained, how wet the soil is, how steep the slope is, and whether landslides have happened there before — then gives a risk score for that area.',
  },
  {
    question: 'Who is this system built for?',
    answer:
      'Three groups of people: (1) Disaster Management Authorities — government officials who need to see the big picture across all zones and decide where to send help. (2) Field Officers — people on the ground who inspect hillsides, report problems like road blockages or cracks, and track whether reports are resolved. (3) Local Communities — citizens who receive warnings in simple language and can report what they see in their area.',
  },
  {
    question: 'What does the Dashboard show me?',
    answer:
      'The Dashboard is the main control center. It shows how many zones are being monitored, how many are at low, moderate, high, or critical risk, how many active alerts exist, and how many field reports are pending. It also has a table of all zones ranked by risk, a 7-day risk trend chart, and a snapshot of current environmental conditions for the highest-risk zone.',
  },
  {
    question: 'How does the Risk Prediction page work?',
    answer:
      'You select a zone (like Cherrapunji Ridge) from a dropdown, and the system automatically loads all the environmental data for that zone — rainfall, soil moisture, slope angle, historical landslide count, and more. You can also pick a scenario like "Heavy Rainfall Event" to see how risk changes under different conditions. Then you click "Predict" and the system gives you a risk percentage (like 87%) and a risk level (Low, Moderate, High, or Critical). If you want, you can expand the advanced section to manually adjust any of the 12 input values.',
  },
  {
    question: 'Why are there only 8 zones? Shouldn\'t there be more?',
    answer:
      'The 8 zones are sample locations chosen to represent different states and risk levels across the North Eastern Region — Meghalaya, Manipur, Nagaland, Arunachal Pradesh, Mizoram, and Assam. They are not a complete list of every landslide-prone area. The real system would monitor hundreds of zones using actual geological survey data. For the hackathon prototype, 8 zones are enough to demonstrate the full workflow — from low risk to critical — without making the demo overwhelming. Adding more zones is just a matter of adding more data entries; the system architecture supports unlimited zones.',
  },
  {
    question: 'What is the Live Risk Map?',
    answer:
      'It is a real interactive map (using Leaflet with dark map tiles) centered on the North Eastern Region of India. Each monitored zone appears as a colored pin — green for low risk, yellow for moderate, orange for high, and red for critical. Incident reports from field officers and citizens also appear on the map. When you click any pin, a side panel shows you the full details for that zone: risk level, probability, rainfall, soil moisture, slope, historical events, population, road connectivity, and last update time. You can toggle layers on and off to show or hide risk zones and incident reports.',
  },
  {
    question: 'What do the Early Warnings tell me?',
    answer:
      'The Early Warnings page shows all active alerts. Each alert tells you which zone is at risk, how severe it is (Critical, High, etc.), the risk probability, what factors triggered the alert (like "Heavy rainfall + high soil moisture + steep slope"), what action is recommended, and who should receive the alert. The page also shows how the same alert would be communicated differently to citizens (simple language), field officers (technical details), and authorities (big-picture summary). No actual SMS or push notifications are sent — this is an alert generation interface for the prototype.',
  },
  {
    question: 'How does the Incident Reports feature work?',
    answer:
      'Anyone can submit a report by clicking "New Report" on the Incident Reports page. You enter your role (Citizen, Field Officer, or Authority), the location, the category (Road Blockage, Ground Crack, Slope Movement, Rockfall, Landslide, Infrastructure Damage, or Other), a description, and coordinates. The system gives each report a unique ID and shows a success confirmation. Authorities can then see all reports in a table and update their status — Pending, Under Review, Verified, Resolved, or Rejected — using a dropdown on each row.',
  },
  {
    question: 'What is Emergency Prioritization?',
    answer:
      'When multiple zones are at risk, authorities need to know which one to address first. The Emergency Prioritization page ranks all zones from most urgent to least urgent based on a combination of factors: risk probability (35% weight), population exposure (25%), road connectivity (20%), and historical vulnerability plus active field reports (20%). Each zone gets a priority tier (Priority 1 = Critical, Priority 2 = High, Priority 3 = Moderate) and a plain-language explanation of why it received that priority. The scoring weights are shown openly on the page — they are not hidden or fabricated.',
  },
  {
    question: 'What does the Weather & Environment page show?',
    answer:
      'You select a zone, and the page displays 8 environmental readings as cards: rainfall (1 hour, 24 hours, 7 days), soil moisture, temperature, elevation, slope, vegetation index, and distance to nearest road. Below the cards, three line charts show 7-day trends for rainfall, soil moisture, and risk probability. A bar chart at the bottom compares rainfall across all zones, with high-rainfall zones highlighted in red. All data is labeled as "Demo / Simulated Data" — no live weather API is connected yet.',
  },
  {
    question: 'What is the AI Risk Explanation page?',
    answer:
      'This page answers the question "WHY is this zone at high risk?" Instead of just giving a number, it breaks down each factor that contributed to the prediction. For example, it might show that heavy rainfall was a "Major contributor" (pushing risk up by +0.28), steep slope was a "Significant contributor" (+0.18), and good vegetation was a "Minor reducer" (bringing risk down by -0.08). This uses a SHAP-style visualization (orange bars for factors that increase risk, green bars for factors that reduce it). The page also shows a global feature importance chart — which factors matter most across all predictions. All values are clearly labeled as sample data until the real ML model is connected.',
  },
  {
    question: 'What does Historical Analysis show?',
    answer:
      'This page shows past landslide events with charts: events by state (bar chart), events over time by year (bar chart), rainfall vs casualties (scatter plot showing the correlation between heavy rainfall and impact), and risk distribution (how many events were Low, Moderate, High, or Critical). You can filter by state and risk level. A table at the bottom ranks zones by their historical landslide activity. All historical data is simulated for the prototype — real data would come from the Geological Survey of India, ISRO/NRSC, and NASA Global Landslide Catalog.',
  },
  {
    question: 'Is the AI / ML model real or fake?',
    answer:
      'It is not fake, but it is also not a trained ML model yet. The current risk predictions use a transparent weighted formula — a mathematical combination of the input factors with visible weights. This is clearly labeled as "DEMO DATA" throughout the application. No accuracy metrics are fabricated. No confidence scores are shown (because a real model has not been trained yet). When the ML pipeline is built in Phase 3, the same interface will display real predictions from a trained Random Forest or XGBoost model, with calibrated confidence scores and real SHAP values for explanations.',
  },
  {
    question: 'Is the data real or simulated?',
    answer:
      'All data in the current prototype is simulated for demonstration. Every page that shows data has a visible "DEMO DATA" or "Demo / Simulated Data" label. The environmental readings, risk zones, alerts, incident reports, and historical events are all realistic but fabricated. The architecture is designed so that real data sources can be plugged in without changing the interface — the data layer is separate from the presentation layer.',
  },
  {
    question: 'Will this work in areas with poor internet connectivity?',
    answer:
      'The problem statement specifically requires support for remote regions with poor connectivity. The prototype includes a connectivity status indicator in the sidebar (showing "Connected" or "Offline — queued" with a last-sync timestamp). The full offline design — local caching, local storage for pending field reports, a synchronization queue, and offline submission status — is planned for Phase 11. The prototype does not falsely claim full offline functionality; it shows the infrastructure for it.',
  },
  {
    question: 'What are the four risk levels and what do they mean?',
    answer:
      'LOW (green) — conditions are normal, no immediate concern. MODERATE (yellow) — some risk factors are elevated, monitoring should be increased. HIGH (orange) — multiple risk factors are active, preparedness actions should begin. CRITICAL (red) — immediate danger, evacuation preparedness and emergency response should be initiated. Risk levels are determined by the risk probability score: below 35% is Low, 35–59% is Moderate, 60–79% is High, and 80%+ is Critical.',
  },
  {
    question: 'What is the demo mode for the hackathon?',
    answer:
      'The prototype supports five demo scenarios: (1) Normal conditions showing low risk. (2) Heavy rainfall + high soil moisture + steep slope showing high/critical risk. (3) A field officer submitting a road blockage report that appears on the dashboard and map. (4) A critical risk zone triggering an alert. (5) An authority view showing emergency priorities. All simulated data is clearly labeled "DEMO DATA" so it is never misrepresented as live government data.',
  },
  {
    question: 'What happens next after this prototype?',
    answer:
      'The next phases are: connecting real historical landslide datasets (GSI, ISRO/NRSC, NASA GLC), training and evaluating ML models (Logistic Regression, Random Forest, XGBoost), integrating live weather APIs, building the offline/cache system for low-connectivity areas, and deploying the final system. The current architecture — modular pages, separate data layer, reusable components — is designed so these additions can be made without rebuilding the interface.',
  },
  {
    question: 'Is the system secure?',
    answer:
      'Yes. API keys and secrets are stored in environment variables, never in the code. The .env file is excluded from version control. No credentials are exposed in client-side code. All user-facing forms have input validation. The system follows standard web security practices and does not expose sensitive information.',
  },
  {
    question: 'Can this system support multiple languages?',
    answer:
      'The code is structured so that notification text and interface labels can be extended to support multiple languages relevant to the North Eastern Region (English, Hindi, and local languages like Khasi, Mizo, Naga, etc.). The prototype currently uses English. Machine translation is not used blindly for emergency warnings — the architecture allows for curated translations to be added by language experts.',
  },
];

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-ink-800/30 transition-colors"
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-accent-400 shrink-0 mt-0.5" />
          <span className="text-sm font-medium text-ink-100">{item.question}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-ink-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-ink-400 shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pl-11 animate-fade-in">
          <p className="text-sm text-ink-400 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20">
            <Info className="w-7 h-7 text-accent-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink-50">TerraGuard AI</h2>
            <p className="text-sm text-ink-400 mt-1">
              AI-Powered Early Warning and Landslide Risk Monitoring System for the North Eastern Region of India
            </p>
            <p className="text-xs text-accent-400 mt-2 font-medium">
              Smart India Hackathon 2026 — Problem Statement SIH26001
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <Layers className="w-4 h-4 text-accent-400" /> Monitored Zones
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">{riskZones.length}</p>
          <p className="text-[11px] text-ink-500 mt-0.5">Sample zones across {new Set(riskZones.map((z) => z.state)).size} NER states</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <Users className="w-4 h-4 text-accent-400" /> User Groups
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">3</p>
          <p className="text-[11px] text-ink-500 mt-0.5">Authorities, Field Officers, Citizens</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-1.5">
            <MapPin className="w-4 h-4 text-accent-400" /> Modules
          </div>
          <p className="text-2xl font-bold font-mono text-ink-50">10</p>
          <p className="text-[11px] text-ink-500 mt-0.5">Full disaster-management workflow</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="w-5 h-5 text-accent-400" />
            <h3 className="section-title">System Workflow</h3>
          </div>
          <p className="text-sm text-ink-400 leading-relaxed">
            The platform follows a complete disaster-management pipeline:
          </p>
          <div className="flex items-center gap-2 flex-wrap mt-3 text-xs">
            {['Predict', 'Explain', 'Visualize', 'Warn', 'Report', 'Prioritize'].map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-accent-500/10 text-accent-300 font-medium border border-accent-500/20">
                  {step}
                </span>
                {i < 5 && <span className="text-ink-600">&rarr;</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-5 h-5 text-accent-400" />
            <h3 className="section-title">ML Architecture (Planned)</h3>
          </div>
          <ul className="space-y-2 text-sm text-ink-300">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
              Logistic Regression (baseline)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
              Random Forest (primary candidate)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
              Gradient Boosting / XGBoost
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
              Evaluation: Precision, Recall, F1, ROC-AUC, Confusion Matrix
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
              Explainability: SHAP values for feature contributions
            </li>
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-accent-400" />
            <h3 className="section-title">Data Sources (Planned)</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-1.5">Historical Landslide</p>
              <ul className="space-y-1 text-ink-300 text-xs">
                <li>Geological Survey of India</li>
                <li>ISRO / NRSC</li>
                <li>NASA Global Landslide Catalog</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-1.5">Environmental</p>
              <ul className="space-y-1 text-ink-300 text-xs">
                <li>Weather APIs (to be integrated)</li>
                <li>Satellite / soil moisture datasets</li>
                <li>Terrain / elevation datasets (SRTM)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-accent-400" />
            <h3 className="section-title">Security Practices</h3>
          </div>
          <ul className="space-y-2 text-sm text-ink-300">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
              API keys and secrets stored in environment variables
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
              .env file excluded from version control
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
              No credentials exposed in client-side code
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
              Input validation on all user-facing forms
            </li>
          </ul>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-5 h-5 text-accent-400" />
          <h3 className="section-title">Development Phases</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            { phase: 'Phase 1', desc: 'Project structure + dashboard shell', status: 'done' },
            { phase: 'Phase 2', desc: 'Dataset loading + preprocessing', status: 'pending' },
            { phase: 'Phase 3', desc: 'ML model training + evaluation', status: 'pending' },
            { phase: 'Phase 4', desc: 'Risk prediction interface', status: 'done' },
            { phase: 'Phase 5', desc: 'Explainable AI (SHAP)', status: 'done' },
            { phase: 'Phase 6', desc: 'GIS interactive map', status: 'done' },
            { phase: 'Phase 7', desc: 'Alert system', status: 'done' },
            { phase: 'Phase 8', desc: 'Field / citizen reporting', status: 'done' },
            { phase: 'Phase 9', desc: 'Emergency prioritization', status: 'done' },
            { phase: 'Phase 10', desc: 'Weather / environment integration', status: 'done' },
            { phase: 'Phase 11', desc: 'Offline / cache functionality', status: 'pending' },
            { phase: 'Phase 12', desc: 'Testing + deployment', status: 'pending' },
          ].map((p) => (
            <div
              key={p.phase}
              className={`p-3 rounded-lg border ${
                p.status === 'done'
                  ? 'bg-green-500/5 border-green-500/30'
                  : 'bg-ink-800/30 border-ink-700/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-200">{p.phase}</span>
                {p.status === 'done' ? (
                  <span className="text-[10px] font-bold text-green-400 uppercase">Complete</span>
                ) : (
                  <span className="text-[10px] font-bold text-ink-500 uppercase">Planned</span>
                )}
              </div>
              <p className="text-xs text-ink-400 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-accent-400" />
          <h3 className="section-title">Frequently Asked Questions</h3>
        </div>
        <p className="section-subtitle mb-4">
          Everything you need to understand the TerraGuard AI prototype, explained in plain language.
        </p>
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <FAQAccordion key={i} item={item} index={i} />
          ))}
        </div>
      </div>

      <div className="card p-4">
        <p className="text-xs text-ink-500 leading-relaxed">
          <strong className="text-ink-400">Disclaimer:</strong> All data currently displayed in this application is
          simulated demonstration data, clearly labeled as such. No live government data feeds, real-time weather
          APIs, or trained ML models are connected yet. The architecture is designed for seamless integration with
          legitimate external data sources and trained models in later development phases.
        </p>
      </div>
    </div>
  );
}
