import { useState } from 'react';
import { Search, Users, X } from 'lucide-react';
import './CaseQueue.css'

export default function CaseQueue() {
  // --- States ---
  const [activeTab, setActiveTab] = useState('All CMU'); // 'All CMU' | 'My Team'
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Open' | 'Assigned' | ...
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer State
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState('');

  // --- Mock Data ---
  const teamMembers = ['Sana Mirza', 'Ahmed Raza', 'Fatima Noor', 'Bilal Shaikh'];
  
  const mockCases = [
    { id: 'CMP-2024-001847', customer: 'Muhammad Ali Khan', type: 'ATM Transaction Failed', status: 'Assigned', lodged: '2024-11-20', aging: '3d', internal: 'Minor', officer: 'Sana Mirza', isMyTeam: true, cnic: '42101-1234567-8', channel: 'ATM', mode: 'Digital' },
    { id: 'CMP-2024-001831', customer: 'Fatima Noor Ahmed', type: 'Unauthorized Deduction', status: 'Pending Review', lodged: '2024-11-18', aging: '5d', internal: 'Major', officer: 'Ahmed Raza', isMyTeam: true, cnic: '42101-9876543-2', channel: 'Mobile App', mode: 'Digital' },
    { id: 'CMP-2024-001799', customer: 'Bilal Shaikh', type: 'Cheque Book Not Received', status: 'Open', lodged: '2024-11-17', aging: '6d', internal: 'Minor', officer: 'Unassigned', isMyTeam: true, cnic: '61101-5678901-4', channel: 'Website', mode: 'Email' },
    { id: 'CMP-2024-001756', customer: 'Ayesha Tariq', type: 'Online Transfer Delay', status: 'Resolved', lodged: '2024-11-10', aging: '13d', internal: 'Minor', officer: 'Bilal Shaikh', isMyTeam: false, cnic: '42101-1111222-3', channel: 'Branch', mode: 'In Person' },
    { id: 'CMP-2024-001720', customer: 'Usman Malik', type: 'Fraud — Unauthorized Account Access', status: 'In Progress', lodged: '2024-11-08', aging: '15d', internal: 'Fraud', officer: 'Fatima Noor', isMyTeam: true, cnic: '42101-3333444-5', channel: 'Call Center', mode: 'Phone' },
  ];

  // --- Filtering Logic ---
  const filteredCases = mockCases.filter(c => {
    // 1. Tab Filter
    if (activeTab === 'My Team' && !c.isMyTeam) return false;
    
    // 2. Status Filter
    if (activeFilter !== 'All' && c.status !== activeFilter) return false;
    
    // 3. Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(query);
      const matchCustomer = c.customer.toLowerCase().includes(query);
      const matchType = c.type.toLowerCase().includes(query);
      if (!matchId && !matchCustomer && !matchType) return false;
    }
    
    return true;
  });

  // --- Helper for Status Badges ---
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Assigned': return 'badge-purple';
      case 'Pending Review': return 'badge-orange';
      case 'Open': return 'badge-blue';
      case 'Resolved': return 'badge-green';
      case 'In Progress': return 'badge-yellow';
      default: return 'badge-gray';
    }
  };

  // --- Handlers ---
  const handleAssignOfficer = () => {
    if (!selectedOfficer) return;
    // In a real app, API call would happen here
    alert(`Officer "${selectedOfficer}" assigned to case ${selectedCase.id}`);
    setSelectedCase(null);
    setSelectedOfficer('');
  };

  return (
    <div style={{ paddingBottom: '40px', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Case Queue</h1>
        <p className="page-subtitle">
          {activeTab === 'All CMU' 
            ? 'All complaints across CMU. Switch to My Team to assign or reassign officers.' 
            : "Showing your team's complaints. Assign or reassign officers from here."}
        </p>
      </div>

      {/* Filters & Tabs Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        
        {/* Tab Toggle */}
        <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '6px', padding: '4px' }}>
          <button 
            className={`cq-tab ${activeTab === 'All CMU' ? 'active' : ''}`}
            onClick={() => setActiveTab('All CMU')}
          >
            All CMU
          </button>
          <button 
            className={`cq-tab ${activeTab === 'My Team' ? 'active' : ''}`}
            onClick={() => setActiveTab('My Team')}
          >
            My Team <span className="badge-count">3</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-box" style={{ flex: 1, maxWidth: '350px', background: 'white', marginBottom: 0 }}>
          <Search size={16} color="#9ca3af" />
          <input 
            type="text" 
            placeholder="Search by case ID, customer, type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginLeft: 'auto' }}>
          {['All', 'Open', 'Assigned', 'In Progress', 'Pending Review', 'Resolved'].map(status => (
            <button 
              key={status}
              className={`cq-filter-btn ${activeFilter === status ? 'active' : ''}`}
              onClick={() => setActiveFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
          {filteredCases.length} cases
        </div>
      </div>

      {/* Team Banner (Only shows on My Team tab) */}
      {activeTab === 'My Team' && (
        <div className="team-banner">
          <Users size={16} color="var(--primary-red)" />
          <span>Your team: <strong>{teamMembers.join(', ')}</strong></span>
        </div>
      )}

      {/* Data Table */}
      <div className="cq-table-container">
        <div className="cq-table-header">
          <div style={{ width: '150px' }}>CASE ID</div>
          <div style={{ flex: 1 }}>CUSTOMER / TYPE</div>
          <div style={{ width: '150px' }}>STATUS</div>
          <div style={{ width: '120px' }}>LODGED</div>
          <div style={{ width: '80px' }}>AGING</div>
          <div style={{ width: '100px' }}>INTERNAL</div>
          <div style={{ width: '140px' }}>OFFICER</div>
        </div>

        {filteredCases.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No cases found matching your filters.</div>
        ) : (
          filteredCases.map((c) => (
            <div key={c.id} className="cq-table-row" onClick={() => setSelectedCase(c)}>
              <div style={{ width: '150px', color: 'var(--primary-red)', fontSize: '13px', fontWeight: 500 }}>{c.id}</div>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{c.customer}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{c.type}</div>
              </div>

              <div style={{ width: '150px' }}>
                <span className={`cq-badge ${getStatusBadgeClass(c.status)}`}>
                  {c.status}
                </span>
              </div>

              <div style={{ width: '120px', fontSize: '13px', color: '#6b7280' }}>{c.lodged}</div>
              
              <div style={{ width: '80px', fontSize: '13px', fontWeight: 600, color: parseInt(c.aging) > 10 ? 'var(--primary-red)' : '#6b7280' }}>{c.aging}</div>
              
              <div style={{ width: '100px' }}>
                <span className={`cq-internal-badge ${
                  c.internal === 'Fraud' ? 'fraud' : c.internal === 'Major' ? 'major' : 'minor'
                }`}>
                  {c.internal}
                </span>
              </div>

              <div style={{ width: '140px', fontSize: '13px', color: c.officer === 'Unassigned' ? 'var(--primary-red)' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {c.officer !== 'Unassigned' && <span className="dot dot-green"></span>}
                {c.officer === 'Unassigned' ? '— Unassigned' : c.officer}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= SIDE DRAWER (MODAL) ================= */}
      {selectedCase && (
        <>
          {/* Overlay */}
          <div className="drawer-overlay" onClick={() => setSelectedCase(null)}></div>
          
          {/* Drawer Content */}
          <div className="side-drawer">
            <div className="drawer-header">
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>{selectedCase.id}</h2>
              <button className="drawer-close-btn" onClick={() => setSelectedCase(null)}><X size={20} /></button>
            </div>

            <div className="drawer-body">
              {/* Info Grid */}
              <div className="drawer-info-card">
                <div className="info-grid">
                  <div>
                    <div className="info-label">Customer</div>
                    <div className="info-value">{selectedCase.customer}</div>
                  </div>
                  <div>
                    <div className="info-label">CNIC</div>
                    <div className="info-value" style={{ color: 'var(--primary-red)' }}>{selectedCase.cnic}</div>
                  </div>
                  <div>
                    <div className="info-label">Type</div>
                    <div className="info-value">{selectedCase.type}</div>
                  </div>
                  <div>
                    <div className="info-label">Status</div>
                    <div className="info-value">
                      <span className={`cq-badge ${getStatusBadgeClass(selectedCase.status)}`}>{selectedCase.status}</span>
                    </div>
                  </div>
                  <div>
                    <div className="info-label">Channel</div>
                    <div className="info-value">{selectedCase.channel}</div>
                  </div>
                  <div>
                    <div className="info-label">Mode</div>
                    <div className="info-value">{selectedCase.mode}</div>
                  </div>
                  <div>
                    <div className="info-label">Lodged</div>
                    <div className="info-value">{selectedCase.lodged}</div>
                  </div>
                  <div>
                    <div className="info-label">Aging</div>
                    <div className="info-value" style={{ color: parseInt(selectedCase.aging) > 10 ? 'var(--primary-red)' : '#6b7280', fontWeight: 600 }}>{selectedCase.aging}</div>
                  </div>
                </div>
              </div>

              {/* Assign Officer Section */}
              <div style={{ marginTop: '24px' }}>
                <label className="info-label" style={{ marginBottom: '8px', fontWeight: 600 }}>ASSIGN OFFICER</label>
                <select 
                  className="drawer-select"
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                >
                  <option value="">Select officer...</option>
                  {teamMembers.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, padding: '12px', backgroundColor: selectedOfficer ? 'var(--primary-red)' : '#fca5a5' }}
                  onClick={handleAssignOfficer}
                  disabled={!selectedOfficer}
                >
                  Assign Officer
                </button>
                <button 
                  className="btn-outline" 
                  style={{ flex: 1, padding: '12px' }}
                  onClick={() => setSelectedCase(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}