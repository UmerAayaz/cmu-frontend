import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, ShieldCheck, FileText, GitBranch, Library, Users, ListChecks, 
  Briefcase, Activity, Send, FilePlus, Settings, Tag, BarChart2, Bell, Info, Layout 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ALL_PERMISSIONS, ROLES, getPermissions, savePermissions } from '../utils/permissions';
import '../styles/workflow-module.css';

// ═══════════════════════════════════════════════════════════
//  Permission Metadata (icon + category + description)
// ═══════════════════════════════════════════════════════════
const PERMISSION_META = {
  dashboard:      { icon: <Layout size={18} />,      category: 'General',    description: 'View project dashboard and stats' },
  forms:          { icon: <FileText size={18} />,    category: 'Builder',    description: 'Create and edit forms' },
  workflows:      { icon: <GitBranch size={18} />,   category: 'Builder',    description: 'Design workflow processes' },
  fieldLibrary:   { icon: <Library size={18} />,     category: 'Builder',    description: 'Manage reusable form fields' },
  teamSetup:      { icon: <Users size={18} />,       category: 'Operations', description: 'Configure teams and members' },
  myTasks:        { icon: <ListChecks size={18} />,  category: 'Operations', description: 'View assigned workflow tasks' },
  myCases:        { icon: <Briefcase size={18} />,   category: 'Operations', description: 'Access own case history' },
  caseQueue:      { icon: <Activity size={18} />,    category: 'Operations', description: 'View shared case queue' },
  publishQueue:   { icon: <Send size={18} />,        category: 'Operations', description: 'Publish forms and workflows' },
  lodgeComplaint: { icon: <FilePlus size={18} />,    category: 'Management', description: 'Register new complaints' },
  complaintSetup: { icon: <Settings size={18} />,    category: 'Management', description: 'Configure complaint categories' },
  lookups:        { icon: <Tag size={18} />,         category: 'Management', description: 'Manage master data lists' },
  myTeam:         { icon: <Users size={18} />,       category: 'Management', description: 'View own team details' },
  reportBuilder:  { icon: <BarChart2 size={18} />,   category: 'Management', description: 'Build custom reports' },
  reports:        { icon: <BarChart2 size={18} />,   category: 'Management', description: 'View and export reports' },
  notifications:  { icon: <Bell size={18} />,        category: 'Management', description: 'Manage notification templates' },
  rcaSetup:       { icon: <Info size={18} />,        category: 'Management', description: 'Configure root cause reasons' },
};

