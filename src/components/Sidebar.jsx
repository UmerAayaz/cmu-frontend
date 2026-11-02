import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  FileText, Settings, Users, Layout, BarChart2, Bell, Info, Activity,
  Briefcase, Library, FolderKanban, GitBranch, Send, ListChecks, ArrowLeft,
  ShieldCheck, Tag
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { getPermissions } from '../utils/permissions';
import './Sidebar.css';

export default function Sidebar({ userRole }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeProject = useProjectStore((s) => s.activeProject);
  const clearProject = useProjectStore((s) => s.clear);

  const isProjectRoute =
    (pathname.startsWith('/projects/') &&
      !pathname.startsWith('/projects/create') &&
      pathname !== '/projects');
      
  const inProject = !!activeProject && isProjectRoute;
  const project = inProject ? activeProject : null;
  const base = project ? `/projects/${project.id}` : '';

  // ── Platform Menu ──
  const platformMenuItems = [
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={18} /> },
  ];

  // if (userRole === 'Super Admin') {
  //   platformMenuItems.push(
  //     { name: 'Global Fields', path: '/forms/field-library', icon: <Library size={18} /> }
  //   );
  // }

  // ── Project Menu Map (Lucide Icons) ──
  const allProjectItemsMap = {
    dashboard:       { name: 'Dashboard',        path: `${base}/dashboard`,          icon: <Layout size={18} /> },
    forms:           { name: 'Forms',            path: `${base}/forms`,              icon: <FileText size={18} /> },
    workflows:       { name: 'Workflows',        path: `${base}/workflows`,          icon: <GitBranch size={18} /> },
    fieldLibrary:    { name: 'Field Library',    path: `${base}/forms/field-library`,icon: <Library size={18} /> },
    teamSetup:       { name: 'Team Setup',       path: `${base}/team-setup`,         icon: <Users size={18} /> },
    myTasks:         { name: 'My Tasks',         path: `${base}/my-tasks`,           icon: <ListChecks size={18} /> },
    myCases:         { name: 'My Cases',         path: `${base}/my-cases`,           icon: <Briefcase size={18} /> },
    caseQueue:       { name: 'Case Queue',       path: `${base}/case-queue`,         icon: <Activity size={18} /> },
    publishQueue:    { name: 'Publish Queue',    path: `${base}/publish-queue`,      icon: <Send size={18} /> },
    lodgeComplaint:  { name: 'Lodge Complaint',  path: `${base}/lodge-complaint`,    icon: <FileText size={18} /> },
    complaintSetup:  { name: 'Complaint Setup',  path: `${base}/complaint-setup`,    icon: <Settings size={18} /> },
    lookups:         { name: 'Lookups',          path: `${base}/lookups`,            icon: <Tag size={18} /> }, // ⭐ Naya Lookups
    myTeam:          { name: 'My Team',          path: `${base}/my-team`,            icon: <Users size={18} /> },
    reportBuilder:   { name: 'Report Builder',   path: `${base}/report-builder`,     icon: <Layout size={18} /> },
    reports:         { name: 'Reports',          path: `${base}/reports`,            icon: <BarChart2 size={18} /> },
    notifications:   { name: 'Notifications',    path: `${base}/notifications`,      icon: <Bell size={18} /> },
    rcaSetup:        { name: 'RCA Setup',        path: `${base}/rca-setup`,          icon: <Info size={18} /> },
  };

  let projectMenuItems = [];
  if (project) {
    const permissions = getPermissions();
    let allowedKeys = permissions[userRole] || [];

    // Super Admin aur System Admin bypass
    if (userRole === 'Super Admin' || userRole === 'System Admin') {
      allowedKeys = Object.keys(allProjectItemsMap);
    }

    // Map allowed items
    projectMenuItems = allowedKeys
      .map(key => allProjectItemsMap[key])
      .filter(Boolean);

    // ⭐ Super Admin ke liye alag "ADMIN SETTINGS" section
    if (userRole === 'Super Admin') {
      projectMenuItems.push(
        { name: '--- ADMIN SETTINGS ---', path: '#', icon: null },
        { name: 'Role Permissions', path: `${base}/permissions`, icon: <ShieldCheck size={18} /> }
      );
    }
  }

  const menuItems = inProject ? projectMenuItems : platformMenuItems;

  const handleBackToProjects = () => {
    clearProject();
    navigate('/projects');
  };

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-logo">
        <div
          className="logo-icon"
          style={inProject ? { background: 'var(--primary-red)', color: '#fff' } : { background: '#0F172A', color: '#fff' }}
        >
          {inProject ? (project?.name?.[0]?.toUpperCase() || 'P') : 'P'}
        </div>
        <div style={{ minWidth: 0 }}>
          {inProject ? (
            <>
              <div className="logo-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={project?.name}>
                {project?.name}
              </div>
              <div className="logo-subtitle" style={{ fontFamily: 'monospace', fontSize: 11 }}>
                {project?.code}
              </div>
            </>
          ) : (
            <>
              <div className="logo-title">My Workspace</div>
              <div className="logo-subtitle">Platform Admin</div>
            </>
          )}
        </div>
      </div>

      {/* Back Button */}
      {inProject && (
        <button
          onClick={handleBackToProjects}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            margin: '8px 12px 0', padding: '8px 10px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#64748B', fontSize: 12, borderRadius: 6,
            transition: 'background 0.15s', fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <ArrowLeft size={14} /> All Projects
        </button>
      )}

      {/* Menu */}
      <div className="sidebar-menu" style={{ overflowY: 'auto' }}>
        {menuItems.map((item, idx) => {
          // Section divider
          if (item.name && item.name.startsWith('---')) {
            return (
              <div key={idx} style={{ 
                fontSize: 11, fontWeight: 600, color: '#94A3B8', 
                textTransform: 'uppercase', margin: '16px 0 8px 12px', letterSpacing: '0.5px' 
              }}>
                {item.name.replace(/---/g, '').trim()}
              </div>
            );
          }

          return (
            <NavLink
              key={idx}
              to={item.path}
              end={item.path === '/projects' || item.path === base || item.path === `${base}/forms`}
              className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div>{inProject ? project?.code : 'Platform'}</div>
        <span>v1.0.0 · 2026</span>
      </div>
    </div>
  );
}