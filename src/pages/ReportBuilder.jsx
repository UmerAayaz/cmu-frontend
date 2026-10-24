import { useState } from 'react';
import { Search, Plus, ChevronLeft, GripVertical, X, Clock, CheckCircle2, Minus, Equal, Divide, Calculator } from 'lucide-react';
import './ReportBuilder.css';

export default function ReportBuilder() {
  const [view, setView] = useState('builder'); // 'list' | 'builder'
  const [isEditMode, setIsEditMode] = useState(false);
  const [isTrailOpen, setIsTrailOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);

  // --- Drag & Drop States ---
  // Columns state jisme fields save hongi
  const [columns, setColumns] = useState([
    { id: 'col-1', title: 'Column A', field: null },
    { id: 'col-2', title: 'Column B', field: null },
    { id: 'col-3', title: 'Column C', field: null },
  ]);

  // --- Mock Data ---
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

  // Drag Start (Jab field uthana shuru karein)
  const handleDragStart = (e, fieldName) => {
    e.dataTransfer.setData("text/plain", fieldName);
    e.dataTransfer.effectAllowed = "move";
  };

  // Drag Over (Jab field column ke upar aaye)
  const handleDragOver = (e) => {
    e.preventDefault(); // Drop allow karne ke liye zaroori hai
    e.dataTransfer.dropEffect = "move";
  };

  // Drop (Jab field column mein chhor dein)
  const handleDrop = (e, colId) => {
    e.preventDefault();
    const fieldName = e.dataTransfer.getData("text/plain");
    
    if (fieldName) {
      setColumns(prev => prev.map(col => 
        col.id === colId ? { ...col, field: fieldName } : col
      ));
    }
  };

  // Field Remove (X par click karne par)
  const handleRemoveField = (colId) => {
    setColumns(prev => prev.map(col =>
      col.id === colId ? { ...col, field: null } : col
    ));
  };

  // Naya Column Add karna
  const handleAddColumn = () => {
    const nextChar = String.fromCharCode(65 + columns.length); // A, B, C, D...
    setColumns([...columns, { id: `col-${columns.length + 1}`, title: `Column ${nextChar}`, field: null }]);
  };

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
        
        {/* Left Sidebar (Fields & Operators) */}
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

            {/* NAYA SECTION: OPERATORS */}
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

        {/* Right Main Canvas (Columns) */}
        <div className="canvas-container" style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
          {columns.map((col) => (
            <div key={col.id} className="canvas-column" style={{ minWidth: '250px' }}>
              <div className="canvas-header">
                {col.title} <span>▼</span>
              </div>
              
              {/* Dropzone */}
              <div 
                className="canvas-dropzone"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                style={{ background: col.field ? '#fff' : '#f9fafb' }}
              >
                {col.field ? (
                  <>
                    {/* Field Pill */}
                    <div className="canvas-pill">
                      {col.field} 
                      <X 
                        size={14} 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => handleRemoveField(col.id)} 
                      />
                    </div>
                    
                    {/* Dummy Data Rows (Preview) */}
                    {[1, 2, 3, 4].map(rowNum => (
                      <div key={rowNum} style={{ width: '100%', padding: '12px 8px', fontSize: '12px', color: '#d1d5db', fontFamily: 'monospace', borderBottom: '1px solid #f3f4f6', textAlign: 'left' }}>
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

          {/* Add Column Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '20px' }}>
             <button className="btn-sm" style={{ padding: '8px', borderRadius: '50%', height: 'fit-content' }} onClick={handleAddColumn}>
               <Plus size={20} />
             </button>
          </div>

        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px', flexShrink: 0 }}>
        <button className="btn-outline" onClick={() => setIsTrailOpen(true)}>Audit Trail</button>
        <button className="btn-outline">Save Draft</button>
        <button className="btn-primary" onClick={() => setView('list')}>Deploy</button>
      </div>

      {/* Audit Trail Modal */}
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