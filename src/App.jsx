import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import ProjectsListPage from './pages/ProjectsListPage';
import CreateProjectWizard from './pages/CreateProjectWizard';
import ProjectDashboard from './pages/ProjectDashboard';
import RolePermissions from './pages/RolePermissions';

// ✅ E-Form separate pages
import FormsListPage from './pages/eform/FormsListPage';
import FormBuilderPage from './pages/eform/FormBuilderPage';
import FieldLibraryPage from './pages/eform/FieldLibraryPage';

import WorkflowsList from './pages/WorkflowsList';
import WorkflowDesigner from './pages/WorkflowDesigner';
import MyTasks from './pages/MyTasks';
import PublishQueue from './pages/PublishQueue';
import LodgeComplaint from './pages/LodgeComplaint';
import CaseDetail from './pages/CaseDetail';
import ComplaintSetup from './pages/ComplaintSetup';
import TeamSetup from './pages/TeamSetup';
import ReportBuilder from './pages/ReportBuilder';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import RCASetup from './pages/RCASetup';
import CaseQueue from './pages/CaseQueue';
import MyCases from './pages/MyCases';
import MyTeam from './pages/MyTeam';
import Lookups from './pages/Lookups';

import { projectsApi } from './api/projects.api';
import { useProjectStore } from './store/projectStore';

function ProjectLayout() {
  const { id } = useParams();
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const activeProject = useProjectStore((s) => s.activeProject);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (project && activeProject?.id !== project.id) setActiveProject(project);
  }, [project, activeProject, setActiveProject]);

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading project...</div>;
  if (!project) return <Navigate to="/projects" replace />;

  return <Outlet />;
}

// ✅ Wrappers for localStorage pages
function FormsListRoute() { const navigate = useNavigate(); return <FormsListPage navigate={navigate} />; }
function FieldLibraryRoute() { const navigate = useNavigate(); return <FieldLibraryPage navigate={navigate} />; }
function FormBuilderRoute({ isNew = false }) {
  const navigate = useNavigate()
  const { formId, id } = useParams() // ✅ id matlab projectId (e.g. 3)
  return (
    <FormBuilderPage
      formId={isNew ? null : formId}
      isNew={isNew}
      navigate={navigate}
      projectId={id} // ✅ Pass projectId to page
    />
  )
}

export default function App() {
  const [userRole, setUserRole] = useState('Super Admin');
  const canCreateProject = userRole === 'Super Admin';

  const activeProject = useProjectStore((s) => s.activeProject);
  const currentTheme = activeProject?.theme || 'red';

  return (
    <BrowserRouter>
      <div className="app-shell" data-project-theme={currentTheme}>
        <Sidebar userRole={userRole} />
        <div className="main-shell">
          <Header userRole={userRole} setUserRole={setUserRole} />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Navigate to="/projects" replace />} />
              <Route path="/projects" element={<ProjectsListPage userRole={userRole} />} />
              <Route path="/projects/create" element={canCreateProject ? <CreateProjectWizard /> : <Navigate to="/projects" replace />} />

              <Route path="/projects/:id" element={<ProjectLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ProjectDashboard />} />
                <Route path="permissions" element={<RolePermissions />} />

                {/* ✅ SEPARATE FORM PAGES (Sahi order mein) */}
                <Route path="forms" element={<FormsListRoute />} />
                <Route path="forms/new" element={<FormBuilderRoute isNew />} />
                <Route path="forms/library" element={<FieldLibraryRoute />} />
                {/* Dynamic route sabse aakhir mein */}
                <Route path="forms/:formId" element={<FormBuilderRoute />} />

                <Route path="workflows" element={<WorkflowsList />} />
                <Route path="workflows/new" element={<WorkflowDesigner />} />
                <Route path="workflows/:workflowId/designer" element={<WorkflowDesigner />} />
                <Route path="team-setup" element={<TeamSetup />} />
                <Route path="my-tasks" element={<MyTasks />} />
                <Route path="my-cases" element={<MyCases />} />
                <Route path="case-queue" element={<CaseQueue />} />
                <Route path="publish-queue" element={<PublishQueue />} />
                <Route path="lodge-complaint" element={<LodgeComplaint />} />
                <Route path="cases/:caseId" element={<CaseDetail />} />
                <Route path="complaint-setup" element={<ComplaintSetup />} />
                <Route path="my-team" element={<MyTeam />} />
                <Route path="report-builder" element={<ReportBuilder />} />
                <Route path="reports" element={<Reports />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="rca-setup" element={<RCASetup />} />
                <Route path="lookups" element={<Lookups />} />
              </Route>

              <Route path="*" element={<Navigate to="/projects" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}