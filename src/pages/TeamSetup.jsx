import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import './TeamSetup.css';

export default function TeamSetup() {
  const [activeTab, setActiveTab] = useState('Teams');
  
  // --- Teams State ---
  const [teamsList, setTeamsList] = useState([
    'Branch Banking', 'Consumer Finance', 'Critical', 'Digital (Alfa)', 'Email'
  ]);
  const [selectedTeam, setSelectedTeam] = useState('Branch Banking');
  
  // --- Team Leads State (Naya) ---
  const [teamLeads, setTeamLeads] = useState({
    'Branch Banking': 'Sana Mirza',
    'Consumer Finance': 'Ali Hassan',
    'Critical': 'Usman Malik',
    'Digital (Alfa)': 'Sara Khan',
    'Email': 'Fatima Noor'
  });

  // --- Officers Pool State ---
  const [teamOfficers, setTeamOfficers] = useState({
    'Branch Banking': ['Ahmed Raza', 'Bilal Shaikh'],
    'Consumer Finance': ['Fatima Noor'],
    'Critical': [],
    'Digital (Alfa)': [],
    'Email': []
  });

  // --- Categories State ---
  const [teamCategories, setTeamCategories] = useState({
    'Branch Banking': ['Account Operations'],
    'Consumer Finance': ['Loan / Financing'],
    'Critical': [],
    'Digital (Alfa)': ['Digital Banking'],
    'Email': []
  });

  const [stakeholderCategories, setStakeholderCategories] = useState({
    'Digital Operations': ['Digital Banking', 'ATM / CDM'],
    'Branch Resolution': [],
    'Card Services': ['Card Services']
  });
  
  // Add Officer Dropdown State
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Mock Available Officers
  const availableOfficers = ['Ahmed Raza', 'Bilal Shaikh', 'Sana Mirza', 'Fatima Noor', 'Usman Malik', 'Ayesha Tariq', 'Nadia Iqbal'];

  // Add Team Input State
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  // --- Stakeholders & Escalation State ---
  const [selectedStakeholder, setSelectedStakeholder] = useState('Digital Operations');
  const [configFor, setConfigFor] = useState('Stakeholder');
  const stakeholdersList = [
    { name: 'Digital Operations', members: 2 },
    { name: 'Branch Resolution', members: 3 },
    { name: 'Card Services', members: 1 },
  ];
  const complaintCategories = ['Account Operations', 'Card Services', 'Digital Banking', 'Remittance', 'Loan / Financing', 'ATM / CDM', 'Staff Misconduct', 'Others'];

  // --- Handlers ---
  const handleAddTeam = () => {
    if (newTeamName.trim() !== '' && !teamsList.includes(newTeamName.trim())) {
      const newTeam = newTeamName.trim();
      setTeamsList([...teamsList, newTeam]);
      setTeamOfficers({ ...teamOfficers, [newTeam]: [] });
      setTeamCategories({ ...teamCategories, [newTeam]: [] });
      setTeamLeads({ ...teamLeads, [newTeam]: 'Unassigned' }); // Naye team ke liye default lead
      setSelectedTeam(newTeam);
      setNewTeamName('');
      setIsAddingTeam(false);
    }
  };

  const handleAddOfficer = (officer) => {
    const currentTeamOfficers = teamOfficers[selectedTeam] || [];
    if (!currentTeamOfficers.includes(officer)) {
      setTeamOfficers({
        ...teamOfficers,
        [selectedTeam]: [...currentTeamOfficers, officer]
      });
    }
    setShowAddDropdown(false);
  };

  const handleRemoveOfficer = (officerToRemove) => {
    const currentTeamOfficers = teamOfficers[selectedTeam] || [];
    setTeamOfficers({
      ...teamOfficers,
      [selectedTeam]: currentTeamOfficers.filter(officer => officer !== officerToRemove)
    });
  };

  const handleToggleCategory = (teamName, category) => {
    setTeamCategories(prev => {
      const currentCats = prev[teamName] || [];
      const newCats = currentCats.includes(category)
        ? currentCats.filter(c => c !== category)
        : [...currentCats, category];
      return { ...prev, [teamName]: newCats };
    });
  };

  const handleToggleStakeholderCategory = (stakeholderName, category) => {
    setStakeholderCategories(prev => {
      const currentCats = prev[stakeholderName] || [];
      const newCats = currentCats.includes(category)
        ? currentCats.filter(c => c !== category)
        : [...currentCats, category];
      return { ...prev, [stakeholderName]: newCats };
    });
  };

  const currentTeamOfficers = teamOfficers[selectedTeam] || [];
  const currentTeamCategories = teamCategories[selectedTeam] || [];
  const currentStakeholderCategories = stakeholderCategories[selectedStakeholder] || [];
  const currentLead = teamLeads[selectedTeam];

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
                  onClick={() => { setSelectedTeam(team); setShowAddDropdown(false); }}
                >
                  <span className={`dot ${selectedTeam === team ? 'red' : 'gray'}`}></span>
                  {team}
                </div>
              ))}
            </div>

            {/* Add Team Logic */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)' }}>
              {!isAddingTeam ? (
                <div 
                  onClick={() => setIsAddingTeam(true)} 
                  style={{ color: 'var(--primary-red)', fontWeight: 500, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Plus size={16} /> Add Team
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Team name..." 
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                    autoFocus
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none', width: '100%' }}
                  />
                  <button className="btn-primary" onClick={handleAddTeam} style={{ padding: '6px 10px', fontSize: '12px' }}>Add</button>
                  <button onClick={() => { setIsAddingTeam(false); setNewTeamName(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>{selectedTeam}</h3>
              
              {/* Dynamic Team Lead */}
              <div style={{ marginBottom: '24px' }}>
                <div className="section-label">TEAM LEAD (AD SOURCE)</div>
                {currentLead && currentLead !== 'Unassigned' ? (
                  <div className="avatar-pill">
                    <div className="avatar-circle red">
                      {currentLead.split(' ').map(n => n[0]).join('')}
                    </div> 
                    {currentLead}
                  </div>
                ) : (
                  <span style={{ fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>No team lead assigned</span>
                )}
              </div>

              {/* OFFICERS POOL SECTION */}
              <div>
                <div className="section-label">OFFICERS POOL (AD SOURCE)</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {currentTeamOfficers.map((officer) => (
                    <div key={officer} className="avatar-pill">
                      <div className="avatar-circle gray">{officer.charAt(0)}</div> 
                      {officer}
                      <X 
                        size={12} 
                        style={{ cursor: 'pointer', marginLeft: '4px', color: '#9ca3af' }} 
                        onClick={() => handleRemoveOfficer(officer)}
                      />
                    </div>
                  ))}
                  
                  {/* Add Officer Button with Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <div 
                      className="avatar-pill dashed" 
                      onClick={() => setShowAddDropdown(!showAddDropdown)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Plus size={14} /> Add
                    </div>

                    {showAddDropdown && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, width: '200px', maxHeight: '150px', overflowY: 'auto' }}>
                        {availableOfficers.filter(o => !currentTeamOfficers.includes(o)).length === 0 ? (
                           <div style={{ padding: '10px', fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>All officers added</div>
                        ) : (
                          availableOfficers.filter(o => !currentTeamOfficers.includes(o)).map(officer => (
                            <div 
                              key={officer}
                              onClick={() => handleAddOfficer(officer)}
                              style={{ padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                              onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
                              onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                              {officer}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="section-label">LINKED COMPLAINT CATEGORIES</div>
              <div className="checkbox-grid">
                {complaintCategories.map((cat) => (
                  <label key={cat} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={currentTeamCategories.includes(cat)} 
                      onChange={() => handleToggleCategory(selectedTeam, cat)}
                    /> 
                    {cat}
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
                {complaintCategories.map((cat) => (
                  <label key={cat} className="checkbox-item">
                    <input 
                      type="checkbox" 
                      checked={currentStakeholderCategories.includes(cat)} 
                      onChange={() => handleToggleStakeholderCategory(selectedStakeholder, cat)}
                    /> 
                    {cat}
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
                style={{ padding: '6px 16px', flex: 'none', borderRadius: '4px', background: configFor === 'CMU Team' ? 'var(--primary-red)' : 'transparent', color: configFor === 'CMU Team' ? 'white' : 'var(--text-main)' }}
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
            <button className="btn-toggle" style={{ padding: '10px 24px', flex: 'none', background: 'white', border: '1px solid var(--border-color)' }}>Reset</button>
            <button className="btn-primary" style={{ padding: '10px 24px' }}>Save Escalation Rules</button>
          </div>
        </div>
      )}
    </div>
  );
}