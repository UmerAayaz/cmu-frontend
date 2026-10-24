import { Lock, Plus, Trash2 } from 'lucide-react';
import './ComplaintSetup.css'

export default function ComplaintSetup() {
  const complaintTypes = ['ATM / CDM Issue', 'Card Dispute', 'Online Transfer', 'Account Operations', 'Cheque Book', 'Loan / Financing', 'Staff Complaint', 'Others', '+ Add Type'];

  return (
    <div style={{ paddingBottom: '80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Complaint Setup</h1>
        <p className="page-subtitle">Configure auto-fill values and issue detail fields per complaint type.</p>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <span style={{ fontWeight: 600, marginRight: '12px', fontSize: '14px' }}>Complaint Type:</span>
        {complaintTypes.map((type, index) => (
          <button key={type} className={index === 0 ? 'tab active' : 'tab'}>
            {type}
          </button>
        ))}
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
          When a user selects <strong>ATM / CDM Issue</strong> as the complaint type, these fields will auto-populate and be locked in the form.
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
            <button className="btn-toggle">Minor</button>
            <button className="btn-toggle active">Major</button>
            <button className="btn-toggle">Mini Minor</button>
            <button className="btn-toggle">Fraud</button>
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
          These fields appear in the Issue Details section when lodging a <strong>ATM / CDM Issue</strong> complaint. Common examples: card number, branch name, transaction reference, complaint notes.
        </p>

        {/* Field Table Header */}
        <div className="field-table-header">
          <div style={{ flex: 1 }}>LABEL</div>
          <div style={{ width: '200px' }}>TYPE</div>
          <div style={{ width: '150px', textAlign: 'center' }}>MANDATORY</div>
          <div style={{ width: '150px', textAlign: 'center' }}>ATTACHMENTS</div>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Field 1 */}
        <div className="field-row">
          <div className="field-main">
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>ATM ID / Location</div>
            <div style={{ width: '200px' }}><select><option>Text</option></select></div>
            <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}><div className="toggle active"></div></div>
            <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}><div className="toggle"></div></div>
            <div style={{ width: '60px', textAlign: 'right', color: '#9ca3af', paddingRight: '16px' }}><Trash2 size={16} /></div>
          </div>
          <div className="field-rules">
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '12px' }}>INPUT RULES — none, any input accepted</div>
            <div className="rules-grid">
              <div><label className="input-label">Min characters</label><input type="text" /></div>
              <div><label className="input-label">Max characters</label><input type="text" /></div>
              <div><label className="input-label">Allowed</label><select><option>Any characters</option></select></div>
              <div><label className="input-label">Format</label><input type="text" placeholder="e.g. AAA-9999" /></div>
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>Format: 9 = a digit, A = a letter, anything else must match exactly. Leave blank for free text.</div>
          </div>
        </div>

        {/* Field 2 */}
        <div className="field-row">
          <div className="field-main">
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>ATM Belongs To</div>
            <div style={{ width: '200px' }}><select><option>Radio Buttons</option></select></div>
            <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}><div className="toggle active"></div></div>
            <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}><div className="toggle"></div></div>
            <div style={{ width: '60px', textAlign: 'right', color: '#9ca3af', paddingRight: '16px' }}><Trash2 size={16} /></div>
          </div>
          <div className="field-rules">
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '12px' }}>RADIO CHOICES</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="pill">Own Bank ✕</span>
              <span className="pill">Other Bank ✕</span>
              <input type="text" placeholder="Add option, press Enter" style={{ width: '200px' }} />
              <button style={{ background: 'none', border: 'none', color: 'var(--primary-red)', fontWeight: 600, cursor: 'pointer' }}>Add</button>
            </div>
          </div>
        </div>

        {/* Field 3 */}
        <div className="field-row">
          <div className="field-main">
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>Transaction Date</div>
            <div style={{ width: '200px' }}><select><option>Text</option></select></div>
            <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}><div className="toggle active"></div></div>
            <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}><div className="toggle"></div></div>
            <div style={{ width: '60px', textAlign: 'right', color: '#9ca3af', paddingRight: '16px' }}><Trash2 size={16} /></div>
          </div>
          <div className="field-rules">
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '12px' }}>INPUT RULES — none, any input accepted</div>
            <div className="rules-grid">
              <div><label className="input-label">Min characters</label><input type="text" /></div>
              <div><label className="input-label">Max characters</label><input type="text" /></div>
              <div><label className="input-label">Allowed</label><select><option>Any characters</option></select></div>
              <div><label className="input-label">Format</label><input type="text" placeholder="e.g. AAA-9999" /></div>
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>Format: 9 = a digit, A = a letter, anything else must match exactly. Leave blank for free text.</div>
          </div>
        </div>
        
        {/* Field 4 */}
        <div className="field-row">
          <div className="field-main">
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>Amount (PKR)</div>
            <div style={{ width: '200px' }}><select><option>Text</option></select></div>
            <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}><div className="toggle active"></div></div>
            <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}><div className="toggle"></div></div>
            <div style={{ width: '60px', textAlign: 'right', color: '#9ca3af', paddingRight: '16px' }}><Trash2 size={16} /></div>
          </div>
          <div className="field-rules">
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '12px' }}>INPUT RULES</div>
            <div className="rules-grid">
              <div><label className="input-label">Min characters</label><input type="text" /></div>
              <div><label className="input-label">Max characters</label><input type="text" defaultValue="10" /></div>
              <div><label className="input-label">Allowed</label><select><option>Numbers only</option></select></div>
              <div><label className="input-label">Format</label><input type="text" placeholder="e.g. AAA-9999" /></div>
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>Format: 9 = a digit, A = a letter, anything else must match exactly. Leave blank for free text.</div>
          </div>
        </div>

        {/* Field 5 */}
        <div className="field-row" style={{ borderBottom: 'none' }}>
          <div className="field-main">
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>Complaint Notes</div>
            <div style={{ width: '200px' }}><select><option>Text Area</option></select></div>
            <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}><div className="toggle"></div></div>
            <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}><div className="toggle active"></div></div>
            <div style={{ width: '60px', textAlign: 'right', color: '#9ca3af', paddingRight: '16px' }}><Trash2 size={16} /></div>
          </div>
          <div className="field-rules">
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '12px' }}>
              ALLOWED FILES &nbsp; <span style={{color: 'var(--primary-red)'}}>☑ PDF &nbsp; ☑ PNG &nbsp; ☑ JPG</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '12px' }}>INPUT RULES — none, any input accepted</div>
            <div className="rules-grid">
              <div><label className="input-label">Min characters</label><input type="text" /></div>
              <div><label className="input-label">Max characters</label><input type="text" /></div>
              <div><label className="input-label">Allowed</label><select><option>Any characters</option></select></div>
              <div><label className="input-label">Format</label><input type="text" placeholder="e.g. AAA-9999" /></div>
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>Format: 9 = a digit, A = a letter, anything else must match exactly. Leave blank for free text.</div>
          </div>
        </div>

        <div style={{ padding: '20px 24px 0', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>
          <Plus size={16} /> Add Field
        </div>
      </div>

      {/* Section 3: Routing Configuration */}
      <div className="card" style={{ marginBottom: '40px' }}>
        <div className="section-header">
          <div className="section-number">3</div>
          <h2 className="section-title">ROUTING CONFIGURATION</h2>
          <div className="section-line"></div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontWeight: 500, fontSize: '14px' }}>Routing Mode:</span>
          <button className="btn-toggle active" style={{ padding: '8px 24px', flex: 'none' }}>Manual</button>
          <button className="btn-toggle" style={{ padding: '8px 24px', flex: 'none' }}>Auto</button>
        </div>
      </div>

      {/* Floating Save Button */}
      <div style={{ position: 'fixed', bottom: '24px', right: '48px', zIndex: 10 }}>
        <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px', boxShadow: '0 4px 6px rgba(216, 44, 44, 0.2)' }}>
          Save Configuration
        </button>
      </div>
    </div>
  );
}