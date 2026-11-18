import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { App as AntApp } from 'antd';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import ProjectsListPage from './pages/ProjectsListPage';
import ProjectDashboard from './pages/ProjectDashboard';
import RolePermissions from './pages/RolePermission/RolePermission';

// 👇 1. Purana CreateProjectWizard hata kar naya OnboardProject import kiya
import OnboardProject from './pages/OnboardProject/OnboardProject';

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

import BusinessCalendar from './pages/BusinessCalendar/BusinessCalendar';

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

function FormsListRoute() { const navigate = useNavigate(); return <FormsListPage navigate={navigate} />; }
function FieldLibraryRoute() { const navigate = useNavigate(); return <FieldLibraryPage navigate={navigate} />; }
function FormBuilderRoute({ isNew = false }) {
  const navigate = useNavigate()
  const { formId, id } = useParams() 
  return (
    <FormBuilderPage
      formId={isNew ? null : formId}
      isNew={isNew}
      navigate={navigate}
      projectId={id} 
    />
  )
}

export default function App() {
  const [userRole, setUserRole] = useState('Super Admin');
  const canCreateProject = userRole === 'Super Admin';

  const activeProject = useProjectStore((s) => s.activeProject);
  const currentTheme = activeProject?.theme || 'red';

  return (
    <AntApp>
      <BrowserRouter>
        <div className="app-shell" data-project-theme={currentTheme}>
          <Sidebar userRole={userRole} />
          <div className="main-shell">
            <Header userRole={userRole} setUserRole={setUserRole} />
            <div className="content-area">
              <Routes>
                <Route path="/" element={<Navigate to="/projects" replace />} />
                <Route path="/projects" element={<ProjectsListPage userRole={userRole} />} />
                
                {/* 👇 2. Yahan route mein OnboardProject call kiya */}
                <Route path="/projects/create" element={canCreateProject ? <OnboardProject /> : <Navigate to="/projects" replace />} />

                <Route path="/projects/:id" element={<ProjectLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<ProjectDashboard />} />
                  <Route path="permissions" element={<RolePermissions />} />

                  <Route path="forms" element={<FormsListRoute />} />
                  <Route path="forms/new" element={<FormBuilderRoute isNew />} />
                  <Route path="forms/library" element={<FieldLibraryRoute />} />
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
                  
                  <Route path="business-calendar" element={<BusinessCalendar />} />
                </Route>

                <Route path="*" element={<Navigate to="/projects" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </AntApp>
  );
}