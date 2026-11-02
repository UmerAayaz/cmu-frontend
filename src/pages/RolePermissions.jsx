import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { ALL_PERMISSIONS, ROLES, getPermissions, savePermissions } from '../utils/permissions';
import '../styles/workflow-module.css';

export default function RolePermissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    setPermissions(getPermissions());
  }, []);

  const handleToggle = (role, permKey) => {
    setPermissions((prev) => {
      const rolePerms = prev[role] || [];
      const hasPerm = rolePerms.includes(permKey);
      
      const newRolePerms = hasPerm 
        ? rolePerms.filter(k => k !== permKey)
        : [...rolePerms, permKey];

      return { ...prev, [role]: newRolePerms };
    });
  };

  const handleSave = () => {
    savePermissions(permissions);
    toast.success('Permissions saved successfully!');
  };

  return (
    <div className="wf-page">
      <div className="wf-header">
        <div>
          <button onClick={() => navigate(`/projects/${id}/dashboard`)} className="wf-btn wf-btn--ghost" style={{ marginBottom: 8, paddingLeft: 0 }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="wf-title">Role Permissions</h1>
          <p className="wf-subtitle">Assign which features each role can access in this project</p>
        </div>
        <button onClick={handleSave} className="wf-btn wf-btn--primary">
          <Save size={16} /> Save Permissions
        </button>
      </div>

      <div className="wf-card" style={{ overflowX: 'auto' }}>
        <table className="wf-table" style={{ minWidth: 800 }}>
          <thead>
            <tr>
              <th style={{ width: 200 }}>Role \ Feature</th>
              {ALL_PERMISSIONS.map((p) => (
                <th key={p.key} style={{ textAlign: 'center', fontSize: 11 }}>{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map((role) => (
              <tr key={role}>
                <td style={{ fontWeight: 600, color: '#0F172A' }}>{role}</td>
                {ALL_PERMISSIONS.map((p) => {
                  const isChecked = (permissions[role] || []).includes(p.key);
                  return (
                    <td key={p.key} style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggle(role, p.key)}
                        style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--primary-red)' }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
