import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { projectsApi } from '../api/projects.api';
import { useProjectStore } from '../store/projectStore';
import '../styles/workflow-module.css';

export default function ProjectsListPage({ userRole = 'System Admin' }) {
  const [search, setSearch] = useState('');
  const clearProject = useProjectStore((s) => s.clear);

  // Clear any active project when landing on the list
  useEffect(() => {
    clearProject();
  }, [clearProject]);

  const { data, isLoading } = useQuery({
    queryKey: ['projects', { search }],
    queryFn: () => projectsApi.list({ search }),
  });

  // Only Super Admin can create new projects
  const canCreate = userRole === 'Super Admin';

  return (
    <div className="wf-page">
      <div className="wf-header">
        <div>
          <h1 className="wf-title">Projects</h1>
          <p className="wf-subtitle">
            {canCreate
              ? 'All projects across the platform'
              : 'Projects you have access to'}
          </p>
        </div>
        {canCreate && (
          <Link to="/projects/create" className="wf-btn wf-btn--primary">
            <Plus size={16} /> Create Project
          </Link>
        )}
      </div>

      <div className="wf-toolbar">
        <div className="wf-search">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name or code…"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="wf-table-wrap">
          <div className="wf-table__empty">Loading…</div>
        </div>
      ) : !data?.items?.length ? (
        <div className="wf-table-wrap">
          <div className="wf-empty">
            <div className="wf-empty__icon"><FolderKanban size={40} /></div>
            <div className="wf-empty__title">No projects yet</div>
            <div className="wf-empty__msg">
              {canCreate
                ? 'Create your first project to get started'
                : 'No projects have been shared with you yet'}
            </div>
            {canCreate && (
              <Link to="/projects/create" className="wf-btn wf-btn--primary">
                <Plus size={16} /> Create Project
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="wf-projects">
          {data.items.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}/dashboard`}
              className="wf-project-card"
            >
              <div className="wf-project-card__head">
                <div
                  className="wf-project-card__icon"
                  style={{ background: getThemeColor(p.theme) }}
                >
                  <FolderKanban size={20} />
                </div>
                <span className="wf-badge wf-badge--success">{p.status}</span>
              </div>
              <div className="wf-project-card__name">{p.name}</div>
              <div className="wf-project-card__code">{p.code}</div>
              <div className="wf-project-card__meta">
                <span>Forms: {p.formsCount ?? 0}</span>
                <span>Teams: {p.teamsCount ?? 0}</span>
                <span>Flows: {p.workflowsCount ?? 0}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function getThemeColor(key) {
  const map = {
    blue: '#1E40AF', red: '#DC2626', purple: '#7C3AED', teal: '#0F766E',
    amber: '#D97706', emerald: '#059669', rose: '#E11D48', slate: '#475569',
  };
  return map[key] || '#1E40AF';
}