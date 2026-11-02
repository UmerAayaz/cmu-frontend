import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Play } from 'lucide-react';
import { workflowsApi } from '../api/workflows.api';
import '../styles/workflow-module.css';

export default function WorkflowDesigner() {
  const { id, workflowId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [flowName, setFlowName] = useState('');

  const createMutation = useMutation({
    mutationFn: workflowsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow created successfully');
      navigate(`/projects/${id}/workflows`);
    },
    onError: () => toast.error('Failed to create workflow'),
  });

  const handleSave = () => {
    if (!flowName.trim()) return toast.error('Workflow Name is required');
    createMutation.mutate({ name: flowName });
  };

  return (
    <div className="wf-page">
      <div className="wf-header">
        <div>
          <button onClick={() => navigate(`/projects/${id}/workflows`)} className="wf-btn wf-btn--ghost" style={{ marginBottom: 8, paddingLeft: 0 }}>
            <ArrowLeft size={14} /> Back to Workflows
          </button>
          <h1 className="wf-title">{workflowId ? 'Edit Workflow' : 'Create Workflow'}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="wf-btn wf-btn--secondary"><Play size={16} /> Simulate</button>
          <button onClick={handleSave} disabled={createMutation.isPending} className="wf-btn wf-btn--primary">
            <Save size={16} /> {createMutation.isPending ? 'Saving...' : 'Save Workflow'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, height: '65vh' }}>
         <div className="wf-card" style={{ width: 260, padding: 16 }}>
          <h3 style={{ fontSize: 14, marginBottom: 12 }}>Workflow Details</h3>
          <div className="wf-field">
            <label className="wf-label">Workflow Name <span className="wf-label__req">*</span></label>
            <input 
              className="wf-input" 
              value={flowName} 
              onChange={(e) => setFlowName(e.target.value)} 
              placeholder="e.g. Approval Flow" 
            />
          </div>
        </div>
        <div className="wf-card" style={{ flex: 1, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <p style={{ color: '#94A3B8' }}>React Flow Canvas (Designer goes here)</p>
        </div>
      </div>
    </div>
  );
}