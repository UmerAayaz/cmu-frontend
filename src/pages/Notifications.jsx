import { useState, useRef } from 'react'; // <-- useRef import kiya
import { CheckCircle2, Info } from 'lucide-react';
import './Notifications.css';

export default function Notifications() {
    // --- Main States ---
    const [activeTab, setActiveTab] = useState('External');
    const [showToast, setShowToast] = useState(false);

    // --- External States ---
    const [externalRule, setExternalRule] = useState('Acknowledgment');
    const [channel, setChannel] = useState('SMS');
    const [language, setLanguage] = useState('English');
    const [complaintType, setComplaintType] = useState('Account Operations');

    // --- Internal States ---
    const [internalConfig, setInternalConfig] = useState('Stakeholder');
    const [internalLevel, setInternalLevel] = useState(1);

    // --- Refs for Cursor Insertion ---
    const extTextareaRef = useRef(null);
    const intSubjectRef = useRef(null);
    const intBodyRef = useRef(null);

    // --- Mock Data ---
    const externalRules = [
        { id: 'Acknowledgment', desc: 'Dispatched automatically on initial complaint submission.' },
        { id: 'Interim Follow-up', desc: 'Dispatched on the 11th calendar day if case status is still Open.' },
        { id: 'Closure Confirmation', desc: 'Sent on case closure. Configure per complaint type below.' },
    ];

    const complaintTypes = ['Account Operations', 'Card Services', 'Digital Banking', 'Remittance', 'Loan / Financing', 'ATM / CDM', 'Staff Misconduct', 'Others'];

    const variablesExt = ['[Customer Name]', '[Complaint ID]', '[Date]', '[Complaint Type]', '[Resolution Summary]', '[Helpline Number]'];
    const variablesInt = ['[Complaint ID]', '[Escalation To]', '[Customer Name]', '[Complaint Type]', '[Aging]', '[TAT Breached By]'];

    // --- Handlers ---
    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // --- Insert Variable Logic ---
    const insertVariable = (variable, ref) => {
        const el = ref.current;
        if (!el) return;
        
        const startPos = el.selectionStart;
        const endPos = el.selectionEnd;
        const currentText = el.value;
        
        // Insert variable at cursor
        const newText = currentText.substring(0, startPos) + variable + currentText.substring(endPos);
        el.value = newText;
        
        // Focus back and move cursor to the end of inserted variable
        el.focus();
        el.setSelectionRange(startPos + variable.length, startPos + variable.length);
    };

    const handleInternalVariableClick = (variable) => {
        const activeEl = document.activeElement;
        if (activeEl === intSubjectRef.current) {
            insertVariable(variable, intSubjectRef);
        } else {
            insertVariable(variable, intBodyRef); // Default to body if neither is focused
        }
    };

    // --- Dynamic Content for External ---
    const getExternalContent = () => {
        if (language === 'Urdu') {
            if (externalRule === 'Acknowledgment') return `محترم [Customer Name]،\n\nآپ کی شکایت (حوالہ نمبر: [Complaint ID]) موصول ہوئی ہے۔\n\nشکریہ\nکسٹمر مینجمنٹ یونٹ`;
            if (externalRule === 'Interim Follow-up') return `محترم [Customer Name]،\n\nآپ کی شکایت (حوالہ نمبر: [Complaint ID]) زیر جائزہ ہے۔\n\nشکریہ\nکسٹمر مینجمنٹ یونٹ`;
            if (externalRule === 'Closure Confirmation') return `محترم [Customer Name]،\n\nآپ کی شکایت (حوالہ نمبر: [Complaint ID]) حل کر دی گئی ہے۔\n\nشکریہ`;
        }
        // English
        if (externalRule === 'Acknowledgment') return `Dear [Customer Name],\n\nWe have received your complaint (Ref: [Complaint ID]) regarding [Complaint Type] on [Date]. Our team will review your case and respond within the stipulated timeframe.\n\nFor queries, contact CMU at [Helpline Number].\n\nRegards,\nCustomer Management Unit`;
        if (externalRule === 'Interim Follow-up') return `Dear [Customer Name],\n\nThis is a follow-up on your complaint (Ref: [Complaint ID]). Your case is currently under review. We appreciate your patience and will provide an update shortly.\n\nRegards,\nCustomer Management Unit`;
        if (externalRule === 'Closure Confirmation') return `Dear [Customer Name],\n\nYour complaint (Ref: [Complaint ID]) regarding ${complaintType} has been resolved.\n\nResolution details: [Resolution Summary].\n\nWe value your feedback.`;
    };

    return (
        <div style={{ paddingBottom: '40px', position: 'relative' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 className="page-title">Notifications</h1>
                <p className="page-subtitle">Manage automated notification templates for customer communications.</p>
            </div>

            {/* Big Tabs (External / Internal) */}
            <div style={{ display: 'flex', marginBottom: '24px', background: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
                <button
                    className={`notif-big-tab ${activeTab === 'External' ? 'active' : ''}`}
                    onClick={() => setActiveTab('External')}
                >
                    External
                </button>
                <button
                    className={`notif-big-tab ${activeTab === 'Internal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Internal')}
                >
                    Internal
                </button>
            </div>

            {/* ================= EXTERNAL TAB ================= */}
            {activeTab === 'External' && (
                <div className="notif-layout">
                    {/* Left Sidebar */}
                    <div className="notif-sidebar">
                        <div className="section-label" style={{ padding: '0 16px', marginBottom: '12px' }}>TRIGGER RULES</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px', marginBottom: '24px' }}>
                            {externalRules.map(rule => (
                                <div
                                    key={rule.id}
                                    className={`notif-rule-card ${externalRule === rule.id ? 'active' : ''}`}
                                    onClick={() => setExternalRule(rule.id)}
                                >
                                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', color: externalRule === rule.id ? 'var(--primary-red)' : 'var(--text-main)' }}>{rule.id}</div>
                                    <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>{rule.desc}</div>
                                </div>
                            ))}
                        </div>

                        <div className="section-label" style={{ padding: '0 16px', marginBottom: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>CHANNEL</div>
                        <div style={{ display: 'flex', gap: '8px', padding: '0 16px' }}>
                            {['SMS', 'Email', 'PDF Letter'].map(ch => (
                                <button
                                    key={ch}
                                    className={`notif-channel-btn ${channel === ch ? 'active' : ''}`}
                                    onClick={() => setChannel(ch)}
                                >
                                    {ch}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Main Content */}
                    <div className="notif-main">
                        <div className="notif-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{externalRule}</h3>
                                <span className="badge-gray">{channel}</span>
                            </div>
                            <div className="notif-lang-toggle">
                                <button className={language === 'English' ? 'active' : ''} onClick={() => setLanguage('English')}>English</button>
                                <button className={language === 'Urdu' ? 'active' : ''} onClick={() => setLanguage('Urdu')}>Urdu</button>
                            </div>
                        </div>

                        {/* Complaint Types for Closure Confirmation */}
                        {externalRule === 'Closure Confirmation' && (
                            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-color)', background: '#f9fafb' }}>
                                <div className="section-label" style={{ marginBottom: '8px' }}>COMPLAINT TYPE — ONE TEMPLATE PER TYPE</div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {complaintTypes.map(type => (
                                        <button
                                            key={type}
                                            className={`notif-type-btn ${complaintType === type ? 'active' : ''}`}
                                            onClick={() => setComplaintType(type)}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Variables (Clickable) */}
                        <div className="notif-variables">
                            <span style={{ fontSize: '13px', color: '#9ca3af', marginRight: '8px' }}>Variables:</span>
                            {variablesExt.map(v => (
                                <span 
                                    key={v} 
                                    className="var-pill" 
                                    style={{ cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}
                                    onClick={() => insertVariable(v, extTextareaRef)}
                                    title="Click to insert in text"
                                >
                                    {v}
                                </span>
                            ))}
                        </div>

                        {/* Text Area (with Ref) */}
                        <div className="notif-editor">
                            <textarea
                                ref={extTextareaRef}
                                key={`${externalRule}-${language}-${complaintType}`}
                                defaultValue={getExternalContent()}
                                dir={language === 'Urdu' ? 'rtl' : 'ltr'}
                                style={{ fontFamily: language === 'Urdu' ? 'Noto Nastaliq Urdu, sans-serif' : 'Inter, monospace', fontSize: language === 'Urdu' ? '18px' : '14px' }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="notif-footer">
                            <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                                {language === 'Urdu' ? 'Customer communications will be sent in Urdu when selected.' : 'Default language for customer communications.'}
                            </span>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn-outline" style={{ padding: '8px 16px' }}>Reset to Default</button>
                                <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={handleSave}>Save Template</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= INTERNAL TAB ================= */}
            {activeTab === 'Internal' && (
                <div className="notif-layout">
                    {/* Left Sidebar */}
                    <div className="notif-sidebar" style={{ paddingTop: '16px' }}>
                        <div style={{ padding: '0 16px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                <button className={`notif-channel-btn ${internalConfig === 'Stakeholder' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setInternalConfig('Stakeholder')}>Stakeholder</button>
                                <button className={`notif-channel-btn ${internalConfig === 'CMU Team' ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setInternalConfig('CMU Team')}>CMU Team</button>
                            </div>
                            <select style={{ width: '100%' }}>
                                <option>{internalConfig === 'Stakeholder' ? 'Digital Operations' : 'Branch Banking'}</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(lvl => (
                                <div
                                    key={lvl}
                                    className={`notif-level-card ${internalLevel === lvl ? 'active' : ''}`}
                                    onClick={() => setInternalLevel(lvl)}
                                >
                                    Level {lvl} escalation
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Main Content */}
                    <div className="notif-main">
                        <div className="notif-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>
                                    {internalConfig === 'Stakeholder' ? 'Digital Operations' : 'Branch Banking'} · L{internalLevel}
                                </h3>
                                <span className="badge-gray">Email</span>
                            </div>
                        </div>

                        {/* Variables (Clickable) */}
                        <div className="notif-variables">
                            <span style={{ fontSize: '13px', color: '#9ca3af', marginRight: '8px' }}>Variables:</span>
                            {variablesInt.map(v => (
                                <span 
                                    key={v} 
                                    className="var-pill" 
                                    style={{ cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}
                                    onClick={() => handleInternalVariableClick(v)}
                                    title="Click to insert in text"
                                >
                                    {v}
                                </span>
                            ))}
                        </div>

                        <div className="notif-editor" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', display: 'block', marginBottom: '8px' }}>SUBJECT</label>
                                <input
                                    ref={intSubjectRef}
                                    key={`subject-${internalConfig}-${internalLevel}`}
                                    type="text"
                                    defaultValue={`[L${internalLevel}] Escalation — Complaint [Complaint ID] breached TAT (${internalConfig === 'Stakeholder' ? 'Digital Operations' : 'Branch Banking'})`}
                                    style={{ background: '#f9fafb' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', display: 'block', marginBottom: '8px' }}>BODY</label>
                                <textarea
                                    ref={intBodyRef}
                                    key={`${internalConfig}-${internalLevel}`}
                                    defaultValue={`Dear [Escalation To],\n\nComplaint [Complaint ID] (${internalConfig === 'Stakeholder' ? 'Stakeholder: Digital Operations' : 'CMU Team: Branch Banking'}) has breached its TAT.\n\nEscalation level: L${internalLevel}\nCustomer: [Customer Name]\nComplaint type: [Complaint Type]\nAging: [Aging] days\nTAT breached by: [TAT Breached By]\n\nPlease review and take immediate action.\n\nRegards,\nCustomer Management Unit`}
                                    style={{ minHeight: '250px', fontFamily: 'monospace' }}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="notif-footer">
                            <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                                Sent by email to the {internalConfig.toLowerCase()} contact at L{internalLevel} when TAT is breached.
                            </span>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="btn-outline" style={{ padding: '8px 16px' }}>Reset to Default</button>
                                <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={handleSave}>Save Template</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= TOAST NOTIFICATION ================= */}
            {showToast && (
                <div className="toast-container">
                    <div className="toast-content">
                        <CheckCircle2 size={20} color="#10b981" />
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '14px', color: '#1f2937' }}>Saved Successfully</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Your template has been updated.</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}