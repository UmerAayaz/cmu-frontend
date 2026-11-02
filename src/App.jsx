import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Platform Level Pages
import ProjectsListPage from './pages/ProjectsListPage';
import CreateProjectWizard from './pages/CreateProjectWizard';

// Project Level Pages (Common / Builder)
import ProjectDashboard from './pages/ProjectDashboard';
import RolePermissions from './pages/RolePermissions';
import FormsList from './pages/FormsList';
import FormBuilder from './pages/FormBuilder';
import FieldLibrary from './pages/FieldLibrary';
import WorkflowsList from './pages/WorkflowsList';
import WorkflowDesigner from './pages/WorkflowDesigner';
import MyTasks from './pages/MyTasks';
import PublishQueue from './pages/PublishQueue';

// Project Level Pages (CMU Legacy / Operations)
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

// API & Store
import { projectsApi } from './api/projects.api';
import { useProjectStore } from './store/projectStore';

// ⭐ Wrapper for Project Scoped Routes
function ProjectLayout() {
  const { id } = useParams();
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const activeProject = useProjectStore((s) => s.activeProject);

  // Fetch project details from mock API
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.get(id),
    enabled: !!id,
  });

  // Set the project in Zustand store so Sidebar/Header can read it
  useEffect(() => {
    if (project && activeProject?.id !== project.id) {
      setActiveProject(project);
    }
  }, [project, activeProject, setActiveProject]);

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>Loading project...</div>;
  }
  
  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return <Outlet />;
}

export default function App() {
  // Global User Role State (Header dropdown se change hota hai)
  const [userRole, setUserRole] = useState('Super Admin');
  
  // Check if user has permission to create projects
  const canCreateProject = userRole === 'Super Admin';

  // Active project theme
  const activeProject = useProjectStore((s) => s.activeProject);
  const currentTheme = activeProject?.theme || 'red'; // default fallback

  return (
    <BrowserRouter>
      <div className="app-container" data-project-theme={currentTheme}>
        <Sidebar userRole={userRole} />
        
        <div className="main-content">
          <Header userRole={userRole} setUserRole={setUserRole} />
          
          <div className="page-wrapper">
            <Routes>
              {/* ─── Platform Level Routes ─── */}
              <Route path="/" element={<Navigate to="/projects" replace />} />
              
              <Route 
                path="/projects" 
                element={<ProjectsListPage userRole={userRole} />} 
              />
              
              <Route 
                path="/projects/create" 
                element={
                  canCreateProject ? (
                    <CreateProjectWizard />
                  ) : (
                    <Navigate to="/projects" replace />
                  )
                } 
              />

              {/* ─── Project Scoped Routes (Nested) ─── */}
              <Route path="/projects/:id" element={<ProjectLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                
                {/* Dashboard & Admin */}
                <Route path="dashboard" element={<ProjectDashboard />} />
                <Route path="permissions" element={<RolePermissions />} />
                
                {/* Common Builder Features */}
                <Route path="forms" element={<FormsList />} />
                <Route path="forms/new" element={<FormBuilder />} />
                <Route path="forms/:formId/builder" element={<FormBuilder />} />
                <Route path="forms/field-library" element={<FieldLibrary />} />
                
                <Route path="workflows" element={<WorkflowsList />} />
                <Route path="workflows/new" element={<WorkflowDesigner />} />
                <Route path="workflows/:workflowId/designer" element={<WorkflowDesigner />} />
                
                {/* Operations & Cases */}
                <Route path="team-setup" element={<TeamSetup />} />
                <Route path="my-tasks" element={<MyTasks />} />
                <Route path="my-cases" element={<MyCases />} />
                <Route path="case-queue" element={<CaseQueue />} />
                <Route path="publish-queue" element={<PublishQueue />} />
                
                {/* CMU Legacy / Management Features */}
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

              {/* ─── Fallback (Unknown Routes) ─── */}
              <Route path="*" element={<Navigate to="/projects" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}