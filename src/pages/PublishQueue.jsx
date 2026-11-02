import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, FileText, GitBranch } from 'lucide-react';
import '../styles/workflow-module.css';

export default function PublishQueue() {
  const { id } = useParams();

  // Mock items waiting for approval
  const pendingItems = [
    { id: 1, type: 'Form', name: 'Escalation Form v1.0', submittedBy: 'Sara (Team Lead)', date: '2 hours ago' },
    { id: 2, type: 'Workflow', name: 'High Priority Flow v2.1', submittedBy: 'Ali (System Admin)', date: '1 day ago' },
  ];

  return (
    <div className="wf-page">
      <div className="wf-header">
        <div>
          <h1 className="wf-title">Publish Queue</h1>
          <p className="wf-subtitle">Review and approve forms/workflows before they go live</p>
        </div>
      </div>

      <div className="wf-table-wrap">
        <table className="wf-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Submitted By</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingItems.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.type === 'Form' ? <FileText size={16} color="#16A34A" /> : <GitBranch size={16} color="#7C3AED" />}
                  <span style={{ marginLeft: 8 }}>{item.type}</span>
                </td>
                <td style={{ fontWeight: 500 }}>{item.name}</td>
                <td style={{ color: '#64748B' }}>{item.submittedBy}</td>
                <td style={{ color: '#64748B', fontSize: 13 }}>{item.date}</td>
                <td>
                  <div className="wf-table__actions">
                    <button className="wf-btn wf-btn--ghost" style={{ color: '#16A34A' }}><CheckCircle size={16} /> Approve</button>
                    <button className="wf-btn wf-btn--ghost" style={{ color: '#DC2626' }}><XCircle size={16} /> Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}