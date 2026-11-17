// Saari available permissions ki list
export const ALL_PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'forms', label: 'Forms' },
  { key: 'workflows', label: 'Workflows' },
  { key: 'fieldLibrary', label: 'Field Library' },
  { key: 'teamSetup', label: 'Team Setup' },
  { key: 'myCases', label: 'My Cases' },
  { key: 'caseQueue', label: 'Case Queue' },
  { key: 'publishQueue', label: 'Publish Queue' },
  { key: 'lodgeComplaint', label: 'Lodge Complaint' },
  { key: 'complaintSetup', label: 'Complaint Setup' },
  { key: 'lookups', label: 'Lookups' },
  { key: 'businessCalendar', label: 'Business Calendar' },
  { key: 'myTeam', label: 'My Team' },
  { key: 'reportBuilder', label: 'Report Builder' },
  { key: 'reports', label: 'Reports' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'rcaSetup', label: 'RCA Setup' },
];

// Default Roles aur unki permissions
const DEFAULT_PERMISSIONS = {
  'Super Admin': ALL_PERMISSIONS.map(p => p.key), // Gets all
  'System Admin': ALL_PERMISSIONS.map(p => p.key), // Gets all
  'Team Lead': [
    'dashboard', 'forms', 'workflows', 'teamSetup', 
    'myCases', 'caseQueue', 'businessCalendar', 'myTeam', 'reports'
  ],
  'Case Officer': [
    'dashboard', 'myCases', 'caseQueue', 'lodgeComplaint', 'businessCalendar'
  ],
  'Stakeholder': [
    'dashboard', 'myCases', 'lodgeComplaint'
  ],
  'Reporter': [
    'dashboard', 'lodgeComplaint', 'reports'
  ],
  'Complaint Lodger': [
    'dashboard', 'lodgeComplaint'
  ]
};

// LocalStorage se permissions uthana (ya default return karna)
export function getPermissions() {
  const saved = localStorage.getItem('cmu_permissions');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse permissions", e);
    }
  }
  return DEFAULT_PERMISSIONS;
}

// Permissions ko LocalStorage mein save karna
export function savePermissions(permissions) {
  localStorage.setItem('cmu_permissions', JSON.stringify(permissions));
}










import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, ShieldCheck, FileText, GitBranch, Library, Users, 
  Briefcase, Activity, Send, FilePlus, Settings, Tag, BarChart2, Bell, Info, Layout,
  Calendar, Plus, Trash2
} from 'lucide-react';
import { Modal, Input, Checkbox } from 'antd';
import toast from 'react-hot-toast';
// Agar permissions.js alag folder mein hai toh path adjust karein (e.g. '../utils/permissions')
import { ALL_PERMISSIONS, getPermissions, savePermissions } from "./permissions"; 
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
  businessCalendar: { icon: <Calendar size={18} />,    category: 'Management', description: 'Configure business calendars and holidays' },
  myTeam:           { icon: <Users size={18} />,       category: 'Management', description: 'View own team details' },
  reportBuilder:    { icon: <BarChart2 size={18} />,   category: 'Management', description: 'Build custom reports' },
  reports:          { icon: <BarChart2 size={18} />,   category: 'Management', description: 'View and export reports' },
  notifications:    { icon: <Bell size={18} />,        category: 'Management', description: 'Manage notification templates' },
  rcaSetup:         { icon: <Info size={18} />,        category: 'Management', description: 'Configure root cause reasons' },
};

