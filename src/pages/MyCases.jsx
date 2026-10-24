import { useState } from 'react';
import { Search, X, Send, MessageSquare, Phone, Mail, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import './MyCases.css'

export default function MyCases() {
  // --- Main Page States ---
  const [activeTab, setActiveTab] = useState('Open Cases'); // 'Open Cases' | 'Pending Review'
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- Drawer States ---
  const [selectedCase, setSelectedCase] = useState(null);
  const [drawerTab, setDrawerTab] = useState('Details'); // 'Details', 'Responses', 'RCA', 'Audit Trail'

  // --- RCA Form States (for the Drawer) ---
  const [rcaFaulter, setRcaFaulter] = useState('Bank'); // 'Customer' | 'Bank'
  const [rcaFinancialReversal, setRcaFinancialReversal] = useState(null); // null | 'Yes' | 'No'
  const [rcaStaffAtFault, setRcaStaffAtFault] = useState(null); // null | 'Yes' | 'No'

  // --- Mock Data ---
  const mockCases = [
    { 
      id: 'CMP-2024-001847', customer: 'Muhammad Ali Khan', type: 'ATM Transaction Failed', status: 'Assigned', lodged: '2024-11-20', aging: '3d', 
      details: { cnic: '42101-1234567-8', product: 'ATM', category: 'Digital Banking', mode: 'Phone', channel: 'Phone Banking', internal: 'Minor' },
      routing: [{ name: 'Digital (Alfa)', tat: '48 hrs', assigned: '2024-11-20', status: 'Awaiting' }],
      responses: [],
      audit: [
        { type: 'lodged', title: 'Complaint Lodged', date: '2024-11-20 · 09:10', desc: 'Complaint lodged and assigned reference number. Status set to Open.' },
        { type: 'sms', title: 'SMS', badges: ['ACK', 'SMS', 'Delivered'], date: '2024-11-20 · 09:12', desc: 'Dear Muhammad Ali Khan, your complaint (Ref: CMP-2024-001847)...' },
        { type: 'email', title: 'Email', badges: ['ACK', 'Email', 'Delivered'], date: '2024-11-20 · 09:13', desc: 'Dear Muhammad Ali Khan, your complaint (Ref: CMP-2024-001847)...' },
        { type: 'letter', title: 'Letter', badges: ['ACK', 'Letter', 'Delivered'], date: '2024-11-20 · 09:20', desc: 'Dear Muhammad Ali Khan, your complaint (Ref: CMP-2024-001847)...' },
        { type: 'status', title: 'Status Changed', date: '2024-11-21 · 10:30', from: 'Open', to: 'Assigned', by: 'System' },
        { type: 'comment', title: 'Comment', author: 'Sana Mirza (Officer)', date: '2024-11-21 · 10:32', desc: 'Case received. Initial review in progress — contacting the relevant department for supporting transaction records.' },
        { type: 'status', title: 'Status Changed', date: '2024-11-22 · 11:05', from: 'Assigned', to: 'In Progress', by: 'Sana Mirza' },
        { type: 'route', title: 'Complaint Routed', date: '2024-11-23 · 09:45', desc: 'Routed to Digital (Alfa) · TAT: 48 hrs · by Sana Mirza' }
      ]
    },
    { 
      id: 'CMP-2024-001831', customer: 'Fatima Noor Ahmed', type: 'Unauthorized Deduction', status: 'Pending Review', lodged: '2024-11-18', aging: '5d', 
      details: { cnic: '35202-9876543-2', product: 'Credit Card', category: 'Consumer Finance', mode: 'Walk-in', channel: 'Branch', internal: 'Major' },
      routing: [{ name: 'Consumer Finance', tat: '72 hrs', assigned: '2024-11-21', status: 'Awaiting' }],
      responses: [
        { dept: 'Consumer Finance', date: '2024-11-21', text: 'Transaction reviewed. Fee was incorrectly applied. Reversal recommended.' },
        { dept: 'Branch Banking', date: '2024-11-21', text: 'Branch confirms transaction was not authorized by customer.' }
      ],
      audit: [
        { type: 'lodged', title: 'Complaint Lodged', date: '2024-11-18 · 09:10', desc: 'Complaint lodged and assigned reference number. Status set to Open.' },
        { type: 'sms', title: 'SMS', badges: ['ACK', 'SMS', 'Delivered'], date: '2024-11-18 · 09:12', desc: 'Dear Fatima Noor Ahmed, your complaint (Ref: CMP-2024-001831)...' },
        { type: 'email', title: 'Email', badges: ['ACK', 'Email', 'Delivered'], date: '2024-11-18 · 09:13', desc: 'Dear Fatima Noor Ahmed, your complaint (Ref: CMP-2024-001831)...' },
        { type: 'letter', title: 'Letter', badges: ['ACK', 'Letter', 'Delivered'], date: '2024-11-18 · 09:20', desc: 'Dear Fatima Noor Ahmed, your complaint (Ref: CMP-2024-001831)...' },
        { type: 'status', title: 'Status Changed', date: '2024-11-19 · 10:30', from: 'Open', to: 'Assigned', by: 'System' },
        { type: 'comment', title: 'Comment', author: 'Ahmed Raza (Officer)', date: '2024-11-19 · 10:32', desc: 'Case received. Initial review in progress — contacting the relevant department for supporting transaction records.' },
        { type: 'status', title: 'Status Changed', date: '2024-11-20 · 11:05', from: 'Assigned', to: 'In Progress', by: 'Ahmed Raza' },
        { type: 'route', title: 'Complaint Routed', date: '2024-11-21 · 09:45', desc: 'Routed to Consumer Finance · TAT: 72 hrs · by Ahmed Raza' },
        { type: 'comment', title: 'Comment', author: 'Consumer Finance (Stakeholder)', date: '2024-11-23 · 10:05', desc: 'Transaction reviewed. Fee was incorrectly applied. Reversal recommended.' },
        { type: 'status', title: 'Status Changed', date: '2024-11-23 · 10:06', from: 'In Progress', to: 'Pending Review', by: 'System' }
      ]
    },
    { 
      id: 'CMP-2024-001720', customer: 'Usman Malik', type: 'Fraud — Unauthorized Account Access', status: 'In Progress', lodged: '2024-11-08', aging: '15d', 
      details: { cnic: '42101-3333444-5', product: 'Account', category: 'Digital Banking', mode: 'Web', channel: 'Internet Banking', internal: 'Fraud' },
      routing: [{ name: 'Digital (Alfa)', tat: '24 hrs', assigned: '2024-11-08', status: 'Awaiting' }],
      responses: [],
      audit: []
    },
  ];

  // Filtering Logic
  const filteredCases = mockCases.filter(c => {
    if (activeTab === 'Open Cases' && (c.status === 'Pending Review' || c.status === 'Resolved')) return false;
    if (activeTab === 'Pending Review' && c.status !== 'Pending Review') return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.id.toLowerCase().includes(q) || c.customer.toLowerCase().includes(q) || c.type.toLowerCase().includes(q);
    }
    return true;
  });

  const openDrawer = (c) => {
    setSelectedCase(c);
    setDrawerTab('Details'); // Reset to first tab
    setRcaFaulter('Bank'); // Reset RCA form
    setRcaFinancialReversal(null);
    setRcaStaffAtFault(null);
  };

  const getBadgeClass = (status) => {
    switch(status) {
      case 'Assigned': return 'badge-purple';
      case 'Pending Review': return 'badge-orange';
      case 'Open': return 'badge-blue';
      case 'Resolved': return 'badge-green';
      case 'In Progress': return 'badge-yellow';
      default: return 'badge-gray';
    }
  };

  return (
    <div style={{ paddingBottom: '40px', position: 'relative' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">My Cases</h1>
        <p className="page-subtitle">Cases assigned to you. Route to stakeholders or close with RCA.</p>
      </div>

      {/* Tabs & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '6px', padding: '4px' }}>
          <button 
            className={`mc-tab ${activeTab === 'Open Cases' ? 'active' : ''}`}
            onClick={() => setActiveTab('Open Cases')}
          >
            Open Cases <span className="badge-count">2</span>
          </button>
          <button 
            className={`mc-tab ${activeTab === 'Pending Review' ? 'active' : ''}`}
            onClick={() => setActiveTab('Pending Review')}
          >
            Pending Review <span className="badge-count">1</span>
          </button>
        </div>

        <div className="search-box" style={{ width: '350px', background: 'white', marginBottom: 0 }}>
          <Search size={16} color="#9ca3af" />
          <input 
            type="text" 
            placeholder="Search cases..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="cq-table-container">
        <div className="cq-table-header">
          <div style={{ width: '150px' }}>CASE ID</div>
          <div style={{ flex: 1 }}>CUSTOMER / TYPE</div>
          <div style={{ width: '150px' }}>STATUS</div>
          <div style={{ width: '120px' }}>LODGED</div>
          <div style={{ width: '80px' }}>AGING</div>
          <div style={{ width: '200px' }}>{activeTab === 'Open Cases' ? 'ROUTING' : 'RESPONSES'}</div>
        </div>

        {filteredCases.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No cases found.</div>
        ) : (
          filteredCases.map((c) => (
            <div key={c.id} className="cq-table-row" onClick={() => openDrawer(c)}>
              <div style={{ width: '150px', color: 'var(--primary-red)', fontSize: '13px', fontWeight: 500 }}>{c.id}</div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{c.customer}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{c.type}</div>
              </div>

              <div style={{ width: '150px' }}>
                <span className={`cq-badge ${getBadgeClass(c.status)}`}>{c.status}</span>
              </div>

              <div style={{ width: '120px', fontSize: '13px', color: '#6b7280' }}>{c.lodged}</div>
              
              <div style={{ width: '80px', fontSize: '13px', fontWeight: 600, color: parseInt(c.aging) > 10 ? 'var(--primary-red)' : '#6b7280' }}>{c.aging}</div>
              
              <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activeTab === 'Open Cases' ? (
                  c.routing.map((r, i) => (
                    <span key={i} className="badge-blue" style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}>
                      <span className="dot dot-blue"></span> {r.status}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: '#15803d', fontWeight: 500 }}>
                    {c.responses.length} / {c.responses.length} replied
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= SIDE DRAWER ================= */}
      {selectedCase && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedCase(null)}></div>
          
          <div className="side-drawer" style={{ width: '600px' }}>
            
            {/* Drawer Header */}
            <div className="drawer-header">
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>{selectedCase.id}</h2>
              <button className="drawer-close-btn" onClick={() => setSelectedCase(null)}><X size={20} /></button>
            </div>

            {/* Drawer Top Bar (Customer Info & Forced Intimation) */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                {selectedCase.customer} · {selectedCase.type}
              </div>
              <button className="btn-outline" style={{ borderColor: '#fca5a5', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}>
                <Send size={14} /> Send Forced Intimation
              </button>
            </div>

            {/* Drawer Inner Tabs */}
            <div style={{ padding: '0 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '24px' }}>
              {['Details', 'Responses', 'RCA', 'Audit Trail'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setDrawerTab(tab)}
                  style={{
                    background: 'none', border: 'none', padding: '12px 0', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                    color: drawerTab === tab ? 'var(--primary-red)' : '#6b7280',
                    borderBottom: drawerTab === tab ? '2px solid var(--primary-red)' : '2px solid transparent'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Drawer Body */}
            <div className="drawer-body" style={{ padding: '24px' }}>
              
              {/* --- TAB: DETAILS --- */}
              {drawerTab === 'Details' && (
                <div className="drawer-info-card">
                  <div className="info-grid">
                    <div><div className="info-label">Customer</div><div className="info-value">{selectedCase.customer}</div></div>
                    <div><div className="info-label">CNIC</div><div className="info-value" style={{ color: 'var(--primary-red)' }}>{selectedCase.details.cnic}</div></div>
                    <div><div className="info-label">Complaint Type</div><div className="info-value">{selectedCase.type}</div></div>
                    <div><div className="info-label">Status</div><div className="info-value"><span className={`cq-badge ${getBadgeClass(selectedCase.status)}`}>{selectedCase.status}</span></div></div>
                    <div><div className="info-label">Product</div><div className="info-value">{selectedCase.details.product}</div></div>
                    <div><div className="info-label">Category</div><div className="info-value">{selectedCase.details.category}</div></div>
                    <div><div className="info-label">Mode</div><div className="info-value">{selectedCase.details.mode}</div></div>
                    <div><div className="info-label">Channel</div><div className="info-value">{selectedCase.details.channel}</div></div>
                    <div><div className="info-label">Lodged</div><div className="info-value">{selectedCase.lodged}</div></div>
                    <div><div className="info-label">Aging</div><div className="info-value" style={{ color: parseInt(selectedCase.aging) > 10 ? 'var(--primary-red)' : '#6b7280', fontWeight: 600 }}>{selectedCase.aging}</div></div>
                    <div><div className="info-label">Internal Type</div><div className="info-value">{selectedCase.details.internal}</div></div>
                  </div>
                </div>
              )}

              {/* --- TAB: RESPONSES --- */}
              {drawerTab === 'Responses' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {selectedCase.responses.length === 0 ? (
                      <div style={{ color: '#9ca3af', fontSize: '13px' }}>No responses yet.</div>
                    ) : (
                      selectedCase.responses.map((r, i) => (
                        <div key={i} style={{ background: '#f9fafb', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary-red)' }}>{r.dept}</span>
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{r.date}</span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>{r.text}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <div className="info-label" style={{ marginBottom: '12px' }}>YOUR ACTION</div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn-outline" style={{ fontSize: '13px' }}>Forward to Next Stakeholder</button>
                      <button className="btn-outline" style={{ fontSize: '13px' }}>Reassign to Previous (Unsatisfactory)</button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB: RCA --- */}
              {drawerTab === 'RCA' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Faulter Toggle */}
                  <div>
                    <label className="info-label">Faulter <span style={{ color: 'var(--primary-red)' }}>*</span></label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button 
                        className={`rca-toggle-btn ${rcaFaulter === 'Customer' ? 'active-customer' : ''}`}
                        onClick={() => setRcaFaulter('Customer')}
                      >Customer</button>
                      <button 
                        className={`rca-toggle-btn ${rcaFaulter === 'Bank' ? 'active-bank' : ''}`}
                        onClick={() => setRcaFaulter('Bank')}
                      >Bank</button>
                    </div>
                  </div>

                  {/* Bank Workgroup (Locked if Faulter is Customer) */}
                  <div style={{ background: rcaFaulter === 'Bank' ? '#f9fafb' : 'transparent', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '6px', opacity: rcaFaulter === 'Bank' ? 1 : 0.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="info-label" style={{ margin: 0 }}>BANK WORKGROUP</span>
                      {rcaFaulter !== 'Bank' && <span className="badge-gray" style={{ fontSize: '10px' }}>Locked</span>}
                    </div>
                    <div className="grid-3-col">
                      <div><label className="info-label">Faulter Group</label><select disabled={rcaFaulter !== 'Bank'}><option>Select...</option></select></div>
                      <div><label className="info-label">Workgroup</label><select disabled={rcaFaulter !== 'Bank'}><option>Select...</option></select></div>
                      <div><label className="info-label">Sub-Workgroup</label><select disabled={rcaFaulter !== 'Bank'}><option>Select...</option></select></div>
                    </div>
                  </div>

                  {/* Root Cause */}
                  <div>
                    <label className="info-label">Root Cause <span style={{ color: 'var(--primary-red)' }}>*</span></label>
                    <select><option>Select root cause...</option></select>
                  </div>

                  {/* Financial Reversal */}
                  <div>
                    <label className="info-label">Financial Reversal</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button className={`rca-toggle-btn-small ${rcaFinancialReversal === 'Yes' ? 'active' : ''}`} onClick={() => setRcaFinancialReversal('Yes')}>Yes</button>
                      <button className={`rca-toggle-btn-small ${rcaFinancialReversal === 'No' ? 'active' : ''}`} onClick={() => setRcaFinancialReversal('No')}>No</button>
                    </div>
                  </div>

                  {/* Financial Details (Locked if Reversal is not Yes) */}
                  <div style={{ background: rcaFinancialReversal === 'Yes' ? '#f9fafb' : 'transparent', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '6px', opacity: rcaFinancialReversal === 'Yes' ? 1 : 0.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="info-label" style={{ margin: 0 }}>FINANCIAL DETAILS</span>
                      {rcaFinancialReversal !== 'Yes' && <span className="badge-gray" style={{ fontSize: '10px' }}>Locked</span>}
                    </div>
                    <div className="grid-2-col">
                      <div><label className="info-label">Reversal Type</label><select disabled={rcaFinancialReversal !== 'Yes'}><option>Select...</option></select></div>
                      <div><label className="info-label">Amount (PKR)</label><input type="text" placeholder="0.00" disabled={rcaFinancialReversal !== 'Yes'} /></div>
                    </div>
                  </div>

                  {/* Staff at Fault */}
                  <div>
                    <label className="info-label">Staff at Fault</label>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button className={`rca-toggle-btn-small ${rcaStaffAtFault === 'Yes' ? 'active' : ''}`} onClick={() => setRcaStaffAtFault('Yes')}>Yes</button>
                      <button className={`rca-toggle-btn-small ${rcaStaffAtFault === 'No' ? 'active' : ''}`} onClick={() => setRcaStaffAtFault('No')}>No</button>
                    </div>
                  </div>

                  {/* Closure Details */}
                  <div className="grid-2-col" style={{ marginTop: '12px' }}>
                    <div>
                      <label className="info-label">SBP Disposal Status <span style={{ color: 'var(--primary-red)' }}>*</span></label>
                      <select><option>Select...</option></select>
                    </div>
                    <div>
                      <label className="info-label">Closure Communication <span style={{ color: 'var(--primary-red)' }}>*</span></label>
                      <select><option>Select...</option></select>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label className="info-label">Closure Message to Customer <span style={{ color: 'var(--primary-red)' }}>*</span></label>
                      <span style={{ fontSize: '11px', color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>Admin template</span>
                    </div>
                    <textarea rows={5} defaultValue={`Your complaint (Ref: ${selectedCase.id}) regarding ${selectedCase.details.category} Services has been resolved.\n\nResolution details: [Resolution Summary].\n\nWe value your feedback.\n\nRegards,\nCustomer Management Unit`} style={{ fontSize: '13px', background: '#f9fafb' }} />
                    <div style={{ fontSize: '12px', color: 'var(--primary-red)', marginTop: '4px' }}>Replace [Resolution Summary] with the actual resolution before closing.</div>
                  </div>

                  <button className="btn-primary" style={{ padding: '12px', marginTop: '12px' }}>Complete & Close Case</button>
                </div>
              )}

              {/* --- TAB: AUDIT TRAIL --- */}
              {drawerTab === 'Audit Trail' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Complete timeline for <strong>{selectedCase.id}</strong> · All times PKT</span>
                    <span className="badge-gray" style={{ fontSize: '12px' }}>{selectedCase.audit.length} events</span>
                  </div>

                  <div className="timeline-container">
                    {selectedCase.audit.map((event, idx) => (
                      <div key={idx} className="timeline-item">
                        {/* Timeline Icon */}
                        <div className={`timeline-icon ${event.type}`}>
                          {event.type === 'lodged' && <FileText size={14} />}
                          {event.type === 'sms' && <Phone size={14} />}
                          {event.type === 'email' && <Mail size={14} />}
                          {event.type === 'letter' && <FileText size={14} />}
                          {event.type === 'status' && <ArrowRight size={14} />}
                          {event.type === 'comment' && <MessageSquare size={14} />}
                          {event.type === 'route' && <CheckCircle size={14} />}
                        </div>

                        {/* Timeline Content */}
                        <div className="timeline-content">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{event.title}</span>
                              {event.badges && event.badges.map(b => (
                                <span key={b} className="badge-gray" style={{ fontSize: '10px' }}>{b}</span>
                              ))}
                            </div>
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>{event.date}</span>
                          </div>
                          
                          {event.desc && <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>{event.desc}</div>}
                          
                          {event.from && (
                            <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                              <span className="badge-gray" style={{ fontSize: '11px' }}>{event.from}</span>
                              <ArrowRight size={12} color="#9ca3af" />
                              <span className="badge-blue" style={{ fontSize: '11px' }}>{event.to}</span>
                              <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '4px' }}>by {event.by}</span>
                            </div>
                          )}

                          {event.author && <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>{event.author}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )}

    </div>
  );
}