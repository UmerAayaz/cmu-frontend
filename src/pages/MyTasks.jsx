import { useParams } from 'react-router-dom';
import { Inbox, ArrowRight, Clock } from 'lucide-react';
import '../styles/workflow-module.css';

export default function MyTasks() {
  const { id } = useParams();

  // Mock Tasks: Jo workflow ne assign kiye hain
  const myTasks = [
    { id: 101, title: 'Approve Loan Request', caseNo: 'CMP-2026-0041', stage: 'Manager Approval', sla: '2h 15m', priority: 'High' },
    { id: 102, title: 'Verify Customer CNIC', caseNo: 'CMP-2026-0042', stage: 'Data Entry', sla: '5h 30m', priority: 'Normal' },
  ];

  return (
    <div className="wf-page">
      <div className="wf-header">
        <div>
          <h1 className="wf-title">My Tasks</h1>
          <p className="wf-subtitle">Workflow tasks assigned to you</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {myTasks.length === 0 ? (
          <div className="wf-card" style={{ padding: 60, textAlign: 'center' }}>
            <Inbox size={40} style={{ margin: '0 auto 12px', color: '#94A3B8' }} />
            <h3 style={{ margin: 0, fontSize: 16 }}>All caught up!</h3>
            <p style={{ color: '#64748B', fontSize: 14 }}>You have no pending tasks right now.</p>
          </div>
        ) : (
          myTasks.map(task => (
            <div key={task.id} className="wf-card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <span className="wf-badge wf-badge--warning">{task.stage}</span>
                  <span className="wf-key-tag">{task.caseNo}</span>
                </div>
                <h3 style={{ margin: 0, fontSize: 16, color: '#0F172A' }}>{task.title}</h3>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748B', marginTop: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> SLA: {task.sla}</span>
                  <span>Priority: {task.priority}</span>
                </div>
              </div>
              <button className="wf-btn wf-btn--primary">
                Open Task <ArrowRight size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}