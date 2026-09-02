import { useState } from 'react';
import { FileText, Plus, CheckCircle2, X } from 'lucide-react';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { demoTag } from '@/components/ui/DemoTag';
import { incidentReports } from '@/data/demoData';
import type { ReportStatus, RiskLevel, IncidentReport } from '@/types';

const statusConfig: Record<ReportStatus, { color: string; bg: string }> = {
  Pending: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'Under Review': { color: 'text-blue-400', bg: 'bg-blue-500/10' },
  Verified: { color: 'text-green-400', bg: 'bg-green-500/10' },
  Resolved: { color: 'text-ink-300', bg: 'bg-ink-700/50' },
  Rejected: { color: 'text-red-400', bg: 'bg-red-500/10' },
};

export function ReportsPage() {
  const [showForm, setShowForm] = useState(false);
  const [reports, setReports] = useState<IncidentReport[]>(incidentReports);
  const [newReportId, setNewReportId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    reporterType: 'Citizen',
    location: '',
    lat: '',
    lng: '',
    category: 'Road Blockage',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `RPT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const newReport: IncidentReport = {
      id,
      reporterType: formData.reporterType as IncidentReport['reporterType'],
      location: formData.location || 'Unspecified location',
      lat: parseFloat(formData.lat) || 0,
      lng: parseFloat(formData.lng) || 0,
      category: formData.category as IncidentReport['category'],
      description: formData.description,
      status: 'Pending',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      severity: 'MODERATE' as RiskLevel,
    };
    setReports([newReport, ...reports]);
    setNewReportId(id);
    setShowForm(false);
    setFormData({
      reporterType: 'Citizen',
      location: '',
      lat: '',
      lng: '',
      category: 'Road Blockage',
      description: '',
    });
    setTimeout(() => setNewReportId(null), 5000);
  };

  const handleStatusChange = (reportId: string, newStatus: ReportStatus) => {
    setReports(reports.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r)));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={demoTag}>DEMO DATA</span>
          <p className="text-sm text-ink-400">
            Reports are stored in the application state. Database persistence will be connected in a later phase.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Report'}
        </button>
      </div>

      {newReportId && (
        <div className="card p-4 border-green-500/30 bg-green-500/5 animate-fade-in flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-sm font-medium text-green-400">Report submitted successfully</p>
            <p className="text-xs text-ink-400">
              Report ID: <span className="font-mono">{newReportId}</span>
            </p>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 space-y-4 animate-slide-in">
          <div>
            <h3 className="section-title">Submit Incident Report</h3>
            <p className="section-subtitle">Report a landslide-related incident in your area</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-400 mb-1">Reporter Type</label>
              <select
                value={formData.reporterType}
                onChange={(e) => setFormData({ ...formData, reporterType: e.target.value })}
                className="input-field"
              >
                <option>Citizen</option>
                <option>Field Officer</option>
                <option>Authority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-400 mb-1">Report Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                <option>Road Blockage</option>
                <option>Ground Crack</option>
                <option>Slope Movement</option>
                <option>Rockfall</option>
                <option>Landslide</option>
                <option>Infrastructure Damage</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-400 mb-1">Location (name)</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Cherrapunji Ridge, SH-4"
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-ink-400 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-400 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-400 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Describe what you observed..."
              className="input-field resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-400 mb-1">Image/Video Upload</label>
            <div className="border-2 border-dashed border-ink-700 rounded-lg p-4 text-center">
              <p className="text-xs text-ink-500">File upload will be available with database integration</p>
            </div>
          </div>
          <button type="submit" className="btn-primary">
            <CheckCircle2 className="w-4 h-4" />
            Submit Report
          </button>
        </form>
      )}

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">All Incident Reports</h3>
            <p className="section-subtitle">Submitted field and citizen reports</p>
          </div>
          <FileText className="w-5 h-5 text-accent-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-400 uppercase tracking-wider border-b border-ink-700">
                <th className="pb-2 pr-4 font-medium">Report ID</th>
                <th className="pb-2 pr-4 font-medium">Location</th>
                <th className="pb-2 pr-4 font-medium hidden md:table-cell">Category</th>
                <th className="pb-2 pr-4 font-medium hidden md:table-cell">Severity</th>
                <th className="pb-2 pr-4 font-medium hidden lg:table-cell">Date</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-ink-800/50 hover:bg-ink-800/30 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-xs text-accent-300">{report.id}</td>
                  <td className="py-2.5 pr-4">
                    <div className="text-ink-100">{report.location}</div>
                    <div className="text-xs text-ink-500">{report.reporterType}</div>
                  </td>
                  <td className="py-2.5 pr-4 text-ink-300 hidden md:table-cell">{report.category}</td>
                  <td className="py-2.5 pr-4 hidden md:table-cell">
                    <RiskBadge level={report.severity} size="sm" />
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-ink-400 font-mono hidden lg:table-cell">
                    {report.timestamp}
                  </td>
                  <td className="py-2.5">
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report.id, e.target.value as ReportStatus)}
                      className={`text-xs font-medium rounded px-2 py-1 border-0 cursor-pointer ${statusConfig[report.status].bg} ${statusConfig[report.status].color}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Verified">Verified</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