const CATEGORY_COLORS = {
  General:    { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
  Builder:    { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
  Operations: { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
  Management: { bg: 'rgba(var(--theme-primary-rgb), 0.08)', color: 'var(--primary-red)', border: 'rgba(var(--theme-primary-rgb), 0.15)' },
};

export default function RolePermissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({});
  const [activeRole, setActiveRole] = useState('Super Admin');
  
  // Modal States
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState(['dashboard']); 

  useEffect(() => {
    const data = getPermissions();
    setPermissions(data);
    // Set default active role to first available role
    const availableRoles = Object.keys(data);
    if (availableRoles.length > 0 && !availableRoles.includes(activeRole)) {
      setActiveRole(availableRoles[0]);
    }
  }, []);

  // Dynamic Roles List
  const availableRoles = Object.keys(permissions);
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

  // Modal Checkbox Toggle
  const handleModalPermissionToggle = (permKey) => {
    setNewRolePermissions(prev => 
      prev.includes(permKey) ? prev.filter(k => k !== permKey) : [...prev, permKey]
    );
  };

  // Naya Role Create karna
  const handleAddRole = () => {
    const trimmedName = newRoleName.trim();
    if (!trimmedName) return toast.error('Role name is required');
    if (permissions[trimmedName]) return toast.error('Role already exists');

    setPermissions(prev => ({
      ...prev,
      [trimmedName]: newRolePermissions 
    }));
    
    setActiveRole(trimmedName); 
    setIsAddRoleModalOpen(false);
    setNewRoleName('');
    setNewRolePermissions(['dashboard']); 
    toast.success('New role added. Click "Save Permissions" to apply.');
  };

  // Role Delete karna
  const handleDeleteRole = (roleToDelete, e) => {
    e.stopPropagation(); 
    if (roleToDelete === 'Super Admin') return toast.error('Cannot delete Super Admin');
    
    Modal.confirm({
      title: `Delete role "${roleToDelete}"?`,
      content: 'This action cannot be undone.',
      okText: 'Yes, delete',
      okType: 'danger',
      onOk: () => {
        const newPerms = { ...permissions };
        delete newPerms[roleToDelete];
        setPermissions(newPerms);
        if (activeRole === roleToDelete) {
          setActiveRole(Object.keys(newPerms)[0] || 'Super Admin');
        }
        toast.success('Role deleted');
      }
    });
  };

  const categories = ['General', 'Builder', 'Operations', 'Management'];
  const groupedPerms = categories.map(cat => ({
    name: cat,
    perms: ALL_PERMISSIONS.filter(p => PERMISSION_META[p.key]?.category === cat)
  }));

  const totalSelected = rolePerms.length;

  return (
    <div className="wf-page">
      {/* Page Header */}
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
          
          <button 
            onClick={() => {
              setNewRoleName('');
              setNewRolePermissions(['dashboard']); 
              setIsAddRoleModalOpen(true);
            }}
            className="wf-btn wf-btn--secondary" 
            style={{ width: '100%', marginBottom: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Add New Role
          </button>

          {availableRoles.map((role) => {
            const isActive = activeRole === role;
            const permsCount = (permissions[role] || []).length;
            return (
              <div
                key={role}
                onClick={() => setActiveRole(role)}
                className={`role-card ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="role-icon-box">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="role-info">
                    <div className="role-name">{role}</div>
                    <div className="role-desc">
                      {permsCount} of {ALL_PERMISSIONS.length} permissions
                    </div>
                  </div>
                </div>
                
                {role !== 'Super Admin' && (
                  <button 
                    onClick={(e) => handleDeleteRole(role, e)}
                    style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px' }}
                    title="Delete Role"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT: Permissions Panel */}
        <div className="wf-card perm-panel">
          <div className="perm-panel-header">
            <div className="perm-panel-header-inner">
              <div className="perm-shield-icon">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="perm-role-title">{activeRole}</h2>
                <p className="perm-role-desc">Manage permissions for this role</p>
              </div>
            </div>
            <div className="perm-count-badge">
              <span className="dot" />
              {totalSelected} of {ALL_PERMISSIONS.length} enabled
            </div>
          </div>

          <div className="perm-groups-container">
            {groupedPerms.map((group) => {
              if (group.perms.length === 0) return null;
              const meta = CATEGORY_COLORS[group.name] || CATEGORY_COLORS['General'];
              const allEnabled = group.perms.every(p => rolePerms.includes(p.key));
              const someEnabled = group.perms.some(p => rolePerms.includes(p.key));

              return (
                <div key={group.name} className="perm-group">
                  <div className="perm-group-header">
                    <div className="perm-group-title">
                      <span className="perm-category-badge" style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}>
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

                  <div className="perm-grid">
                    {group.perms.map((perm) => {
                      const enabled = rolePerms.includes(perm.key);
                      const pmeta = PERMISSION_META[perm.key];
                      return (
                        <div key={perm.key} onClick={() => handleToggle(perm.key)} className={`perm-card ${enabled ? 'enabled' : ''}`}>
                          <div className="perm-icon-box">{pmeta?.icon}</div>
                          <div className="perm-text">
                            <div className="perm-label">{perm.label}</div>
                            <div className="perm-description">{pmeta?.description}</div>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleToggle(perm.key); }} className={`toggle-switch ${enabled ? 'enabled' : ''}`}>
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

          <div className="perm-footer">
            <div className="perm-footer-text">Changes apply immediately after saving</div>
            <button onClick={handleSave} className="wf-btn wf-btn--primary">
              <Save size={16} /> Save Permissions
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ ADD ROLE MODAL WITH PERMISSIONS ⭐ */}
      <Modal 
        title="Add New Role & Permissions" 
        open={isAddRoleModalOpen} 
        onCancel={() => setIsAddRoleModalOpen(false)}
        onOk={handleAddRole}
        okText="Create Role"
        width={800}
        okButtonProps={{ style: { backgroundColor: 'var(--primary-red)' } }}
      >
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Role Name Input */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
              Role Name <span style={{ color: 'red' }}>*</span>
            </label>
            <Input 
              placeholder="e.g. Regional Manager" 
              value={newRoleName} 
              onChange={(e) => setNewRoleName(e.target.value)}
              onPressEnter={handleAddRole}
              autoFocus
              size="large"
            />
          </div>

          {/* Permissions Checkboxes */}
          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
              Select Permissions
            </label>
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '16px' }}>
              {groupedPerms.map(group => (
                <div key={group.name} style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
                    {group.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {group.perms.map(perm => (
                      <Checkbox 
                        key={perm.key} 
                        checked={newRolePermissions.includes(perm.key)}
                        onChange={() => handleModalPermissionToggle(perm.key)}
                        style={{ fontSize: '14px', color: '#334155' }}
                      >
                        {perm.label}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Modal>
    </div>
  );
}
