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
  { key: 'myTeam', label: 'My Team' },
  { key: 'reportBuilder', label: 'Report Builder' },
  { key: 'reports', label: 'Reports' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'rcaSetup', label: 'RCA Setup' },
  { key: 'businessCalendar', label: 'Business Calendar' }, 
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
  'Team Lead': ['dashboard', 'teamSetup', 'myCases', 'caseQueue', 'myTeam', 'lodgeComplaint', 'reports', 'notifications'],
  'Case Officer': ['dashboard', 'myCases', 'caseQueue', 'lodgeComplaint', 'notifications'],
  'Stakeholder': ['dashboard', 'myCases', 'lodgeComplaint', 'notifications'],
  'Reporter': ['dashboard', 'lodgeComplaint', 'reports', 'notifications'],
  'Complaint Lodger': ['dashboard', 'lodgeComplaint']
};

export const getPermissions = () => {
  const stored = localStorage.getItem('role_permissions');
  if (!stored) return DEFAULT_PERMISSIONS;

  try {
    const parsed = JSON.parse(stored);
    const validKeys = ALL_PERMISSIONS.map(p => p.key);
    const sanitizedPermissions = {};

    // Har role ke permissions ko check karein aur sirf valid keys rakhein
    // Isse localStorage mein pari purani keys (jaise myTasks) khud nikal jayengi
    Object.keys(parsed).forEach(role => {
      if (Array.isArray(parsed[role])) {
        sanitizedPermissions[role] = parsed[role].filter(key => validKeys.includes(key));
      } else {
        sanitizedPermissions[role] = DEFAULT_PERMISSIONS[role] || [];
      }
    });

    return sanitizedPermissions;
  } catch (error) {
    console.error("Error parsing permissions from localStorage", error);
    return DEFAULT_PERMISSIONS;
  }
};

export const savePermissions = (perms) => {
  localStorage.setItem('role_permissions', JSON.stringify(perms));
};