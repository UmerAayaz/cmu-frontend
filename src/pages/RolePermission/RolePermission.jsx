import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, ShieldCheck, FileText, GitBranch, Library, Users, 
  Briefcase, Activity, Send, FilePlus, Settings, Tag, BarChart2, Bell, Info, Layout,
  Calendar 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ALL_PERMISSIONS, ROLES, getPermissions, savePermissions } from "./permissions";
import './RolePermissions.css';

const PERMISSION_META = {
  dashboard:        { icon: <Layout size={18} />,      category: 'General',    description: 'View project dashboard and stats' },
  forms:            { icon: <FileText size={18} />,    category: 'Builder',    description: 'Create and edit forms' },
  workflows:        { icon: <GitBranch size={18} />,   category: 'Builder',    description: 'Design workflow processes' },
  fieldLibrary:     { icon: <Library size={18} />,     category: 'Builder',    description: 'Manage reusable form fields' },
  teamSetup:        { icon: <Users size={18} />,       category: 'Operations', description: 'Configure teams and members' },
  myCases:          { icon: <Briefcase size={18} />,   category: 'Operations', description: 'Access own case history' },
  caseQueue:        { icon: <Activity size={18} />,    category: 'Operations', description: 'View shared case queue' },
  publishQueue:     { icon: <Send size={18} />,        category: 'Operations', description: 'Publish forms and workflows' },
  lodgeComplaint:   { icon: <FilePlus size={18} />,    category: 'Management', description: 'Register new complaints' },
  complaintSetup:   { icon: <Settings size={18} />,    category: 'Management', description: 'Configure complaint categories' },
  lookups:          { icon: <Tag size={18} />,         category: 'Management', description: 'Manage master data lists' },
  myTeam:           { icon: <Users size={18} />,       category: 'Management', description: 'View own team details' },
  reportBuilder:    { icon: <BarChart2 size={18} />,   category: 'Management', description: 'Build custom reports' },
  reports:          { icon: <BarChart2 size={18} />,   category: 'Management', description: 'View and export reports' },
  notifications:    { icon: <Bell size={18} />,        category: 'Management', description: 'Manage notification templates' },
  rcaSetup:         { icon: <Info size={18} />,        category: 'Management', description: 'Configure root cause reasons' },
  businessCalendar: { icon: <Calendar size={18} />,    category: 'Management', description: 'Configure business calendars and holidays' },
};

