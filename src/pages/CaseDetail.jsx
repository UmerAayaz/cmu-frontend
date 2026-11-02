import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Clock, MessageSquare, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { MOCK_CASE } from '../data/mockCaseData';
import Modal from '../components/ui/Modal';
import '../styles/workflow-module.css';

export default function CaseDetail() {
  const { id, caseId } = useParams();
  const navigate = useNavigate();
  const [resolveModal, setResolveModal] = useState(false);
  const [resData, setResData] = useState({ outcome: 'In favour of customer', reason: 'ATM cash dispenser fault', action: 'PKR 25,000 reversed', amount: '25000' });

  const c = MOCK_CASE;

  const handleResolve = () => {
    toast.success('Case resolved successfully!');
    setResolveModal(false);
    navigate(`/projects/${id}/my-cases`);
  };

  return (
    <div className="wf-page">
      <div className="wf-header">
        <div>
          <button onClick={() => navigate(`/projects/${id}/my-cases`)} className="wf-btn wf-btn--ghost" style={{ marginBottom: 8, paddingLeft: 0 }}>
            <ArrowLeft size={14} /> Back to Cases
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 className="wf-title">{c.id}</h1>
            <span className="wf-badge wf-badge--info">{c.status}</span>
            <span className="wf-badge wf-badge--warning">{c.priority}</span>
            <span className="wf-badge wf-badge--success">{c.slaState}</span>
          </div>
          <p className="wf-subtitle">{c.type} · {c.customer}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="wf-btn wf-btn--secondary">Reassign</button>
          <button className="wf-btn wf-btn--primary" onClick={() => setResolveModal(true)}>Resolve Case</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr', gap: 20 }}>
        
        {/* Left Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* SLA Card */}
          <div className="wf-card" style={{ padding: 20, borderLeft: '4px solid var(--primary-red)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontWeight: 600 }}>SLA Tracker</div>
              <span className="wf-badge wf-badge--neutral">Working days</span>
            </div>
            <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, marginBottom: 16 }}>
              <div style={{ height: '100%', width: '20%', background: 'var(--color-success)', borderRadius: 3 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
              <div><span style={{ color: '#64748B' }}>Policy:</span> <br/><b>{c.slaDetails.policy}</b></div>
              <div><span style={{ color: '#64748B' }}>Due:</span> <br/><b>{c.slaDetails.due}</b></div>
              <div><span style={{ color: '#64748B' }}>L1:</span> <br/>{c.slaDetails.L1}</div>
              <div><span style={{ color: '#64748B' }}>L2:</span> <br/>{c.slaDetails.L2}</div>
            </div>
          </div>

          {/* Case Data */}
          <div className="wf-card">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', fontWeight: 600 }}>Issue Details</div>
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><span className="wf-label">ATM ID</span><div style={{ fontWeight: 500 }}>{c.fields.atmId}</div></div>
              <div><span className="wf-label">Location</span><div>{c.fields.atmLocation}</div></div>
              <div><span className="wf-label">Transaction Date</span><div>{c.fields.transactionDate}</div></div>
              <div><span className="wf-label">Amount (PKR)</span><div>{c.fields.amount}</div></div>
              <div style={{ gridColumn: '1 / -1' }}><span className="wf-label">Notes</span><div>{c.fields.notes}</div></div>
            </div>
          </div>

          {/* Action Box */}
          <div className="wf-card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 16, fontSize: 15 }}>Decide next step</h3>
            <div className="wf-row">
              <div className="wf-field">
                <label className="wf-label">Next Stakeholder</label>
                <select className="wf-select">
                  <option>Card Services</option>
                  <option>Branch Banking</option>
                </select>
              </div>
              <div className="wf-field">
                <label className="wf-label">Instruction</label>
                <input className="wf-input" placeholder="Please check the EJ log..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="wf-btn wf-btn--primary">Route</button>
              <button className="wf-btn wf-btn--secondary">Send back</button>
              <button className="wf-btn wf-btn--secondary">Request info</button>
            </div>
          </div>

        </div>

        {/* Right Side: Timeline */}
        <div className="wf-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', fontWeight: 600 }}>Timeline</div>
          <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 15, top: 10, bottom: 10, width: 2, background: '#E2E8F0' }} />
              
              {c.timeline.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: item.type === 'comment' ? '#EFF6FF' : '#F1F5F9', color: item.type === 'comment' ? '#1E40AF' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.type === 'comment' ? <MessageSquare size={14} /> : <CheckCircle size={14} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.actor} <span style={{ fontWeight: 400, color: '#64748B' }}>{item.action}</span></div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{item.time}</div>
                    <div style={{ fontSize: 13, marginTop: 6, background: '#F8FAFC', padding: 10, borderRadius: 6 }}>{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Resolve Modal */}
      <Modal open={resolveModal} onClose={() => setResolveModal(false)} title={`Resolve ${c.id}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="wf-row">
            <div className="wf-field">
              <label className="wf-label">Outcome</label>
              <select className="wf-select" value={resData.outcome} onChange={e => setResData({...resData, outcome: e.target.value})}>
                <option>In favour of customer</option>
                <option>Not in favour of customer</option>
              </select>
            </div>
            <div className="wf-field">
              <label className="wf-label">Root Cause</label>
              <select className="wf-select" value={resData.reason} onChange={e => setResData({...resData, reason: e.target.value})}>
                <option>ATM cash dispenser fault</option>
                <option>Switch timeout</option>
              </select>
            </div>
          </div>
          <div className="wf-field">
            <label className="wf-label">Root Cause Detail</label>
            <textarea className="wf-textarea" rows={2} defaultValue="EJ log shows the cash dispenser failed on 28 Sep..." />
          </div>
          <div className="wf-field">
            <label className="wf-label">Corrective Action</label>
            <textarea className="wf-textarea" rows={2} defaultValue="PKR 25,000 reversed to the customer account on 8 Oct..." />
          </div>
          <div className="wf-row">
            <div className="wf-field">
              <label className="wf-label">Amount Refunded (PKR)</label>
              <input className="wf-input" value={resData.amount} onChange={e => setResData({...resData, amount: e.target.value})} />
            </div>
            <div className="wf-field" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" defaultChecked /> Customer informed by phone</label>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <button className="wf-btn wf-btn--secondary" onClick={() => setResolveModal(false)}>Cancel</button>
            <button className="wf-btn wf-btn--primary" onClick={handleResolve}>Resolve and close</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}