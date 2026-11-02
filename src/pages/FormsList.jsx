import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Play, Plus, Trash2, GripVertical, Search } from 'lucide-react';
import { formsApi } from '../api/forms.api';
import '../styles/workflow-module.css';

export default function FormBuilder() {
  const { id, formId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // States
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // ⭐ Search State

  // 1. Field Library se saare fields uthayen
  const { data: fieldData, isLoading: isLoadingFields } = useQuery({
    queryKey: ['field-library'],
    queryFn: formsApi.listFields,
  });

  const availableFields = fieldData?.items || [];

  // ⭐ Search ke hisaab se fields filter karein
  const filteredFields = availableFields.filter(field => 
    field.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    field.fieldType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. Form Save karne ka mutation
  const createMutation = useMutation({
    mutationFn: formsApi.createForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast.success('Form created successfully!');
      navigate(`/projects/${id}/forms`);
    },
    onError: () => toast.error('Failed to create form'),
  });

  const handleSave = () => {
    if (!formName.trim()) return toast.error('Form Name is required');
    if (selectedFields.length === 0) return toast.error('Please add at least one field to the form');

    createMutation.mutate({ 
      name: formName,
      description: formDesc,
      fields: selectedFields 
    });
  };

  // Field add/remove functions
  const addField = (field) => {
    if (selectedFields.find(f => f.id === field.id)) {
      return toast.error('Field already added to form');
    }
    setSelectedFields([...selectedFields, field]);
  };

  const removeField = (fieldId) => {
    setSelectedFields(selectedFields.filter(f => f.id !== fieldId));
  };

  return (
    <div className="wf-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── Top Header ── */}
      <div className="wf-header" style={{ flexShrink: 0 }}>
        <div>
          <button onClick={() => navigate(`/projects/${id}/forms`)} className="wf-btn wf-btn--ghost" style={{ marginBottom: 8, paddingLeft: 0 }}>
            <ArrowLeft size={14} /> Back to Forms
          </button>
          <h1 className="wf-title">{formId ? 'Edit Form' : 'Create New Form'}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="wf-btn wf-btn--secondary"><Play size={16} /> Preview</button>
          <button onClick={handleSave} disabled={createMutation.isPending} className="wf-btn wf-btn--primary">
            <Save size={16} /> {createMutation.isPending ? 'Saving...' : 'Save Form'}
          </button>
        </div>
      </div>

      {/* ── Main Builder Area ── */}
      <div style={{ display: 'flex', gap: 20, flex: 1, minHeight: 0 }}>
        
        {/* ⭐ LEFT SIDE: Field Library (With Search) */}
        <div className="wf-card" style={{ width: 320, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ padding: 16, borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 12 }}>Field Library</h3>
            <div className="wf-search" style={{ minWidth: '100%' }}>
              <Search size={16} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fields by name..."
              />
            </div>
          </div>

          <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
            {isLoadingFields ? (
              <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', marginTop: 20 }}>Loading fields...</p>
            ) : filteredFields.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', marginTop: 20 }}>
                {searchQuery ? 'No fields match your search.' : 'No fields found. Add fields in Field Library first.'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredFields.map(field => (
                  <div 
                    key={field.id} 
                    onClick={() => addField(field)}
                    style={{ 
                      padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: 8, 
                      cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: '#fff', transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-red)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{field.label}</div>
                      <div style={{ fontSize: 11, color: '#64748B', textTransform: 'capitalize' }}>{field.fieldType}</div>
                    </div>
                    <Plus size={16} color="var(--primary-red)" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ⭐ RIGHT SIDE: Form Layout (Canvas) */}
        <div className="wf-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
           
           {/* Form Settings (Name & Description) */}
           <div style={{ padding: 20, borderBottom: '1px solid #E2E8F0', background: '#fff', display: 'flex', gap: 16 }}>
             <div style={{ flex: 1 }}>
               <label className="wf-label">Form Name <span className="wf-label__req">*</span></label>
               <input 
                 className="wf-input" 
                 value={formName} 
                 onChange={(e) => setFormName(e.target.value)} 
                 placeholder="e.g. Incident Report Form" 
               />
             </div>
             <div style={{ flex: 1 }}>
               <label className="wf-label">Description</label>
               <input 
                 className="wf-input" 
                 value={formDesc} 
                 onChange={(e) => setFormDesc(e.target.value)} 
                 placeholder="Brief description of this form..." 
               />
             </div>
           </div>

           {/* Canvas Area */}
           <div style={{ flex: 1, background: '#F8FAFC', display: 'flex', flexDirection: 'column', padding: 24, overflowY: 'auto' }}>
             <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Form Layout</h3>
             
             {selectedFields.length === 0 ? (
               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #CBD5E1', borderRadius: 12, color: '#94A3B8', margin: '0 auto', width: '100%', maxWidth: 600 }}>
                 <p>Click fields from the left panel to add them here.</p>
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 700, margin: '0 auto', width: '100%' }}>
                 {selectedFields.map((field, index) => (
                   <div key={field.id} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
                      
                      {/* Drag Handle */}
                      <div style={{ cursor: 'grab', color: '#CBD5E1', marginTop: 2 }}>
                        <GripVertical size={16} />
                      </div>

                      {/* Field Preview */}
                      <div style={{ flex: 1 }}>
                        <label className="wf-label" style={{ fontSize: 13, marginBottom: 4, display: 'block' }}>
                          {field.label} {field.required && <span style={{ color: '#DC2626' }}>*</span>}
                        </label>
                        
                        {['text', 'number', 'date'].includes(field.fieldType) && (
                          <input type={field.fieldType} className="wf-input" disabled style={{ background: '#F8FAFC' }} placeholder={`Enter ${field.label}`} />
                        )}
                        {field.fieldType === 'textarea' && (
                          <textarea className="wf-textarea" disabled style={{ background: '#F8FAFC' }} placeholder={`Enter ${field.label}`} />
                        )}
                        {field.fieldType === 'dropdown' && (
                          <select className="wf-select" disabled style={{ background: '#F8FAFC' }}>
                            <option>Select option...</option>
                          </select>
                        )}
                        {field.fieldType === 'file' && (
                          <div style={{ padding: 10, border: '1px dashed #CBD5E1', borderRadius: 6, textAlign: 'center', fontSize: 12, color: '#64748B' }}>
                            File Upload Area
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeField(field.id)}
                        style={{ background: '#FEE2E2', border: 'none', padding: 6, borderRadius: 6, cursor: 'pointer', color: '#DC2626' }}
                        title="Remove Field"
                      >
                        <Trash2 size={14} />
                      </button>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}