const CATEGORY_COLORS = {
  General:    { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
  Builder:    { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
  Operations: { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
  Management: { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
};

const ROLE_DESCRIPTIONS = {
  'Super Admin':      'Full platform access — manage projects, users, and everything',
  'System Admin':     'Full project access — configure all modules',
  'Team Lead':        'Manage team operations and review work',
  'Case Officer':     'Handle assigned cases and complete tasks',
  'Stakeholder':      'Respond to routed cases',
  'Reporter':         'View reports and lodge complaints',
  'Complaint Lodger': 'Only lodge new complaints',
};

export default function RolePermissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({});
  const [activeRole, setActiveRole] = useState('Super Admin');

  useEffect(() => {
    // getPermissions() humara sanitize wala logic call karega
    setPermissions(getPermissions());
  }, []);

  const rolePerms = permissions[activeRole] || [];

  const handleToggle = (permKey) => {
    const has = rolePerms.includes(permKey);
    setPermissions((prev) => ({
      ...prev,
      [activeRole]: has ? rolePerms.filter(k => k !== permKey) : [...rolePerms, permKey],
    }));
  };

  const handleToggleAll = (category, enable) => {
    const categoryPerms = ALL_PERMISSIONS
      .filter(p => PERMISSION_META[p.key]?.category === category)
      .map(p => p.key);
    
    const newPerms = enable
      ? [...new Set([...rolePerms, ...categoryPerms])]
      : rolePerms.filter(k => !categoryPerms.includes(k));
    
    setPermissions(prev => ({ ...prev, [activeRole]: newPerms }));
  };

  const handleSave = () => {
    savePermissions(permissions);
    toast.success('Permissions saved successfully!');
  };

  const categories = ['Builder', 'Operations', 'Management'];
  const groupedPerms = categories.map(cat => ({
    name: cat,
    perms: ALL_PERMISSIONS.filter(p => PERMISSION_META[p.key]?.category === cat)
  }));

  const totalSelected = rolePerms.length;

  return (
    <div className="wf-page">
      {/* ═══ Page Header ═══ */}
      <div className="wf-header">
        <div>
          <button onClick={() => navigate(`/projects/${id}/dashboard`)} className="wf-btn wf-btn--ghost wf-btn-back">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="wf-title">Role Permissions</h1>
          <p className="wf-subtitle">Control which features each role can access</p>
        </div>
      </div>

      <div className="role-perm-layout">
        
        {/* LEFT: Role List */}
        <div className="role-list-sidebar">
          {ROLES.map((role) => {
            const isActive = activeRole === role;
            const permsCount = (permissions[role] || []).length;
            return (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`role-card ${isActive ? 'active' : ''}`}
              >
                <div className="role-icon-box">
                  <ShieldCheck size={20} />
                </div>
                <div className="role-info">
                  <div className="role-name">{role}</div>
                  <div className="role-desc">
                    {permsCount} of {ALL_PERMISSIONS.length} permissions
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT: Permissions Panel */}
        <div className="wf-card perm-panel">
          
          {/* Role Header */}
          <div className="perm-panel-header">
            <div className="perm-panel-header-inner">
              <div className="perm-shield-icon">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="perm-role-title">{activeRole}</h2>
                <p className="perm-role-desc">{ROLE_DESCRIPTIONS[activeRole]}</p>
              </div>
            </div>
            <div className="perm-count-badge">
              <span className="dot" />
              {totalSelected} of {ALL_PERMISSIONS.length} enabled
            </div>
          </div>

          {/* Permission Groups */}
          <div className="perm-groups-container">
            {groupedPerms.map((group) => {
              const meta = CATEGORY_COLORS[group.name];
              const allEnabled = group.perms.every(p => rolePerms.includes(p.key));
              const someEnabled = group.perms.some(p => rolePerms.includes(p.key));

              return (
                <div key={group.name} className="perm-group">
                  {/* Group Header */}
                  <div className="perm-group-header">
                    <div className="perm-group-title">
                      <span 
                        className="perm-category-badge" 
                        style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}
                      >
                        {group.name}
                      </span>
                      <span className="perm-group-count">
                        {group.perms.filter(p => rolePerms.includes(p.key)).length}/{group.perms.length}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleAll(group.name, !allEnabled)}
                      className={`perm-toggle-all-btn ${someEnabled || allEnabled ? 'active' : ''}`}
                    >
                      {allEnabled ? 'Disable all' : 'Enable all'}
                    </button>
                  </div>

                  {/* Permission Cards Grid */}
                  <div className="perm-grid">
                    {group.perms.map((perm) => {
                      const enabled = rolePerms.includes(perm.key);
                      const pmeta = PERMISSION_META[perm.key];
                      return (
                        <div
                          key={perm.key}
                          onClick={() => handleToggle(perm.key)}
                          className={`perm-card ${enabled ? 'enabled' : ''}`}
                        >
                          <div className="perm-icon-box">
                            {pmeta?.icon}
                          </div>
                          <div className="perm-text">
                            <div className="perm-label">{perm.label}</div>
                            <div className="perm-description">{pmeta?.description}</div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggle(perm.key); }}
                            className={`toggle-switch ${enabled ? 'enabled' : ''}`}
                          >
                            <span className="toggle-dot" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Footer */}
          <div className="perm-footer">
            <div className="perm-footer-text">
              Changes apply immediately after saving
            </div>
            <button onClick={handleSave} className="wf-btn wf-btn--primary">
              <Save size={16} /> Save Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}