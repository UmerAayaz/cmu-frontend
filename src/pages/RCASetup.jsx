import { useState } from 'react';
import { X, Plus, Info } from 'lucide-react';
import './RCASetup.css'

// --- Reusable Card Component ---
const ConfigCard = ({ title, desc, type, initialOptions, disabled }) => {
  const [options, setOptions] = useState(initialOptions || []);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() !== '' && !options.includes(inputValue.trim())) {
      setOptions([...options, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (optToRemove) => {
    setOptions(options.filter(opt => opt !== optToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  // Badge Color Logic
  let badgeClass = 'badge-blue';
  if (type === 'Yes / No') badgeClass = 'badge-green';
  if (type === 'Numeric') badgeClass = 'badge-yellow';

  return (
    <div className="rca-card">
      <div className="rca-header">
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{title}</h3>
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>{desc}</p>
        </div>
        <span className={`rca-badge ${badgeClass}`}>{type}</span>
      </div>

      <div className="rca-body">
        {!disabled ? (
          <>
            <div className="rca-tags">
              {options.map(opt => (
                <span key={opt} className="rca-tag">
                  {opt} <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemove(opt)} />
                </span>
              ))}
            </div>
            <div className="rca-input-group">
              <input 
                type="text" 
                placeholder="Add option..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button className="btn-primary" onClick={handleAdd} style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: '12px', background: '#f9fafb', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', color: '#9ca3af', fontStyle: 'italic' }}>
            {type === 'Yes / No' ? 'Toggle — Officer selects Yes or No. No options to configure.' : 'Numeric input — no options'}
          </div>
        )}
      </div>
    </div>
  );
};

export default function RCASetup() {
  return (
    <div style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">RCA Setup</h1>
        <p className="page-subtitle">Configure the options available in each RCA field. Officers use these dropdowns when closing a complaint.</p>
      </div>

      <div className="rca-grid">
        <ConfigCard 
          title="Faulter" 
          desc="Identifies who is responsible for the complaint." 
          type="Dropdown" 
          initialOptions={['Customer', 'Bank']} 
        />
        <ConfigCard 
          title="Faulter Workgroup" 
          desc="Unlocks when Faulter = Bank." 
          type="Dropdown" 
          initialOptions={['Operations', 'IT', 'Credit', 'Compliance', 'Branch Network', 'Digital']} 
        />
        <ConfigCard 
          title="Faulter Sub-Workgroup" 
          desc="Unlocks when Faulter Workgroup is selected." 
          type="Dropdown" 
          initialOptions={['Front Office', 'Back Office', 'Support', 'Risk', 'Level 1', 'Level 2']} 
        />
        <ConfigCard 
          title="Root Cause Reason" 
          desc="Root cause options shown to Officer at case closure." 
          type="Dropdown" 
          initialOptions={['System Error / Downtime', 'Staff Error / Negligence', 'Policy / Process Gap', 'Fraud / Unauthorized Access', 'Incorrect Fee Application', 'Wrong Instructions Provided', 'Customer Error', 'Fraudulent Claim']} 
        />
        <ConfigCard 
          title="Financial Reversal" 
          desc="Toggle — Officer selects Yes or No. No options to configure." 
          type="Yes / No" 
          disabled={true} 
        />
        <ConfigCard 
          title="Financial Reversal Type" 
          desc="Unlocks when Financial Reversal = Yes." 
          type="Dropdown" 
          initialOptions={['Fee Reversal', 'Transaction Reversal', 'Interest Reversal', 'Penalty Waiver']} 
        />
        <ConfigCard 
          title="Amount" 
          desc="Numeric input field. No options to configure." 
          type="Numeric" 
          disabled={true} 
        />
        <ConfigCard 
          title="SBP Disposal Status" 
          desc="Maps to SBP regulatory reporting codes." 
          type="Dropdown" 
          initialOptions={['Resolved in Favor of Customer', 'Resolved in Favor of Bank', 'Partially Resolved', 'Withdrawn', 'Closed']} 
        />
        <div style={{ gridColumn: '1 / -1' }}> {/* Full width for the last one */}
          <ConfigCard 
            title="Mode of Closure" 
            desc="How the closure communication is delivered to the customer." 
            type="Dropdown" 
            initialOptions={['SMS', 'Email', 'PDF Letter']} 
          />
        </div>
      </div>

      {/* Bottom Warning Note */}
      <div className="rca-warning-banner">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Info size={16} color="#b45309" style={{ flexShrink: 0 }} />
          <span>
            <strong>Note:</strong> The Officer RCA form uses these options dynamically — changing them here updates the form immediately. Locked fields (toggle, numeric) have no configurable options.
          </span>
        </div>
      </div>

    </div>
  );
}