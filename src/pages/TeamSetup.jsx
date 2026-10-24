import { useState } from 'react';
import { Search, Plus, X, ChevronDown } from 'lucide-react';
import './TeamSetup.css'

export default function TeamSetup() {
  const [activeTab, setActiveTab] = useState('Teams');
  const [selectedTeam, setSelectedTeam] = useState('Branch Banking');
  const [selectedStakeholder, setSelectedStakeholder] = useState('Digital Operations');
  const [configFor, setConfigFor] = useState('Stakeholder');

  // --- Tab 1 Data (Teams) ---
  const teamsList = ['Branch Banking', 'Consumer Finance', 'Critical', 'Digital (Alfa)', 'Email'];
  const complaintCategories = ['Account Operations', 'Card Services', 'Digital Banking', 'Remittance', 'Loan / Financing', 'ATM / CDM', 'Staff Misconduct', 'Others'];

  // --- Tab 2 Data (Stakeholders) ---
  const stakeholdersList = [
    { name: 'Digital Operations', members: 2 },
    { name: 'Branch Resolution', members: 3 },
    { name: 'Card Services', members: 1 },
  ];

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Team Setup</h1>
        <p className="page-subtitle">Configure teams, stakeholder groups and escalation rules.</p>
      </div>

      {/* Main Large Tabs */}
      <div className="large-tabs-container">
        {['Teams', 'Stakeholders', 'Escalation'].map((tab) => (
          <button
            key={tab}
            className={`large-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: TEAMS ================= */}
      {activeTab === 'Teams' && (
        <div className="team-layout">
          {/* Left Sidebar List */}
          <div className="team-list-container">
            <div className="search-box">
              <Search size={16} color="#9ca3af" />
              <input type="text" placeholder="Search teams..." />
            </div>
            <div className="team-list">
              {teamsList.map((team) => (
                <div
                  key={team}
                  className={`team-list-item ${selectedTeam === team ? 'active' : ''}`}
                  onClick={() => setSelectedTeam(team)}
                >
                  <span className={`dot ${selectedTeam === team ? 'red' : 'gray'}`}></span>
                  {team}
                </div>
              ))}
            </div>
            <div className="add-list-btn">
              <Plus size={16} /> Add Team
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>{selectedTeam}</h3>
              
              <div style={{ marginBottom: '24px' }}>
                <div className="section-label">TEAM LEAD (AD SOURCE)</div>
                <div className="avatar-pill">
                  <div className="avatar-circle red">S</div> Sana Mirza
                </div>
              </div>

              <div>
                <div className="section-label">OFFICERS POOL (AD SOURCE)</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div className="avatar-pill"><div className="avatar-circle gray">A</div> Ahmed Raza</div>
                  <div className="avatar-pill"><div className="avatar-circle gray">B</div> Bilal Shaikh</div>
                  <div className="avatar-pill dashed"><Plus size={14} /> Add</div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="section-label">LINKED COMPLAINT CATEGORIES</div>
              <div className="checkbox-grid">
                {complaintCategories.map((cat, i) => (
                  <label key={cat} className="checkbox-item">
                    <input type="checkbox" defaultChecked={i === 0} /> {cat}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: STAKEHOLDERS ================= */}
      {activeTab === 'Stakeholders' && (
        <div className="team-layout">
          {/* Left Sidebar List */}
          <div className="team-list-container">
            <div className="team-list">
              {stakeholdersList.map((st) => (
                <div
                  key={st.name}
                  className={`team-list-item ${selectedStakeholder === st.name ? 'active' : ''}`}
                  onClick={() => setSelectedStakeholder(st.name)}
                  style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px', padding: '16px' }}
                >
                  <div style={{ fontWeight: 500, color: selectedStakeholder === st.name ? 'var(--primary-red)' : 'var(--text-main)' }}>{st.name}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{st.members} members</div>
                </div>
              ))}
            </div>
            <div className="add-list-btn">
              <Plus size={16} /> Add Group
            </div>
          </div>

          {/* Right Content Area */}
          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>{selectedStakeholder}</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div className="section-label">MEMBERS</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="avatar-pill"><div className="avatar-circle gray">A</div> Ali Hassan</div>
                <div className="avatar-pill"><div className="avatar-circle gray">S</div> Sara Khan</div>
                <div className="avatar-pill dashed"><Plus size={14} /> Add</div>
              </div>
            </div>

            <div>
              <div className="section-label">LINKED COMPLAINT CATEGORIES</div>
              <div className="checkbox-grid">
                {complaintCategories.map((cat, i) => (
                  <label key={cat} className="checkbox-item">
                    <input type="checkbox" defaultChecked={i === 2 || i === 5} /> {cat}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ESCALATION ================= */}
      {activeTab === 'Escalation' && (
        <div>
          {/* Top Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Configure for:</span>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className={`btn-toggle ${configFor === 'Stakeholder' ? 'active' : ''}`}
                style={{ padding: '6px 16px', flex: 'none', borderRadius: '4px' }}
                onClick={() => setConfigFor('Stakeholder')}
              >
                Stakeholder
              </button>
              <button 
                className={`btn-toggle ${configFor === 'CMU Team' ? 'active' : ''}`}
                style={{ padding: '6px 16px', flex: 'none', borderRadius: '4px', background: 'transparent', color: 'var(--text-main)' }}
                onClick={() => setConfigFor('CMU Team')}
              >
                CMU Team
              </button>
            </div>

            <select style={{ width: '250px' }}>
              <option>Digital Operations</option>
            </select>
            
            <span style={{ fontSize: '12px', color: '#2563eb', background: '#eff6ff', padding: '4px 8px', borderRadius: '4px' }}>
              Per-stakeholder configuration
            </span>
          </div>

          {/* Escalation Table */}
          <div className="table-container">
            <div className="table-header-row" style={{ gridTemplateColumns: '80px 150px 1fr 1fr' }}>
              <div>LEVEL</div>
              <div>TAT BREACH</div>
              <div>ALERT TO (AD)</div>
              <div>ALERT CC (AD)</div>
            </div>
            
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
              <div key={level} className="table-row" style={{ gridTemplateColumns: '80px 150px 1fr 1fr' }}>
                <div style={{ color: 'var(--primary-red)', fontWeight: 600 }}>L{level}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" defaultValue="0" style={{ width: '60px', textAlign: 'center' }} />
                  <select style={{ width: '70px' }}><option>hrs</option></select>
                </div>
                <div><input type="text" placeholder="AD user or group..." /></div>
                <div><input type="text" placeholder="AD user or group..." /></div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button className="btn-toggle" style={{ padding: '10px 24px', flex: 'none' }}>Reset</button>
            <button className="btn-primary" style={{ padding: '10px 24px' }}>Save Escalation Rules</button>
          </div>
        </div>
      )}
    </div>
  );
}