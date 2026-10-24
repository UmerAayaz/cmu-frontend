import { useState } from 'react';
import { Lock, Plus, Trash2, X } from 'lucide-react';
import './ComplaintSetup.css';

export default function ComplaintSetup() {
  // --- Tabs State ---
  const [activeType, setActiveType] = useState('ATM / CDM Issue');
  const [complaintTypes, setComplaintTypes] = useState([
    'ATM / CDM Issue', 'Card Dispute', 'Online Transfer', 
    'Account Operations', 'Cheque Book', 'Loan / Financing', 
    'Staff Complaint', 'Others'
  ]);
  const [isAddingType, setIsAddingType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  // --- Configuration States ---
  const [internalType, setInternalType] = useState('Major');
  const [routingMode, setRoutingMode] = useState('Auto'); // Default Auto as per screenshot

  // --- Issue Details Fields State ---
  const [fields, setFields] = useState([
    { id: 1, label: 'ATM ID / Location', type: 'Text', mandatory: true, attachments: false, allowedFiles: { PDF: true, PNG: true, JPG: true }, options: [] },
    { id: 2, label: 'ATM Belongs To', type: 'Radio Buttons', mandatory: true, attachments: false, allowedFiles: { PDF: true, PNG: true, JPG: true }, options: ['Own Bank', 'Other Bank'] },
    { id: 3, label: 'Transaction Date', type: 'Text', mandatory: true, attachments: false, allowedFiles: { PDF: true, PNG: true, JPG: true }, options: [] },
    { id: 4, label: 'Amount (PKR)', type: 'Text', mandatory: true, attachments: false, allowedFiles: { PDF: true, PNG: true, JPG: true }, options: [] },
    { id: 5, label: 'Complaint Notes', type: 'Toggle Switches', mandatory: false, attachments: true, allowedFiles: { PDF: true, PNG: true, JPG: true }, options: ['Option 1', 'Option 2'] },
  ]);

  // --- Handlers ---
  const handleAddType = () => {
    if (newTypeName.trim() !== '' && !complaintTypes.includes(newTypeName.trim())) {
      const newType = newTypeName.trim();
      setComplaintTypes([...complaintTypes, newType]);
      setActiveType(newType);
      setNewTypeName('');
      setIsAddingType(false);
    }
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(field => field.id === id ? { ...field, [key]: value } : field));
  };

  const toggleFieldProperty = (id, property) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, [property]: !field[property] } : field
    ));
  };

  const toggleFileType = (fieldId, fileType) => {
    setFields(fields.map(field => {
      if (field.id === fieldId) {
        return {
          ...field,
          allowedFiles: {
            ...field.allowedFiles,
            [fileType]: !field.allowedFiles[fileType]
          }
        };
      }
      return field;
    }));
  };

  const handleAddField = () => {
    const newField = {
      id: Date.now(),
      label: 'New Field',
      type: 'Text',
      mandatory: false,
      attachments: false,
      allowedFiles: { PDF: true, PNG: true, JPG: true },
      options: []
    };
    setFields([...fields, newField]);
  };

  const handleDeleteField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const addOption = (fieldId, optionText) => {
    if (!optionText.trim()) return;
    setFields(fields.map(field => {
      if (field.id === fieldId && !field.options.includes(optionText.trim())) {
        return { ...field, options: [...field.options, optionText.trim()] };
      }
      return field;
    }));
  };

  const removeOption = (fieldId, optionToRemove) => {
    setFields(fields.map(field => {
      if (field.id === fieldId) {
        return { ...field, options: field.options.filter(opt => opt !== optionToRemove) };
      }
      return field;
    }));
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Complaint Setup</h1>
        <p className="page-subtitle">Configure auto-fill values and issue detail fields per complaint type.</p>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <span className="tabs-label">Complaint Type:</span>
        
        {complaintTypes.map((type) => (
          <button 
            key={type} 
            className={`tab ${activeType === type ? 'active' : ''}`}
            onClick={() => setActiveType(type)}
          >
            {type}
          </button>
        ))}
        
        {!isAddingType ? (
          <button className="tab add-type-btn" onClick={() => setIsAddingType(true)}>
            + Add Type
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Type name..." 
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
              autoFocus
              style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)', fontSize: '13px', outline: 'none', width: '150px' }}
            />
            <button className="btn-primary" onClick={handleAddType} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px' }}>Add</button>
            <button onClick={() => { setIsAddingType(false); setNewTypeName(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="info-banner">
        <Lock size={16} color="#6b7280" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, marginBottom: '6px', color: '#374151' }}>Standard Sections — Fixed for All Complaint Types</div>
          <div style={{ color: '#6b7280', lineHeight: '1.5' }}>
            <strong>Customer Info</strong> (CNIC, Name, Premier Status, Vulnerable Customer, Account, Card, Contact Details) and <strong>Complaint Info</strong> (Complaint Type, Mode, Channel) are standard and identical across all complaint types.
            They cannot be customized here. Configure the auto-fill values and custom issue fields below.
          </div>
        </div>
      </div>

      {/* Section 1: Auto-fill Configuration */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="section-header">
          <div className="section-number">1</div>
          <h2 className="section-title">AUTO-FILL CONFIGURATION</h2>
          <div className="section-line"></div>
        </div>

        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
          When a user selects <strong>{activeType}</strong> as the complaint type, these fields will auto-populate and be locked in the form.
        </p>

        <div className="grid-2-col">
          <div>
            <label className="input-label">Product <span style={{ color: 'var(--primary-red)' }}>*</span></label>
            <select><option>Digital Banking</option></select>
          </div>
          <div>
            <label className="input-label">Category <span style={{ color: 'var(--primary-red)' }}>*</span></label>
            <input type="text" defaultValue="ATM" />
          </div>
          <div>
            <label className="input-label">Sub-Category</label>
            <input type="text" defaultValue="Transaction Dispute" />
          </div>
          <div>
            <label className="input-label">SBP Complaint Type <span style={{ color: 'var(--primary-red)' }}>*</span></label>
            <select><option>ATM / CDM</option></select>
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label className="input-label">Internal Type <span style={{ color: 'var(--primary-red)' }}>*</span></label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Minor', 'Major', 'Mini Minor', 'Fraud'].map((type) => (
              <button 
                key={type}
                className={`btn-toggle ${internalType === type ? 'active' : ''}`}
                onClick={() => setInternalType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Issue Details Fields */}
      <div className="card" style={{ marginBottom: '24px', padding: '24px 0' }}>
        <div className="section-header" style={{ padding: '0 24px' }}>
          <div className="section-number">2</div>
          <h2 className="section-title">ISSUE DETAILS FIELDS</h2>
          <div className="section-line"></div>
        </div>

        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px', padding: '0 24px' }}>
          These fields appear in the Issue Details section when lodging a <strong>{activeType}</strong> complaint.
        </p>

        {/* Field Table Header */}
        <div className="field-table-header">
          <div style={{ flex: 1 }}>LABEL</div>
          <div style={{ width: '200px' }}>TYPE</div>
          <div style={{ width: '150px', textAlign: 'center' }}>MANDATORY</div>
          <div style={{ width: '150px', textAlign: 'center' }}>ATTACHMENTS</div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Dynamic Fields Mapping */}
        {fields.map((field) => (
          <div className="field-row" key={field.id}>
            <div className="field-main">
              <div style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>
                <input 
                  type="text" 
                  value={field.label} 
                  onChange={(e) => updateField(field.id, 'label', e.target.value)}
                  style={{ border: 'none', background: 'transparent', padding: 0, fontWeight: 500, fontSize: '14px', width: '100%' }}
                />
              </div>
              <div style={{ width: '200px' }}>
                <select 
                  value={field.type} 
                  onChange={(e) => updateField(field.id, 'type', e.target.value)}
                >
                  <option value="Text">Text</option>
                  <option value="Radio Buttons">Radio Buttons</option>
                  <option value="Text Area">Text Area</option>
                  <option value="Toggle Switches">Toggle Switches</option>
                </select>
              </div>
              
              {/* Mandatory Toggle */}
              <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}>
                <div 
                  className={`toggle ${field.mandatory ? 'active' : ''}`} 
                  onClick={() => toggleFieldProperty(field.id, 'mandatory')}
                ></div>
              </div>

              {/* Attachments Toggle */}
              <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}>
                <div 
                  className={`toggle ${field.attachments ? 'active' : ''}`} 
                  onClick={() => toggleFieldProperty(field.id, 'attachments')}
                ></div>
              </div>

              {/* Delete Button */}
              <div style={{ width: '60px', textAlign: 'right', color: '#9ca3af', paddingRight: '16px', cursor: 'pointer' }} onClick={() => handleDeleteField(field.id)}>
                <Trash2 size={16} />
              </div>
            </div>

            <div className="field-rules">
              {/* Radio / Toggle Options Box */}
              {(field.type === 'Radio Buttons' || field.type === 'Toggle Switches') && (
                <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase' }}>
                    {field.type === 'Radio Buttons' ? 'RADIO CHOICES' : 'TOGGLE SWITCHES'}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {field.options.map(opt => (
                      <span key={opt} className="pill">
                        {opt} <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeOption(field.id, opt)} />
                      </span>
                    ))}
                    <input 
                      type="text" 
                      placeholder="Add option, press Enter" 
                      style={{ width: '200px' }} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addOption(field.id, e.target.value);
                          e.target.value = ''; // clear input
                        }
                      }}
                    />
                    <button style={{ background: 'none', border: 'none', color: 'var(--primary-red)', fontWeight: 600, cursor: 'pointer' }}>Add</button>
                  </div>
                </div>
              )}

              {/* Conditional Attachment Options */}
              {field.attachments && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '12px' }}>
                  ALLOWED FILES
                  {['PDF', 'PNG', 'JPG'].map((fileType) => (
                    <label key={fileType} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--primary-red)' }}>
                      <input 
                        type="checkbox" 
                        checked={field.allowedFiles?.[fileType] || false}
                        onChange={() => toggleFileType(field.id, fileType)}
                        style={{ accentColor: 'var(--primary-red)', width: '16px', height: '16px', cursor: 'pointer' }} 
                      />
                      {fileType}
                    </label>
                  ))}
                </div>
              )}

              <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '12px' }}>INPUT RULES</div>
              <div className="rules-grid">
                <div><label className="input-label">Min characters</label><input type="text" /></div>
                <div><label className="input-label">Max characters</label><input type="text" /></div>
                <div><label className="input-label">Allowed</label><select><option>Any characters</option><option>Numbers only</option></select></div>
                <div><label className="input-label">Format</label><input type="text" placeholder="e.g. AAA-9999" /></div>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                Format: 9 = a digit, A = a letter, anything else must match exactly. Leave blank for free text.
              </div>
            </div>
          </div>
        ))}

        <div 
          onClick={handleAddField}
          style={{ padding: '20px 24px 0', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}
        >
          <Plus size={16} /> Add Field
        </div>
      </div>

      {/* Section 3: Routing Configuration */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="section-header">
          <div className="section-number">3</div>
          <h2 className="section-title">ROUTING CONFIGURATION</h2>
          <div className="section-line"></div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>Routing Mode:</span>
          <button 
            className={`btn-toggle ${routingMode === 'Manual' ? 'active' : ''}`} 
            style={{ padding: '8px 24px', flex: 'none' }}
            onClick={() => setRoutingMode('Manual')}
          >
            Manual
          </button>
          <button 
            className={`btn-toggle ${routingMode === 'Auto' ? 'active' : ''}`} 
            style={{ padding: '8px 24px', flex: 'none' }}
            onClick={() => setRoutingMode('Auto')}
          >
            Auto
          </button>

          {/* Route To Dropdown (Only shows when Auto is selected) */}
          {routingMode === 'Auto' && (
            <>
              <span style={{ fontWeight: 500, fontSize: '14px', marginLeft: '16px' }}>Route to:</span>
              <select style={{ width: '250px' }}>
                <option>Select stakeholder group...</option>
                <option>Digital Operations</option>
                <option>Branch Banking</option>
                <option>Consumer Finance</option>
              </select>
            </>
          )}
        </div>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>
          Complaints of this type auto-route to the selected group on lodgment. Only the first routing step can be automated — all subsequent steps require Officer review.
        </p>
      </div>

      {/* Save Button (Normal Flow) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px', boxShadow: '0 4px 6px rgba(216, 44, 44, 0.2)' }}>
          Save Configuration
        </button>
      </div>
    </div>
  );
}