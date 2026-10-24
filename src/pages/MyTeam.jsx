import { useState } from 'react';
import { Search, Users } from 'lucide-react';


export default function MyTeam() {
  const [searchQuery, setSearchQuery] = useState('');

  // --- Mock Data ---
  const teamMembers = [
    { name: 'Ahmed Raza', role: 'Officer', total: 142, initials: 'AR', today: 6, target: 8, progress: 75, active: 3, tat: '2.4d', overdue: 1 },
    { name: 'Bilal Shaikh', role: 'Officer', total: 118, initials: 'BS', today: 8, target: 8, progress: 100, active: 2, tat: '1.9d', overdue: 0, onTarget: true },
    { name: 'Ayesha Tariq', role: 'Officer', total: 97, initials: 'AT', today: 4, target: 8, progress: 50, active: 5, tat: '3.1d', overdue: 2 },
    { name: 'Usman Malik', role: 'Officer', total: 204, initials: 'UM', today: 7, target: 8, progress: 88, active: 1, tat: '1.6d', overdue: 0 },
    { name: 'Nadia Iqbal', role: 'Officer', total: 78, initials: 'NI', today: 3, target: 8, progress: 38, active: 4, tat: '2.8d', overdue: 1 },
  ];

  // Filtering Logic
  const filteredMembers = teamMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper for Progress Bar Color
  const getProgressColor = (progress) => {
    if (progress >= 100) return '#16a34a'; // Green
    if (progress >= 75) return '#d97706';  // Orange/Dark Yellow
    if (progress >= 50) return '#ea580c';  // Light Orange
    return '#dc2626'; // Red
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">My Team</h1>
        <p className="page-subtitle">View your team members' workload and today's progress against targets.</p>
      </div>

      {/* Top Metric Cards */}
      <div className="mt-metrics-grid">
        <div className="mt-metric-card">
          <div className="mt-metric-value" style={{ color: 'var(--primary-red)' }}>5</div>
          <div className="mt-metric-label">Team Size</div>
        </div>
        <div className="mt-metric-card">
          <div className="mt-metric-value" style={{ color: '#1f2937' }}>28</div>
          <div className="mt-metric-label">Today's Total <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>/ 40 target</span></div>
        </div>
        <div className="mt-metric-card">
          <div className="mt-metric-value" style={{ color: '#16a34a' }}>1</div>
          <div className="mt-metric-label">On Target <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>of 5</span></div>
        </div>
        <div className="mt-metric-card">
          <div className="mt-metric-value" style={{ color: '#d97706' }}>15</div>
          <div className="mt-metric-label">Active Cases</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-box" style={{ width: '350px', marginBottom: '20px', background: 'white' }}>
        <Search size={16} color="#9ca3af" />
        <input 
          type="text" 
          placeholder="Search team members..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="cq-table-container">
        <div className="cq-table-header">
          <div style={{ width: '250px' }}>OFFICER</div>
          <div style={{ width: '100px' }}>TODAY</div>
          <div style={{ flex: 1 }}>PROGRESS VS TARGET</div>
          <div style={{ width: '120px' }}>ACTIVE</div>
          <div style={{ width: '120px' }}>AVG TAT</div>
          <div style={{ width: '120px' }}>OVERDUE</div>
        </div>

        {filteredMembers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No team members found.</div>
        ) : (
          filteredMembers.map((member, idx) => (
            <div key={idx} className="cq-table-row" style={{ cursor: 'default' }}>
              
              {/* Officer Info */}
              <div style={{ width: '250px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="sa-avatar" style={{ width: '36px', height: '36px', fontSize: '13px' }}>
                  {member.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{member.name}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{member.role} · {member.total} total</div>
                </div>
              </div>

              {/* Today's Count */}
              <div style={{ width: '100px', fontSize: '14px', fontWeight: 500 }}>
                <span style={{ color: 'var(--text-main)' }}>{member.today}</span>
                <span style={{ color: '#9ca3af' }}> / {member.target}</span>
              </div>

              {/* Progress Bar */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, maxWidth: '250px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{member.progress}%</span>
                    {member.onTarget && (
                      <span style={{ fontSize: '10px', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>On Target</span>
                    )}
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${member.progress}%`, backgroundColor: getProgressColor(member.progress), borderRadius: '3px' }}></div>
                  </div>
                </div>
              </div>

              {/* Active Cases */}
              <div style={{ width: '120px', fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>
                {member.active} cases
              </div>

              {/* Avg TAT */}
              <div style={{ width: '120px', fontSize: '13px', color: member.tat > '2.5' ? '#d97706' : '#16a34a', fontWeight: 500 }}>
                {member.tat} avg
              </div>

              {/* Overdue */}
              <div style={{ width: '120px' }}>
                {member.overdue > 0 ? (
                  <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                    {member.overdue} overdue
                  </span>
                ) : (
                  <span style={{ color: '#9ca3af' }}>—</span>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Footer Info Banner */}
      <div style={{ background: '#f9fafb', border: '1px solid var(--border-color)', padding: '12px 20px', borderRadius: '6px', fontSize: '13px', color: '#6b7280', marginTop: '16px' }}>
        Daily target: <strong>8 complaints per officer</strong> · Progress resets at midnight · Avg TAT threshold: 2.5 working days
      </div>

      {/* Team Lead Card */}
      <div style={{ marginTop: '32px' }}>
        <div className="section-label" style={{ marginBottom: '12px', fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>
          TEAM LEAD — TEAM LEAD
        </div>
        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="sa-avatar" style={{ width: '36px', height: '36px', fontSize: '13px', background: '#fca5a5' }}>
              TL
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>Sana Mirza</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Team Lead · Branch Banking</div>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            Managing 5 officers
          </div>
        </div>
      </div>

    </div>
  );
}