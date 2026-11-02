export const ALL_PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'forms', label: 'Forms' },
  { key: 'workflows', label: 'Workflows' },
  { key: 'fieldLibrary', label: 'Field Library' },
  { key: 'teamSetup', label: 'Team Setup' },
  { key: 'myTasks', label: 'My Tasks' },
  { key: 'myCases', label: 'My Cases' },
  { key: 'caseQueue', label: 'Case Queue' },
  { key: 'publishQueue', label: 'Publish Queue' },
  { key: 'lodgeComplaint', label: 'Lodge Complaint' },
  { key: 'complaintSetup', label: 'Complaint Setup' },
  { key: 'myTeam', label: 'My Team' },
  { key: 'reportBuilder', label: 'Report Builder' },
  { key: 'reports', label: 'Reports' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'rcaSetup', label: 'RCA Setup' },
];

export const ROLES = [
  'Super Admin',
  'System Admin',
  'Team Lead',
  'Case Officer',
  'Stakeholder',
  'Reporter',
  'Complaint Lodger'
];

// Default Permissions (Agar Super Admin kuch change nahi karta)
export const DEFAULT_PERMISSIONS = {
  'Super Admin': ALL_PERMISSIONS.map(p => p.key), // Sab kuch
  'System Admin': ALL_PERMISSIONS.map(p => p.key), // Sab kuch
  'Team Lead': ['dashboard', 'teamSetup', 'myTasks', 'myCases', 'caseQueue', 'myTeam', 'lodgeComplaint', 'reports', 'notifications'],
  'Case Officer': ['dashboard', 'myTasks', 'myCases', 'caseQueue', 'lodgeComplaint', 'notifications'],
  'Stakeholder': ['dashboard', 'myCases', 'lodgeComplaint', 'notifications'],
  'Reporter': ['dashboard', 'lodgeComplaint', 'reports', 'notifications'],
  'Complaint Lodger': ['dashboard', 'lodgeComplaint']
};

export const getPermissions = () => {
  const stored = localStorage.getItem('role_permissions');
  return stored ? JSON.parse(stored) : DEFAULT_PERMISSIONS;
};

export const savePermissions = (perms) => {
  localStorage.setItem('role_permissions', JSON.stringify(perms));
};