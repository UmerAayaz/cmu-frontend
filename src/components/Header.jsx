import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, RefreshCw, ChevronDown, User } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import './Header.css';

export default function Header({ userRole, setUserRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // ⭐ Active project nikalne ke liye
  const activeProject = useProjectStore((s) => s.activeProject);

  // ── Dynamic Page Title Logic (Naye Nested Routes ke hisaab se) ──
  let pageTitle = 'Dashboard';
  const path = location.pathname;

  if (path === '/projects') pageTitle = 'Projects';
  else if (path === '/projects/create') pageTitle = 'Create Project';
  else if (path.includes('/dashboard')) pageTitle = 'Dashboard';
  else if (path.includes('/lodge-complaint')) pageTitle = 'Lodge Complaint';
  else if (path.includes('/complaint-setup')) pageTitle = 'Complaint Setup';
  else if (path.includes('/team-setup')) pageTitle = 'Team Setup';
  else if (path.includes('/report-builder')) pageTitle = 'Report Builder';
  else if (path.includes('/reports')) pageTitle = 'Reports';
  else if (path.includes('/notifications')) pageTitle = 'Notifications';
  else if (path.includes('/rca-setup')) pageTitle = 'RCA Setup';
  else if (path.includes('/case-queue')) pageTitle = 'Case Queue';
  else if (path.includes('/my-cases')) pageTitle = 'My Cases';
  else if (path.includes('/my-team')) pageTitle = 'My Team';
  else if (path.includes('/forms/field-library')) pageTitle = 'Field Library';
  else if (path.includes('/forms')) pageTitle = 'Forms';
  else if (path.includes('/workflows')) pageTitle = 'Workflows';

  // Context Name (Platform ya Project ka naam)
  const contextName = activeProject ? activeProject.name : 'Platform';

  // User Profile Data
  const userProfiles = {
    'Super Admin': { name: 'Super Admin', role: 'Super Admin', initials: 'SU' },
    'System Admin': { name: 'System Admin', role: 'Admin', initials: 'SA' },
    'Reporter': { name: 'Report User', role: 'Reporter', initials: 'RU' },
    'Team Lead': { name: 'Team Lead', role: 'Team Lead', initials: 'TL' },
    'Case Officer': { name: 'Case Officer', role: 'Officer', initials: 'CO' },
    'Stakeholder': { name: 'Dept. User Stakeholder', role: 'Stakeholder', initials: 'Stk' },
    'Complaint Lodger': { name: 'Complaint Lodger', role: 'Complaint Lodger', initials: 'CL' },
  };

  const currentUser = userProfiles[userRole] || userProfiles['System Admin'];

  return (
    <div className="header">
      {/* ⭐ Dynamic Breadcrumb */}
      <div className="header-breadcrumb">
        <span style={{ color: '#9ca3af' }}>{contextName}</span>
        <span style={{ margin: '0 8px', color: '#9ca3af' }}>/</span>
        <span style={{ fontWeight: 600 }}>{pageTitle}</span>
      </div>

      <div className="header-actions">
        <div className="status-badge">
          <Clock size={14} /> 0 Working Days
        </div>
        <div className="sync-badge">
          <RefreshCw size={12} color="#10b981" /> AD Sync <RefreshCw size={12} color="#10b981" style={{marginLeft: '4px'}}/>
        </div>
        
        <div className="user-profile">
          
          {/* Profile Dropdown */}
          <div style={{ position: 'relative' }}>
            <div 
              className="profile-dropdown" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <User size={16} /> {currentUser.role} <ChevronDown size={14} />
            </div>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="role-dropdown-menu">
                {Object.keys(userProfiles).map((roleKey) => (
                  <div 
                    key={roleKey} 
                    className={`role-dropdown-item ${userRole === roleKey ? 'active' : ''}`}
                    onClick={() => {
                      setUserRole(roleKey);
                      setIsDropdownOpen(false);
                      // ⭐ Role change hone par wapis Projects List par bhej do
                      navigate('/projects'); 
                    }}
                  >
                    {userProfiles[roleKey].name}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Avatar and Names */}
          <div className="system-admin">
            <div className="sa-avatar">
              {currentUser.initials}
            </div>
            <div>
              <div className="admin-title">{currentUser.name}</div>
              <div className="admin-subtitle">{currentUser.role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}