// ═══════════════════════════════════════════════════════════
//  Category Badge Colors — Project theme ke saath sync (RED)
// ═══════════════════════════════════════════════════════════
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
    setPermissions(getPermissions());
  }, []);

  const themeColor = 'var(--primary-red)';
  const themeColorAlpha = (opacity) => `rgba(var(--theme-primary-rgb), ${opacity})`;

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
          <button onClick={() => navigate(`/projects/${id}/dashboard`)} className="wf-btn wf-btn--ghost" style={{ marginBottom: 8, paddingLeft: 0 }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="wf-title">Role Permissions</h1>
          <p className="wf-subtitle">Control which features each role can access</p>
        </div>
        {/* <button onClick={handleSave} className="wf-btn wf-btn--primary">
          <Save size={16} /> Save Permissions
        </button> */}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        
        {/* ═══════════════════════════════════════════════════════ */}
        {/* LEFT: Role List                                        */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ROLES.map((role) => {
            const isActive = activeRole === role;
            const permsCount = (permissions[role] || []).length;
            return (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  background: isActive ? '#fff' : '#FAFBFC',
                  border: `1.5px solid ${isActive ? themeColor : '#EEF1F5'}`,
                  borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.08)' : 'none',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: isActive ? themeColorAlpha(0.1) : '#F1F5F9',
                  color: isActive ? themeColor : '#64748B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.15s ease',
                }}>
                  <ShieldCheck size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: 13.5, fontWeight: 600, 
                    color: isActive ? themeColor : '#0F172A',
                    marginBottom: 2,
                  }}>
                    {role}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    {permsCount} of {ALL_PERMISSIONS.length} permissions
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* RIGHT: Permissions Panel                              */}
        {/* ═══════════════════════════════════════════════════════ */}
        <div className="wf-card" style={{ padding: 0, overflow: 'hidden' }}>
          
          {/* Role Header */}
          <div style={{
            padding: 24,
            borderBottom: '1px solid #EEF1F5',
            background: `linear-gradient(135deg, ${themeColorAlpha(0.05)} 0%, ${themeColorAlpha(0.02)} 100%)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: themeColor, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0B1220', letterSpacing: '-0.01em' }}>
                  {activeRole}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
                  {ROLE_DESCRIPTIONS[activeRole]}
                </p>
              </div>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', background: '#fff',
              border: '1px solid #E2E8F0', borderRadius: 20,
              fontSize: 12, fontWeight: 600, color: themeColor, marginTop: 8,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: themeColor }} />
              {totalSelected} of {ALL_PERMISSIONS.length} enabled
            </div>
          </div>

          {/* Permission Groups */}
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {groupedPerms.map((group) => {
              const meta = CATEGORY_COLORS[group.name];
              const allEnabled = group.perms.every(p => rolePerms.includes(p.key));
              const someEnabled = group.perms.some(p => rolePerms.includes(p.key));

              return (
                <div key={group.name}>
                  {/* Group Header */}
                  <div style={{ 
                    display: 'flex', alignItems: 'center', 
                    justifyContent: 'space-between', marginBottom: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        padding: '4px 10px',
                        background: meta.bg,
                        color: meta.color,
                        border: `1px solid ${meta.border}`,
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}>
                        {group.name}
                      </span>
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>
                        {group.perms.filter(p => rolePerms.includes(p.key)).length}/{group.perms.length}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleAll(group.name, !allEnabled)}
                      style={{
                        background: 'transparent', border: 'none',
                        color: someEnabled || allEnabled ? themeColor : '#64748B',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'inherit', padding: '4px 8px', borderRadius: 6,
                      }}
                    >
                      {allEnabled ? 'Disable all' : 'Enable all'}
                    </button>
                  </div>

                  {/* Permission Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {group.perms.map((perm) => {
                      const enabled = rolePerms.includes(perm.key);
                      const pmeta = PERMISSION_META[perm.key];
                      return (
                        <div
                          key={perm.key}
                          onClick={() => handleToggle(perm.key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px 14px',
                            background: enabled ? themeColorAlpha(0.03) : '#fff',
                            border: `1.5px solid ${enabled ? themeColorAlpha(0.3) : '#EEF1F5'}`,
                            borderRadius: 10, cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: enabled ? themeColorAlpha(0.1) : '#F8FAFC',
                            color: enabled ? themeColor : '#94A3B8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'all 0.15s ease',
                          }}>
                            {pmeta?.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ 
                              fontSize: 13, fontWeight: 600, 
                              color: enabled ? '#0B1220' : '#475569',
                              marginBottom: 1,
                            }}>
                              {perm.label}
                            </div>
                            <div style={{ fontSize: 11, color: '#94A3B8', lineHeight: 1.3 }}>
                              {pmeta?.description}
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggle(perm.key); }}
                            style={{
                              width: 38, height: 22, borderRadius: 11,
                              background: enabled ? themeColor : '#CBD5E1',
                              border: 'none', cursor: 'pointer',
                              position: 'relative', transition: 'all 0.2s ease',
                              flexShrink: 0, padding: 0,
                            }}
                          >
                            <span style={{
                              position: 'absolute', top: 2,
                              left: enabled ? 18 : 2,
                              width: 18, height: 18, borderRadius: '50%',
                              background: '#fff',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                              transition: 'all 0.2s ease',
                            }} />
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
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #EEF1F5',
            background: '#FAFBFC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: 13, color: '#64748B' }}>
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