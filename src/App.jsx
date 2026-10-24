import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LodgeComplaint from './pages/LodgeComplaint';
import ComplaintSetup from './pages/ComplaintSetup';
import TeamSetup from './pages/TeamSetup';
import ReportBuilder from './pages/ReportBuilder';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import RCASetup from './pages/RCASetup';
import CaseQueue from './pages/CaseQueue';
import MyCases from './pages/MyCases';
import MyTeam from './pages/MyTeam'; // <-- Import MyTeam

export default function App() {
  const [userRole, setUserRole] = useState('System Admin');

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar userRole={userRole} />
        <div className="main-content">
          <Header userRole={userRole} setUserRole={setUserRole} />
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/lodge-complaint" />} />
              <Route path="/lodge-complaint" element={<LodgeComplaint />} />
              <Route path="/complaint-setup" element={<ComplaintSetup />} />
              <Route path="/team-setup" element={<TeamSetup />} />
              <Route path="/report-builder" element={<ReportBuilder />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/rca-setup" element={<RCASetup />} />
              
              {/* Routes for Team Lead & Officers */}
              <Route path="/case-queue" element={<CaseQueue />} />
              <Route path="/my-cases" element={<MyCases />} />
              <Route path="/my-team" element={<MyTeam />} /> {/* <-- My Team Route Add */}

              <Route path="*" element={<div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Page Under Construction</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}