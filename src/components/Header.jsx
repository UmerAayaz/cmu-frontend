import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // <-- useNavigate import kiya
import { Clock, RefreshCw, ChevronDown, User } from 'lucide-react';
import './Header.css'

export default function Header({ userRole, setUserRole }) {
  const location = useLocation();
  const navigate = useNavigate(); // <-- Navigate initialize kiya
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Dynamic Page Title
  let pageTitle = 'Lodge Complaint';
  if (location.pathname.includes('setup')) pageTitle = location.pathname === '/complaint-setup' ? 'Complaint Setup' : 'Team Setup';
  if (location.pathname === '/report-builder') pageTitle = 'Report Builder';
  if (location.pathname === '/reports') pageTitle = 'Reports';
  if (location.pathname === '/notifications') pageTitle = 'Notifications';
  if (location.pathname === '/rca-setup') pageTitle = 'RCA Setup';
  if (location.pathname === '/case-queue') pageTitle = 'Case Queue';
  if (location.pathname === '/my-cases') pageTitle = 'My Cases';
  if (location.pathname === '/my-team') pageTitle = 'My Team';

  // User Profile Data
  const userProfiles = {
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
      <div className="header-breadcrumb">
        <span style={{ color: '#9ca3af' }}>CMU</span>
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
                      navigate('/lodge-complaint'); // <-- YAHAN REDIRECT LAGAYA HAI
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