import { useState } from 'react';
import { Search, Plus, ChevronLeft, GripVertical, X, Clock, CheckCircle2 } from 'lucide-react';
import './ReportBuilder.css'

export default function ReportBuilder() {
  const [view, setView] = useState('list'); // 'list' | 'builder'
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTrailOpen, setIsTrailOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  // --- Mock Data ---
  const initialReports = [
    { id: 'RPT-B-001', name: 'Monthly Complaints Summary', category: 'Complaint Summary', status: 'Deployed', date: '2026-09-01', user: 'System Admin' },
    { id: 'RPT-B-002', name: 'Officer Performance', category: 'Officer Performance', status: 'Deployed', date: '2026-09-12', user: 'System Admin' },
    { id: 'RPT-B-003', name: 'SBP Regulatory Report', category: 'SBP Regulatory', status: 'Draft', date: '2026-09-18', user: 'System Admin' },
    { id: 'RPT-B-473', name: 'Untitled Report', category: '', status: 'Deployed', date: '2026-10-24', user: 'System Admin' },
  ];

  const fieldsList = [
    'Customer Name', 'Complaint Type', 'Aging Days', 'Branch ID', 'Status', 
    'Officer Name', 'Lodge Date', 'CNIC', 'Channel', 'SBP Type', 'TAT Remaining'
  ];

  const auditTrailData = [
    { action: 'Created report', user: 'System Admin', time: '2026-08-01 09:12' },
    { action: 'Added Column B fields', user: 'System Admin', time: '2026-08-10 14:35' },
    { action: 'Deployed report', user: 'System Admin', time: '2026-09-01 08:00' },
  ];

  // --- Handlers ---
  const handleOpenBuilder = (report = null) => {
    setCurrentReport(report);
    setIsEditMode(!!report);
    setView('builder');
  };

  const handleOpenTrail = (report) => {
    setCurrentReport(report);
    setIsTrailOpen(true);
  };

  // ================= VIEW 1: LIST VIEW =================
  if (view === 'list') {
    return (
      <div style={{ paddingBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 className="page-title">Report Builder</h1>
            <p className="page-subtitle">Build and deploy custom reports. Deployed reports appear in the Reports screen.</p>
          </div>
          <button className="btn-primary" onClick={() => handleOpenBuilder()}>
            <Plus size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> Build Report
          </button>
        </div>

        <div className="report-table">
          <div className="report-table-header">
            <div style={{ width: '100px' }}>ID</div>
            <div style={{ flex: 1 }}>REPORT NAME</div>
            <div style={{ width: '180px' }}>CATEGORY</div>
            <div style={{ width: '120px' }}>STATUS</div>
            <div style={{ width: '150px' }}>LAST EDITED</div>
            <div style={{ width: '120px', textAlign: 'right' }}>ACTIONS</div>
          </div>

          {initialReports.map((report) => (
            <div key={report.id} className="report-table-row">
              <div style={{ width: '100px', color: 'var(--primary-red)', fontSize: '13px', fontWeight: 500 }}>{report.id}</div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{report.name}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>by {report.user}</div>
              </div>

              <div style={{ width: '180px', fontSize: '13px', color: '#6b7280' }}>{report.category || '-'}</div>
              
              <div style={{ width: '120px' }}>
                <span className={`status-badge ${report.status === 'Deployed' ? 'deployed' : 'draft'}`}>
                  {report.status}
                </span>
              </div>

              <div style={{ width: '150px', fontSize: '13px', color: '#6b7280' }}>
                <div>{report.date}</div>
                <div style={{ fontSize: '11px' }}>by {report.user}</div>
              </div>

              <div style={{ width: '120px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button className="btn-sm" onClick={() => handleOpenBuilder(report)}>Edit</button>
                <button className="btn-sm" onClick={() => handleOpenTrail(report)}>Trail</button>
              </div>
            </div>
          ))}
        </div>

        {/* Audit Trail Modal */}
        {isTrailOpen && (
          <div className="modal-overlay" onClick={() => setIsTrailOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600 }}>{currentReport?.name}</h2>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>Audit Trail · {currentReport?.id}</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {auditTrailData.map((trail, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div className="avatar-circle red" style={{ width: '24px', height: '24px', fontSize: '12px', flexShrink: 0 }}>S</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)' }}>{trail.action}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{trail.user} · {trail.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= VIEW 2: BUILDER VIEW =================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 110px)' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-back" onClick={() => setView('list')}>
            <ChevronLeft size={16} /> All Reports
          </button>
          <div style={{ height: '20px', width: '1px', background: 'var(--border-color)' }}></div>
          <h2 style={{ fontSize: '16px', fontWeight: 600 }}>
            {isEditMode ? `Edit: ${currentReport?.name}` : 'New Report'}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{ width: '200px', borderColor: 'var(--primary-red)' }} defaultValue={currentReport?.category || ''}>
            <option value="" disabled>Report Category...</option>
            <option>Complaint Summary</option>
            <option>Officer Performance</option>
            <option>SBP Regulatory</option>
          </select>
          <input type="text" placeholder="Report name..." defaultValue={currentReport?.name || ''} style={{ width: '250px' }} />
        </div>
      </div>

      {/* Builder Area */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar (Fields) */}
        <div className="builder-sidebar">
          <div className="search-box" style={{ padding: '12px' }}>
            <Search size={16} color="#9ca3af" />
            <input type="text" placeholder="Search parameters..." />
          </div>
          
          <div style={{ padding: '12px' }}>
            <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              FIELD DATASETS <span style={{ cursor: 'pointer' }}>▼</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
              {fieldsList.map(field => (
                <div key={field} className="draggable-field">
                  <GripVertical size={14} color="#9ca3af" /> {field}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Canvas (Columns) */}
        <div className="canvas-container">
          <div className="canvas-columns">
            {/* Column A */}
            <div className="canvas-column">
              <div className="canvas-header">Column A <span>▼</span></div>
              <div className="canvas-dropzone">
                {isEditMode && (
                  <>
                    <div className="canvas-pill">Lodge Date <X size={12} /></div>
                    <div className="canvas-pill">Complaint Type <X size={12} /></div>
                  </>
                )}
              </div>
            </div>

            {/* Column B */}
            <div className="canvas-column">
              <div className="canvas-header">Column B <span>▼</span></div>
              <div className="canvas-dropzone">
                {isEditMode && (
                  <>
                    <div className="canvas-pill">Status <X size={12} /></div>
                    <div className="canvas-pill">Aging Days <X size={12} /></div>
                  </>
                )}
              </div>
            </div>

            {/* Column C */}
            <div className="canvas-column">
              <div className="canvas-header" style={{ color: 'var(--primary-red)' }}>Column C <span>▼</span></div>
              <div className="canvas-dropzone">
                <span style={{ color: '#d1d5db', fontSize: '13px' }}>Drop field here</span>
              </div>
            </div>

            {/* Add Column Button */}
            <div style={{ width: '40px', display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
               <button className="btn-sm" style={{ padding: '6px', borderRadius: '50%' }}><Plus size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', flexShrink: 0 }}>
        <button className="btn-outline" onClick={() => setIsTrailOpen(true)}>Audit Trail</button>
        <button className="btn-outline">Save Draft</button>
        <button className="btn-primary" onClick={() => setView('list')}>Deploy</button>
      </div>

      {/* Audit Trail Modal (Same as above) */}
      {isTrailOpen && (
        <div className="modal-overlay" onClick={() => setIsTrailOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>{currentReport?.name || 'New Report'}</h2>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>Audit Trail · {currentReport?.id || 'Draft'}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {auditTrailData.map((trail, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div className="avatar-circle red" style={{ width: '24px', height: '24px', fontSize: '12px', flexShrink: 0 }}>S</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)' }}>{trail.action}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{trail.user} · {trail.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}