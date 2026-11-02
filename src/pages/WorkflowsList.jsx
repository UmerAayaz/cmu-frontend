import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, GitBranch, Eye, History } from 'lucide-react';
import { workflowsApi } from '../api/workflows.api';
import '../styles/workflow-module.css';

export default function WorkflowsList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: workflowsApi.list,
  });

  const workflows = data?.items || [];

  return (
    <div className="wf-page">
      <div className="wf-header">
        <div>
          <h1 className="wf-title">Workflows</h1>
          <p className="wf-subtitle">Design and manage business process flows</p>
        </div>
        <button onClick={() => navigate(`/projects/${id}/workflows/new`)} className="wf-btn wf-btn--primary">
          <Plus size={16} /> Create Workflow
        </button>
      </div>

      <div className="wf-toolbar">
        <div className="wf-search">
          <Search size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search workflows..." />
        </div>
      </div>

      <div className="wf-table-wrap">
        <table className="wf-table">
          <thead>
            <tr>
              <th>Workflow Name</th>
              <th>Version</th>
              <th>Nodes</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="wf-table__empty">Loading workflows...</td></tr>
            ) : workflows.length === 0 ? (
              <tr><td colSpan="6" className="wf-table__empty">No workflows created yet. Click "Create Workflow" to start.</td></tr>
            ) : (
              workflows.map((w) => (
                <tr key={w.id}>
                  <td style={{ fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <GitBranch size={16} color="#7C3AED" /> {w.name}
                    </div>
                  </td>
                  <td><span className="wf-key-tag">{w.version}</span></td>
                  <td style={{ color: '#64748B' }}>{w.nodes} steps</td>
                  <td><span className={`wf-badge ${w.status === 'Published' ? 'wf-badge--success' : 'wf-badge--warning'}`}>{w.status}</span></td>
                  <td style={{ color: '#64748B', fontSize: 13 }}>{w.updated}</td>
                  <td>
                    <div className="wf-table__actions" style={{ gap: 8 }}>
                      <button className="wf-btn wf-btn--ghost" style={{ fontSize: 12 }} title="Create New Version">
                        <History size={14} /> New Version
                      </button>
                      <button onClick={() => navigate(`/projects/${id}/workflows/${w.id}/designer`)} className="wf-btn wf-btn--secondary" style={{ fontSize: 12, padding: '4px 10px' }}>
                        <Eye size={14} /> Open
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}