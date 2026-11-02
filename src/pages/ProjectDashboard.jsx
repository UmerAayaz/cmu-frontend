import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, GitBranch, Users, Send, ArrowLeft } from 'lucide-react';
import { projectsApi } from '../api/projects.api';
import '../styles/workflow-module.css';

export default function ProjectDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id),
  });

  if (isLoading) {
    return <div className="wf-page"><div className="wf-card" style={{ padding: 40 }}>Loading project…</div></div>;
  }

  if (!project) {
    return (
      <div className="wf-page">
        <div className="wf-card" style={{ padding: 40, textAlign: 'center' }}>
          <p>Project not found</p>
          <Link to="/projects" className="wf-btn wf-btn--primary" style={{ marginTop: 12 }}>
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wf-page" data-project-theme={project.theme}>
      <div className="wf-header">
        <div>
          <button
            className="wf-btn wf-btn--ghost"
            onClick={() => navigate('/projects')}
            style={{ marginBottom: 6, paddingLeft: 0 }}
          >
            <ArrowLeft size={14} /> All Projects
          </button>
          <h1 className="wf-title">{project.name}</h1>
          <p className="wf-subtitle">
            <span className="wf-key-tag" style={{ marginRight: 8 }}>{project.code}</span>
            {project.description || 'Project dashboard'}
          </p>
        </div>
        <span className="wf-badge wf-badge--success">{project.status}</span>
      </div>

      <div className="wf-stat-grid">
        <StatCard label="Forms" value={project.formsCount ?? 0} icon={<FileText size={20} />} color="#16A34A" />
        <StatCard label="Workflows" value={project.workflowsCount ?? 0} icon={<GitBranch size={20} />} color="#7C3AED" />
        <StatCard label="Teams" value={project.teamsCount ?? 0} icon={<Users size={20} />} color="#1E40AF" />
        <StatCard label="Pending Review" value={0} icon={<Send size={20} />} color="#D97706" />
      </div>

      {/* Quick Actions Removed as requested */}

      <div className="wf-card" style={{ padding: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 16, fontSize: 18 }}>Recent Activity</h2>
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
          No activity yet
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="wf-stat">
      <div>
        <div className="wf-stat__label">{label}</div>
        <div className="wf-stat__value">{value}</div>
      </div>
      <div className="wf-stat__icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
    </div>
  );
}