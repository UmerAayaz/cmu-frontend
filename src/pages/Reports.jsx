import { useState } from 'react';
import { Search, ChevronLeft, Download, ChevronRight, Calendar } from 'lucide-react';
import './Reports.css'

export default function Reports() {
  const [view, setView] = useState('list'); // 'list' | 'detail'
  const [selectedReport, setSelectedReport] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Column Order State
  const [columns, setColumns] = useState(['Month', 'Total Complaints', 'Resolved', 'Pending', 'Closed']);

  // --- Mock Data ---
  const reportsList = [
    { id: 'RPT-001', title: 'Monthly Complaints Summary', meta: '5 columns · Deployed 2026-09-01', tags: ['Month', 'Total Complaints', 'Resolved', '+2 more'] },
    { id: 'RPT-002', title: 'Complaint Type Distribution', meta: '3 columns · Deployed 2026-08-15', tags: ['Complaint Type', 'Count', 'Percentage'] },
    { id: 'RPT-003', title: 'Branch Performance Report', meta: '5 columns · Deployed 2026-09-10', tags: ['Branch', 'Total', 'Resolved', '+2 more'] },
    { id: 'RPT-004', title: 'Officer Workload Report', meta: '5 columns · Deployed 2026-09-12', tags: ['Officer', 'Assigned', 'Closed', '+2 more'] },
    { id: 'RPT-005', title: 'SBP Compliance Report', meta: '5 columns · Deployed 2026-09-05', tags: ['Category', 'Total', 'Within TAT', '+2 more'] },
  ];

  const tableData = [
    { id: 1, Month: 'Jan 2026', 'Total Complaints': 142, Resolved: 128, Pending: 10, Closed: 4 },
    { id: 2, Month: 'Feb 2026', 'Total Complaints': 165, Resolved: 150, Pending: 12, Closed: 3 },
    { id: 3, Month: 'Mar 2026', 'Total Complaints': 189, Resolved: 172, Pending: 14, Closed: 3 },
    { id: 4, Month: 'Apr 2026', 'Total Complaints': 201, Resolved: 188, Pending: 10, Closed: 3 },
    { id: 5, Month: 'May 2026', 'Total Complaints': 177, Resolved: 165, Pending: 9, Closed: 3 },
    { id: 6, Month: 'Jun 2026', 'Total Complaints': 193, Resolved: 181, Pending: 9, Closed: 3 },
    { id: 7, Month: 'Jul 2026', 'Total Complaints': 210, Resolved: 197, Pending: 11, Closed: 2 },
    { id: 8, Month: 'Aug 2026', 'Total Complaints': 224, Resolved: 210, Pending: 12, Closed: 2 },
  ];

  // --- Handlers ---
  const handleOpenDetail = (report) => {
    setSelectedReport(report);
    setView('detail');
  };

  const moveColumn = (index, direction) => {
    if (direction === 'left' && index > 0) {
      const newCols = [...columns];
      [newCols[index - 1], newCols[index]] = [newCols[index], newCols[index - 1]];
      setColumns(newCols);
    } else if (direction === 'right' && index < columns.length - 1) {
      const newCols = [...columns];
      [newCols[index + 1], newCols[index]] = [newCols[index], newCols[index + 1]];
      setColumns(newCols);
    }
  };

  // ================= VIEW 1: LIST VIEW =================
  if (view === 'list') {
    return (
      <div style={{ paddingBottom: '40px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Generate deployed reports. Filter by date range, sort columns, and export.</p>
        </div>

        <div className="search-box" style={{ width: '350px', marginBottom: '24px', background: 'white' }}>
          <Search size={16} color="#9ca3af" />
          <input type="text" placeholder="Search reports..." />
        </div>

        <div className="reports-grid">
          {reportsList.map((report) => (
            <div key={report.id} className="report-card" onClick={() => handleOpenDetail(report)}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', fontWeight: 500 }}>{report.id}</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{report.title}</div>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>{report.meta}</div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {report.tags.map(tag => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ================= VIEW 2: DETAIL VIEW =================
  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px', cursor: 'pointer', marginBottom: '16px' }} onClick={() => setView('list')}>
          <ChevronLeft size={16} /> All Reports
        </div>
        <h1 className="page-title">{selectedReport?.title}</h1>
        <p className="page-subtitle">{selectedReport?.id} · Deployed by Admin on 2026-09-01</p>
      </div>

      {/* Filters Row */}
      <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '20px' }}>
        
        {/* DATE FROM */}
        <div style={{ flex: 1 }}>
          <label className="input-label">DATE FROM</label>
          <div className="date-input-wrapper">
            <input type="date" defaultValue="2026-01-01" />
            <Calendar size={16} color="#6b7280" className="date-icon" />
          </div>
        </div>

        {/* DATE TO */}
        <div style={{ flex: 1 }}>
          <label className="input-label">DATE TO</label>
          <div className="date-input-wrapper">
            <input type="date" defaultValue="2026-09-17" />
            <Calendar size={16} color="#6b7280" className="date-icon" />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <label className="input-label">SORT BY</label>
          <select><option>Month</option></select>
        </div>
        
        <div style={{ width: '200px' }}>
          <label className="input-label">DIRECTION</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn-toggle ${sortDirection === 'asc' ? 'active' : ''}`} 
              style={{ padding: '8px', flex: 1 }}
              onClick={() => setSortDirection('asc')}
            >
              A → Z
            </button>
            <button 
              className={`btn-toggle ${sortDirection === 'desc' ? 'active' : ''}`} 
              style={{ padding: '8px', flex: 1, background: sortDirection === 'desc' ? 'var(--primary-red)' : '#f3f4f6' }}
              onClick={() => setSortDirection('desc')}
            >
              Z → A
            </button>
          </div>
        </div>
        <div style={{ flex: 1.5 }}>
          <label className="input-label">FILTER ROWS</label>
          <input type="text" placeholder="Filter..." />
        </div>
      </div>

      {/* Column Order */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="section-label" style={{ marginBottom: '16px' }}>COLUMN ORDER — CLICK ARROWS TO REORDER</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {columns.map((col, index) => (
            <div key={col} className="column-chip">
              <span style={{ color: '#9ca3af', marginRight: '6px' }}>{index + 1}</span>
              <span>{col}</span>
              <div style={{ display: 'flex', marginLeft: '8px' }}>
                <button className="arrow-btn" onClick={() => moveColumn(index, 'left')} disabled={index === 0}><ChevronLeft size={14} /></button>
                <button className="arrow-btn" onClick={() => moveColumn(index, 'right')} disabled={index === columns.length - 1}><ChevronRight size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#f9fafb', borderBottom: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.5px' }}>PREVIEW — 8 ROWS</span>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col} style={{ textAlign: 'left', padding: '16px 20px', fontSize: '12px', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid var(--border-color)' }}>
                    {col.toUpperCase()} {col === 'Month' && <span style={{ color: 'var(--primary-red)' }}>↑</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {columns.map(col => (
                    <td key={col} style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--text-main)' }}>
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        <button className="btn-outline">Save Filters</button>
        <button className="btn-primary" style={{ padding: '10px 24px' }}>Generate Report</button>
      </div>
    </div>
  );
}