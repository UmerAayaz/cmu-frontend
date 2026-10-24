import { useState, useRef } from 'react';
import { Search, Plus, ChevronLeft, GripVertical, X } from 'lucide-react';
import './ReportBuilder.css';

export default function ReportBuilder() {
  const [view, setView] = useState('list'); // 'list' | 'builder'
  const [isTrailOpen, setIsTrailOpen] = useState(false);
  
  // List View States
  const [reportsList, setReportsList] = useState([
    { id: 'RPT-B-001', name: 'Monthly Complaints Summary', category: 'Complaint Summary', status: 'Deployed', date: '2026-09-01', user: 'System Admin' },
    { id: 'RPT-B-002', name: 'Officer Performance', category: 'Officer Performance', status: 'Deployed', date: '2026-09-12', user: 'System Admin' },
    { id: 'RPT-B-003', name: 'SBP Regulatory Report', category: 'SBP Regulatory', status: 'Draft', date: '2026-09-18', user: 'System Admin' },
  ]);

  const [currentReport, setCurrentReport] = useState(null);

  // Builder Form States
  const [reportName, setReportName] = useState('');
  const [reportCategory, setReportCategory] = useState('');

  // Drag & Drop Columns State
  const [columns, setColumns] = useState([]);
  const canvasRef = useRef(null);

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
    if (report) {
      setCurrentReport(report);
      setReportName(report.name);
      setReportCategory(report.category);
      setColumns([
        { id: 'col-1', title: 'Column A', field: 'Customer Name' },
        { id: 'col-2', title: 'Column B', field: 'Status' },
        { id: 'col-3', title: 'Column C', field: null },
      ]);
    } else {
      setCurrentReport(null);
      setReportName('');
      setReportCategory('');
      setColumns([
        { id: 'col-1', title: 'Column A', field: null },
        { id: 'col-2', title: 'Column B', field: null },
        { id: 'col-3', title: 'Column C', field: null },
      ]);
    }
    setView('builder');
  };

  const handleBackToList = () => {
    setView('list');
    setCurrentReport(null);
    setReportName('');
    setReportCategory('');
    setColumns([]);
  };

  const handleSaveReport = (status) => {
    if (!reportName.trim()) {
      alert("Please enter a report name before saving.");
      return;
    }

    if (currentReport) {
      setReportsList(prev => prev.map(r => 
        r.id === currentReport.id ? { ...r, name: reportName, category: reportCategory || 'Uncategorized', status: status, date: new Date().toISOString().split('T')[0] } : r
      ));
    } else {
      const newId = `RPT-B-${String(reportsList.length + 1).padStart(3, '0')}`;
      const newReport = {
        id: newId,
        name: reportName,
        category: reportCategory || 'Uncategorized',
        status: status,
        date: new Date().toISOString().split('T')[0],
        user: 'System Admin'
      };
      setReportsList([newReport, ...reportsList]);
    }

    handleBackToList();
  };

  const handleDragStart = (e, fieldName) => {
    e.dataTransfer.setData("text/plain", fieldName);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const fieldName = e.dataTransfer.getData("text/plain");
    if (fieldName) {
      setColumns(prev => prev.map(col => 
        col.id === colId ? { ...col, field: fieldName } : col
      ));
    }
  };

  const handleRemoveField = (colId) => {
    setColumns(prev => prev.map(col =>
      col.id === colId ? { ...col, field: null } : col
    ));
  };

  const handleAddColumn = () => {
    const nextChar = String.fromCharCode(65 + columns.length); 
    setColumns([...columns, { id: `col-${Date.now()}`, title: `Column ${nextChar}`, field: null }]);
    
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.scrollTo({
          left: canvasRef.current.scrollWidth,
          behavior: 'smooth'
        });
      }
    }, 50);
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

          {reportsList.map((report) => (
            <div key={report.id} className="report-table-row">
              <div style={{ width: '100px', color: 'var(--primary-red)', fontSize: '13px', fontWeight: 500 }}>{report.id}</div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{report.name}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>by {report.user}</div>
              </div>

              <div style={{ width: '180px', fontSize: '13px', color: '#6b7280' }}>{report.category}</div>
              
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
                <button className="btn-sm" onClick={() => { setCurrentReport(report); setIsTrailOpen(true); }}>Trail</button>
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
          <button className="btn-back" onClick={handleBackToList}>
            <ChevronLeft size={16} /> All Reports
          </button>
          <div style={{ height: '20px', width: '1px', background: 'var(--border-color)' }}></div>
          <h2 style={{ fontSize: '16px', fontWeight: 600 }}>
            {currentReport ? `Edit: ${currentReport.name}` : 'New Report'}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            style={{ width: '200px', borderColor: 'var(--primary-red)' }} 
            value={reportCategory}
            onChange={(e) => setReportCategory(e.target.value)}
          >
            <option value="" disabled>Report Category...</option>
            <option value="Complaint Summary">Complaint Summary</option>
            <option value="Officer Performance">Officer Performance</option>
            <option value="SBP Regulatory">SBP Regulatory</option>
            <option value="Uncategorized">Uncategorized</option>
          </select>
          <input 
            type="text" 
            placeholder="Report name..." 
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            style={{ width: '250px' }} 
          />
        </div>
      </div>

      {/* Builder Area (minWidth: 0 added for scroll fix) */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0, minWidth: 0 }}>
        
        {/* Left Sidebar (Fixed) */}
        <div className="builder-sidebar">
          <div className="search-box" style={{ padding: '12px' }}>
            <Search size={16} color="#9ca3af" />
            <input type="text" placeholder="Search parameters..." />
          </div>
          
          <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
            <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              FIELD DATASETS <span style={{ cursor: 'pointer' }}>▼</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {fieldsList.map(field => (
                <div 
                  key={field} 
                  className="draggable-field"
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, field)}
                >
                  <GripVertical size={14} color="#9ca3af" /> {field}
                </div>
              ))}
            </div>

            <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              OPERATORS <span style={{ cursor: 'pointer' }}>▼</span>
            </div>
            <div className="operators-grid">
              <button className="operator-btn">+</button>
              <button className="operator-btn">−</button>
              <button className="operator-btn">=</button>
              <button className="operator-btn">/</button>
              <button className="operator-btn">×</button>
              <button className="operator-btn">&lt;</button>
              <button className="operator-btn">&gt;</button>
            </div>
          </div>
        </div>

        {/* Right Canvas (Scrollable X-Axis) */}
        <div className="canvas-container" ref={canvasRef}>
          {columns.map((col) => (
            <div key={col.id} className="canvas-column">
              <div className="canvas-header">
                {col.title} <span>▼</span>
              </div>
              
              <div 
                className={`canvas-dropzone ${col.field ? 'has-field' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {col.field ? (
                  <>
                    <div className="canvas-pill">
                      {col.field} 
                      <X 
                        size={14} 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => handleRemoveField(col.id)} 
                      />
                    </div>
                    
                    {[1, 2, 3, 4, 5, 6, 7].map(rowNum => (
                      <div key={rowNum} className="dummy-row">
                        [{col.field} — row {rowNum}]
                      </div>
                    ))}
                  </>
                ) : (
                  <span style={{ color: '#d1d5db', fontSize: '13px', marginTop: '20px' }}>Drop field here</span>
                )}
              </div>
            </div>
          ))}

          <div className="add-column-wrapper">
             <button className="add-column-btn" onClick={handleAddColumn}>
               <Plus size={20} />
             </button>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', flexShrink: 0 }}>
        <button className="btn-outline" onClick={() => setIsTrailOpen(true)}>Audit Trail</button>
        <button className="btn-outline" onClick={() => handleSaveReport('Draft')}>Save Draft</button>
        <button className="btn-primary" onClick={() => handleSaveReport('Deployed')}>Deploy</button>
      </div>

      {/* Audit Trail Modal */}
      {isTrailOpen && (
        <div className="modal-overlay" onClick={() => setIsTrailOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>{currentReport?.name || reportName || 'New Report'}</h2>
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