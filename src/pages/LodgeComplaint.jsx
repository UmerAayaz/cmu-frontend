import { useState } from 'react';
import { Lock, CheckCircle2, AlertCircle, Paperclip, ChevronDown } from 'lucide-react';
import './LodgeComplaint.css'

export default function LodgeComplaint() {
  const [cnic, setCnic] = useState('');
  const [fetchStatus, setFetchStatus] = useState('idle'); // 'idle', 'ETB', 'NTB', 'duplicate'
  
  // Customer State
  const [customer, setCustomer] = useState({
    name: '', age: '', dob: '', gender: '', premier: 'Regular', vulnerable: '...', mobile: '', email: '', address: ''
  });
  
  // Complaint State
  const [complaintType, setComplaintType] = useState('');
  
  // Dynamic Fields State
  const [issueFields, setIssueFields] = useState({});

  // --- Mock Data ---
  const ETB_DATA = {
    cnic: '42101-1234567-8', name: 'Muhammad Ali Khan', age: '34', dob: '12-Mar-1990', 
    gender: 'Male', premier: 'Premier', vulnerable: 'No', 
    mobile: '+92-300-1234567', email: 'ali.khan@email.com', address: 'House 12, Street 4, F-7/2, Islamabad'
  };

  const COMPLAINT_TYPES = {
    'ATM / CDM Issue': {
      autoFill: { product: 'Digital Banking', category: 'ATM', subCategory: 'Transaction Dispute', internalType: 'Major', sbpType: 'ATM / CDM' },
      fields: [
        { name: 'atmId', label: 'ATM ID / Location', type: 'text', required: true, placeholder: 'Enter atm id / location...' },
        { name: 'atmBelongs', label: 'ATM Belongs To', type: 'radio', options: ['Own Bank', 'Other Bank'], required: true },
        { name: 'transactionDate', label: 'Transaction Date', type: 'text', required: true, placeholder: 'Enter transaction date...' },
        { name: 'amount', label: 'Amount (PKR)', type: 'text', required: true, placeholder: 'Enter amount (pkr)...', hint: 'numbers only · max 10 characters' },
        { name: 'notes', label: 'Complaint Notes', type: 'textarea', required: false, placeholder: 'Enter complaint notes...' }
      ]
    },
    'Card Dispute': {
      autoFill: { product: 'Consumer Finance', category: 'Debit Card', subCategory: 'Unauthorized Transaction', internalType: 'Major', sbpType: 'Card Services' },
      fields: [
        { name: 'cardLast4', label: 'Card Last 4 Digits', type: 'text', required: true, placeholder: 'Enter card last 4 digits...', hint: 'numbers only · exactly 4 characters' },
        { name: 'disputedAmount', label: 'Disputed Amount (PKR)', type: 'text', required: true, placeholder: 'Enter disputed amount (pkr)...' },
        { name: 'merchant', label: 'Merchant Name', type: 'text', required: false, placeholder: 'Enter merchant name...' },
        { name: 'notes', label: 'Complaint Notes', type: 'textarea', required: false, placeholder: 'Enter complaint notes...' }
      ]
    },
    'Online Transfer': {
      autoFill: { product: 'Digital Banking', category: 'Internet Banking', subCategory: 'Transfer Failed', internalType: 'Minor', sbpType: 'Digital Banking' },
      fields: [
        { name: 'beneficiary', label: 'Beneficiary Account', type: 'text', required: true, placeholder: 'Enter beneficiary account...' },
        { name: 'transferAmount', label: 'Transfer Amount (PKR)', type: 'text', required: true, placeholder: 'Enter transfer amount (pkr)...' },
        { name: 'notes', label: 'Complaint Notes', type: 'textarea', required: false, placeholder: 'Enter complaint notes...' }
      ]
    }
  };

  // --- Handlers ---
  const handleFetch = () => {
    if (!cnic) return;
    if (cnic.startsWith('4')) {
      setFetchStatus('ETB');
      setCustomer(ETB_DATA);
    } else if (cnic.startsWith('5')) {
      setFetchStatus('duplicate');
    } else {
      setFetchStatus('NTB');
      setCustomer({ name: '', age: '', dob: '', gender: '', premier: 'Regular', vulnerable: '...', mobile: '', email: '', address: '' });
    }
  };

  const handleChangeCNIC = () => {
    setFetchStatus('idle');
    setCnic('');
    setComplaintType('');
    setIssueFields({});
  };

  const handleComplaintTypeChange = (e) => {
    const type = e.target.value;
    setComplaintType(type);
    setIssueFields({}); // reset fields on change
  };

  const currentAutoFill = COMPLAINT_TYPES[complaintType]?.autoFill;
  const currentFields = COMPLAINT_TYPES[complaintType]?.fields || [];

  // Determine Case Timer Dots
  const isCustomerFetched = fetchStatus === 'ETB' || fetchStatus === 'NTB';
  const isComplaintSelected = !!complaintType;
  const isAccountSelected = fetchStatus === 'ETB';

  return (
    <div style={{ paddingBottom: '80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">New Complaint</h1>
        <p className="page-subtitle">Enter the customer's CNIC — details will be fetched automatically if they are an existing customer.</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Main Form Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section A: CNIC Lookup */}
          <div className="card">
            <div className="section-header">
              <div className="section-number" style={{ backgroundColor: 'var(--primary-red)' }}>A</div>
              <h2 className="section-title">CNIC LOOKUP</h2>
              <div className="section-line"></div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="input-label">CNIC <span style={{ color: 'var(--primary-red)' }}>*</span></label>
              <div style={{ display: 'flex', gap: '12px', width: '60%' }}>
                <input 
                  type="text" 
                  placeholder="XXXXX-XXXXXXX-X" 
                  value={cnic} 
                  onChange={(e) => setCnic(e.target.value)}
                  style={{ borderColor: cnic.length > 0 ? 'var(--primary-red)' : 'var(--border-color)' }}
                />
                <button className="btn-primary" onClick={handleFetch}>Fetch</button>
              </div>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
                Demo: starting with 4 = ETB · 5 = duplicate scenario · any other = NTB
              </p>

              {/* Feedback Banners */}
              {fetchStatus === 'ETB' && (
                <div className="banner banner-success">
                  <CheckCircle2 size={16} />
                  <span>Customer found — <strong>{customer.name}</strong> · ETB</span>
                  <button className="btn-link" onClick={handleChangeCNIC}>Change</button>
                </div>
              )}
              {fetchStatus === 'NTB' && (
                <div className="banner banner-warning">
                  <AlertCircle size={16} />
                  <span>Customer not found in system. This is a <strong>New to Bank (NTB)</strong> customer — please enter their details below.</span>
                </div>
              )}
              {fetchStatus === 'duplicate' && (
                <div className="banner banner-error">
                  <AlertCircle size={16} />
                  <span>Duplicate complaint scenario detected. Please check existing complaints.</span>
                </div>
              )}
            </div>
          </div>

          {/* Section B: Customer Info */}
          {isCustomerFetched && (
            <div className="card">
              <div className="section-header">
                <div className="section-number" style={{ backgroundColor: 'var(--primary-red)' }}>B</div>
                <h2 className="section-title">CUSTOMER INFO</h2>
                <div className="section-line"></div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '12px', marginBottom: '16px' }}>
                {fetchStatus === 'ETB' ? (
                  <><Lock size={12} /> Auto-fetched from Core Banking. All fields are locked.</>
                ) : (
                  <>New to Bank — please fill in the customer details manually.</>
                )}
              </div>

              {/* Row 1 */}
              <div className="grid-3-col" style={{ marginBottom: '16px' }}>
                <div>
                  <label className="input-label">CNIC</label>
                  <div className="input-with-icon">
                    <input type="text" value={cnic} disabled={fetchStatus === 'ETB'} className={fetchStatus === 'ETB' ? 'input-locked' : ''} readOnly />
                    {fetchStatus === 'ETB' && <Lock size={14} className="input-icon" />}
                  </div>
                </div>
                <div>
                  <label className="input-label">CUSTOMER NAME <span style={{ color: 'var(--primary-red)' }}>*</span></label>
                  <div className="input-with-icon">
                    <input 
                      type="text" 
                      placeholder="Full name as per CNIC" 
                      value={customer.name} 
                      onChange={(e) => setCustomer({...customer, name: e.target.value})}
                      disabled={fetchStatus === 'ETB'} 
                      className={fetchStatus === 'ETB' ? 'input-locked' : ''} 
                    />
                    {fetchStatus === 'ETB' && <Lock size={14} className="input-icon" />}
                  </div>
                </div>
                <div>
                  <label className="input-label">AGE / DOB</label>
                  <div className="input-with-icon">
                    <input type="text" value={customer.age ? `${customer.age} / ${customer.dob}` : ''} disabled={fetchStatus === 'ETB'} className={fetchStatus === 'ETB' ? 'input-locked' : ''} readOnly />
                    {fetchStatus === 'ETB' && <Lock size={14} className="input-icon" />}
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid-3-col" style={{ marginBottom: '16px' }}>
                <div>
                  <label className="input-label">GENDER</label>
                  <div className="input-with-icon">
                    <select value={customer.gender} onChange={(e) => setCustomer({...customer, gender: e.target.value})} disabled={fetchStatus === 'ETB'} className={fetchStatus === 'ETB' ? 'input-locked' : ''}>
                      <option value="">Select...</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                    {fetchStatus === 'ETB' && <Lock size={14} className="input-icon" />}
                  </div>
                </div>
                <div>
                  <label className="input-label">PREMIER STATUS</label>
                  <div className="input-with-icon">
                    <input type="text" value={customer.premier} disabled={fetchStatus === 'ETB'} className={fetchStatus === 'ETB' ? 'input-locked' : ''} readOnly />
                    {fetchStatus === 'ETB' && <Lock size={14} className="input-icon" />}
                  </div>
                </div>
                <div>
                  <label className="input-label">VULNERABLE CUSTOMER</label>
                  <div className="input-with-icon">
                    <input type="text" value={customer.vulnerable} disabled={fetchStatus === 'ETB'} className={fetchStatus === 'ETB' ? 'input-locked' : ''} readOnly />
                    {fetchStatus === 'ETB' && <Lock size={14} className="input-icon" />}
                  </div>
                </div>
              </div>

              {fetchStatus === 'ETB' && (
                <div className="grid-2-col" style={{ marginBottom: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <div>
                    <label className="input-label">Account Number</label>
                    <select><option>PK32ABCD0000001234567890</option></select>
                  </div>
                  <div>
                    <label className="input-label">Card Number</label>
                    <select><option>4532 •••• •••• 1234</option></select>
                  </div>
                </div>
              )}

              <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px', borderTop: fetchStatus === 'NTB' ? '1px solid var(--border-color)' : 'none', paddingTop: fetchStatus === 'NTB' ? '16px' : '0' }}>
                Contact details pre-filled from records. Update if customer provides new information.
              </div>

              <div className="grid-2-col">
                <div>
                  <label className="input-label">Mobile <span style={{ color: 'var(--primary-red)' }}>*</span></label>
                  <input type="text" placeholder="+92-3xx-xxxxxxx" value={customer.mobile} onChange={(e) => setCustomer({...customer, mobile: e.target.value})} />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input type="text" placeholder="email@example.com" value={customer.email} onChange={(e) => setCustomer({...customer, email: e.target.value})} />
                </div>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label className="input-label">Address <span style={{ color: 'var(--primary-red)' }}>*</span></label>
                <input type="text" placeholder="Physical address" value={customer.address} onChange={(e) => setCustomer({...customer, address: e.target.value})} />
              </div>
            </div>
          )}

          {/* Section C: Complaint Info */}
          {isCustomerFetched && (
            <div className="card">
              <div className="section-header">
                <div className="section-number" style={{ backgroundColor: 'var(--primary-red)' }}>C</div>
                <h2 className="section-title">COMPLAINT INFO</h2>
                <div className="section-line"></div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="input-label">Complaint Type <span style={{ color: 'var(--primary-red)' }}>*</span></label>
                <select 
                  value={complaintType} 
                  onChange={handleComplaintTypeChange}
                  style={{ borderColor: complaintType ? 'var(--primary-red)' : 'var(--border-color)' }}
                >
                  <option value="">Select complaint type...</option>
                  <option value="ATM / CDM Issue">ATM / CDM Issue</option>
                  <option value="Card Dispute">Card Dispute</option>
                  <option value="Online Transfer">Online Transfer</option>
                </select>
              </div>

              {/* Auto-populate Box */}
              {complaintType && (
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>
                    <Lock size={12} /> Auto-populated based on complaint type configuration
                  </div>
                  <div className="grid-3-col" style={{ marginBottom: '12px' }}>
                    <div>
                      <label className="input-label">PRODUCT</label>
                      <div className="input-with-icon">
                        <input type="text" value={currentAutoFill.product} className="input-locked" readOnly />
                        <Lock size={14} className="input-icon" />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">CATEGORY</label>
                      <div className="input-with-icon">
                        <input type="text" value={currentAutoFill.category} className="input-locked" readOnly />
                        <Lock size={14} className="input-icon" />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">SUB-CATEGORY</label>
                      <div className="input-with-icon">
                        <input type="text" value={currentAutoFill.subCategory} className="input-locked" readOnly />
                        <Lock size={14} className="input-icon" />
                      </div>
                    </div>
                  </div>
                  <div className="grid-2-col">
                    <div>
                      <label className="input-label">INTERNAL TYPE</label>
                      <div className="input-with-icon">
                        <input type="text" value={currentAutoFill.internalType} className="input-locked" readOnly />
                        <Lock size={14} className="input-icon" />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">SBP COMPLAINT TYPE</label>
                      <div className="input-with-icon">
                        <input type="text" value={currentAutoFill.sbpType} className="input-locked" readOnly />
                        <Lock size={14} className="input-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid-2-col">
                <div>
                  <label className="input-label">Mode <span style={{ color: 'var(--primary-red)' }}>*</span></label>
                  <select><option>Select mode...</option><option>Digital</option><option>Physical</option></select>
                </div>
                <div>
                  <label className="input-label">Channel <span style={{ color: 'var(--primary-red)' }}>*</span></label>
                  <select><option>Select channel...</option><option>Mobile App</option><option>Branch</option><option>Call Center</option></select>
                </div>
              </div>
            </div>
          )}

          {/* Section D: Issue Details (Dynamic) */}
          {complaintType && (
            <div className="card">
              <div className="section-header">
                <div className="section-number" style={{ backgroundColor: 'var(--primary-red)' }}>D</div>
                <h2 className="section-title">ISSUE DETAILS</h2>
                <div className="section-line"></div>
              </div>
              <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
                Fields specific to this complaint type. Configured by admin in Complaint Setup.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentFields.map((field, idx) => (
                  <div key={idx}>
                    <label className="input-label">{field.label} {field.required && <span style={{ color: 'var(--primary-red)' }}>*</span>}</label>
                    
                    {field.type === 'text' && (
                      <input 
                        type="text" 
                        placeholder={field.placeholder}
                        value={issueFields[field.name] || ''}
                        onChange={(e) => setIssueFields({...issueFields, [field.name]: e.target.value})}
                      />
                    )}

                    {field.type === 'textarea' && (
                      <textarea 
                        placeholder={field.placeholder} 
                        rows={3}
                        value={issueFields[field.name] || ''}
                        onChange={(e) => setIssueFields({...issueFields, [field.name]: e.target.value})}
                      />
                    )}

                    {field.type === 'radio' && (
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        {field.options.map(opt => (
                          <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                            <input 
                              type="radio" 
                              name={field.name} 
                              value={opt}
                              checked={issueFields[field.name] === opt}
                              onChange={(e) => setIssueFields({...issueFields, [field.name]: e.target.value})}
                              style={{ accentColor: 'var(--primary-red)' }}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {field.hint && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>{field.hint}</div>}
                  </div>
                ))}

                <div style={{ marginTop: '8px' }}>
                  <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', borderStyle: 'dashed' }}>
                    <Paperclip size={14} /> Attach file (PDF, PNG, JPG)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar Timer */}
        <div className="card" style={{ width: '280px', height: 'fit-content', flexShrink: 0 }}>
          <h3 style={{ fontSize: '12px', color: '#9ca3af', letterSpacing: '1px', marginBottom: '24px', fontWeight: 600 }}>CASE TIMER</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            <div className="timer-circle" style={{ width: '50px', height: '50px', borderWidth: '6px' }}></div>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '12px' }}>Working Days</p>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
              <span>Fetch Status</span>
              <span className={`dot ${isCustomerFetched ? 'dot-green' : 'dot-gray'}`}></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
              <span>Customer</span>
              <span className={`dot ${isCustomerFetched ? 'dot-green' : 'dot-gray'}`}></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
              <span>Complaint Type</span>
              <span className={`dot ${isComplaintSelected ? 'dot-green' : 'dot-gray'}`}></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
              <span>Accounts</span>
              <span className={`dot ${isAccountSelected ? 'dot-green' : 'dot-gray'}`}></span>
            </div>
          </div>

          {/* Status Badge */}
          {fetchStatus === 'ETB' && <div style={{ marginTop: '20px', background: '#dcfce7', color: '#166534', textAlign: 'center', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 500 }}>ETB Customer</div>}
          {fetchStatus === 'NTB' && <div style={{ marginTop: '20px', background: '#dbeafe', color: '#1e40af', textAlign: 'center', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 500 }}>NTB — Manual</div>}
        </div>

      </div>

      {/* Floating Footer Action Bar */}
      {isCustomerFetched && (
        <div style={{ position: 'fixed', bottom: 0, left: '250px', right: 0, background: 'white', borderTop: '1px solid var(--border-color)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>Fields marked <span style={{ color: 'var(--primary-red)' }}>*</span> are required. Aging auto-calculated on lodgment.</span>
          <button className="btn-primary" style={{ padding: '10px 24px' }}>Save & Lodge</button>
        </div>
      )}
    </div>
  );
}