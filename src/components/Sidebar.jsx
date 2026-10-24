import { NavLink } from 'react-router-dom';
import { FileText, Settings, Users, Layout, BarChart2, Bell, Info, Activity, Briefcase } from 'lucide-react';
import './Sidebar.css'

export default function Sidebar({ userRole }) {
  // Saare available menu items
  const allMenuItems = {
    lodge: { name: 'Lodge Complaint', path: '/lodge-complaint', icon: <FileText size={18} /> },
    setup: { name: 'Complaint Setup', path: '/complaint-setup', icon: <Settings size={18} /> },
    team: { name: 'Team Setup', path: '/team-setup', icon: <Users size={18} /> },
    reportBuilder: { name: 'Report Builder', path: '/report-builder', icon: <Layout size={18} /> },
    reports: { name: 'Reports', path: '/reports', icon: <BarChart2 size={18} /> },
    notifications: { name: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
    rca: { name: 'RCA Setup', path: '/rca-setup', icon: <Info size={18} /> },
    
    // New roles ke liye
    caseQueue: { name: 'Case Queue', path: '/case-queue', icon: <Activity size={18} /> },
    myCases: { name: 'My Cases', path: '/my-cases', icon: <Briefcase size={18} /> },
    myTeam: { name: 'My Team', path: '/my-team', icon: <Users size={18} /> },
  };

  // Role ke hisaab se menu define karein
  const roleMenus = {
    'System Admin': ['lodge', 'setup', 'team', 'reportBuilder', 'reports', 'notifications', 'rca'],
    'Reporter': ['lodge', 'reports'],
    'Team Lead': ['lodge', 'caseQueue', 'myCases', 'myTeam'],
    'Case Officer': ['lodge', 'myCases'],
    'Stakeholder': ['lodge', 'myCases'],
    'Complaint Lodger': ['lodge'],
  };

  const currentMenuKeys = roleMenus[userRole] || roleMenus['System Admin'];
  const menuItems = currentMenuKeys.map(key => allMenuItems[key]);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">C</div>
        <div>
          <div className="logo-title">CMU</div>
          <div className="logo-subtitle">Customer Management<br/>Unit</div>
        </div>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <div>First Bank</div>
        <span>v1.0.0 · 2026</span>
      </div>
    </div>
  );
}