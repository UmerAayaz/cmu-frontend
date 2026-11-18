import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './OnboardProject.css';

import { 
  LOCAL_STORAGE_KEY, 
  STEPS, 
  INITIAL_FORM_STATE, 
  MARK_COLORS, 
  TEMPLATES, 
  ENGINE_WORDS, 
  DATA_SOURCES 
} from './onboardMockData';

export default function OnboardProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // 👇 SAFE LOCAL STORAGE INITIALIZATION
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Agar purane data mein admins string hai toh usko array banao
        let safeAdmins = parsed.admins;
        if (typeof safeAdmins === 'string') {
          safeAdmins = [safeAdmins];
        } else if (!Array.isArray(safeAdmins)) {
          safeAdmins = ['Sara Ahmed'];
        }

        return { 
          ...INITIAL_FORM_STATE, 
          ...parsed, 
          admins: safeAdmins 
        };
      } catch (e) {
        return INITIAL_FORM_STATE;
      }
    }
    return INITIAL_FORM_STATE;
  });

  // Auto-save to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleNameChange = (name) => {
    update({ name });
    if (!form.code) {
      const code = name.toUpperCase().replace(/[^A-Z0-9]/g, '-').slice(0, 8) + '-2026';
      update({ code });
    }
  };

  const handleGoLive = () => {
    if (!form.name.trim()) return toast.error('Project name is required');
    if (!form.code.trim()) return toast.error('Project code is required');

    setIsSaving(true);
    setTimeout(() => {
      const existingProjects = JSON.parse(localStorage.getItem('my_projects') || '[]');
      const newProject = { ...form, id: `proj-${Date.now()}`, status: 'Live', createdAt: new Date().toISOString() };
      
      localStorage.setItem('my_projects', JSON.stringify([...existingProjects, newProject]));
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      
      toast.success('Project created successfully!');
      navigate('/projects');
      setIsSaving(false);
    }, 800);
  };

  const currentStep = STEPS[step];

  return (
    <div className="onboard-container">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="onboard-sidebar">
        <div className="sidebar-title">NEW PROJECT</div>
        <div className="step-nav">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              className={`step-btn ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
              onClick={() => setStep(i)}
            >
              <div className="step-icon">
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              {s.title}
            </button>
          ))}
        </div>

        <div className="project-summary-card">
          <h4>PROJECT</h4>
          <div className="summary-row"><span>Name</span><strong>{form.name || '—'}</strong></div>
          <div className="summary-row"><span>Owner</span><strong>{form.owner || '—'}</strong></div>
          <div className="summary-row"><span>Admins</span><strong>{Array.isArray(form.admins) ? form.admins.length : 0}</strong></div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="onboard-main">
        <div className="form-card">
          <div className="step-header">
            <h2 className="step-title">
              <span className="step-badge">{step + 1}</span> {currentStep.title.toUpperCase()}
            </h2>
            <span className="step-counter">Step {step + 1} of {STEPS.length}</span>
          </div>

          {currentStep.id === 'basics' && <StepBasics form={form} update={update} onNameChange={handleNameChange} />}
          {currentStep.id === 'template' && <StepTemplate form={form} update={update} />}
          {currentStep.id === 'words' && <StepWords form={form} />}
          {currentStep.id === 'teams' && <StepTeams form={form} update={update} />}
          {currentStep.id === 'datasources' && <StepDataSources />}
          {currentStep.id === 'calendar' && <StepCalendar form={form} update={update} />}
          {currentStep.id === 'categories' && <StepCategories form={form} update={update} />}
          {currentStep.id === 'review' && <StepReview form={form} />}

          {/* Footer */}
          <div className="form-footer">
            <button 
              className="btn-back" 
              onClick={() => step === 0 ? navigate('/projects') : setStep(s => s - 1)}
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            
            <div className="footer-right">
              <span className="draft-text">Saved as a draft · not live yet</span>
              {step < STEPS.length - 1 ? (
                <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
                  Continue to {STEPS[step + 1].title.toLowerCase()} <ChevronRight size={16} />
                </button>
              ) : (
                <button className="btn-primary" onClick={handleGoLive} disabled={isSaving}>
                  {isSaving ? 'Creating...' : 'Go live'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STEP COMPONENTS
   ══════════════════════════════════════════════════════════ */

function StepBasics({ form, update, onNameChange }) {
  return (
    <>
      <div className="form-row-3">
        <div className="form-group">
          <label>Project name <span className="req">*</span></label>
          <input value={form.name} onChange={(e) => onNameChange(e.target.value)} placeholder="Complaint Management Unit" />
        </div>
        <div className="form-group">
          <label>Code <span className="req">*</span></label>
          <input value={form.code} onChange={(e) => update({ code: e.target.value.toUpperCase() })} placeholder="CMU-2026" />
          <div className="helper-text">Picks the project in the switcher and the API.</div>
        </div>
        <div className="form-group">
          <label>What it handles <span className="req">*</span></label>
          <input value={form.description} onChange={(e) => update({ description: e.target.value })} placeholder="Customer complaints" />
        </div>
      </div>
      <div className="form-row-3">
        <div className="form-group">
          <label>Owner</label>
          <input value={form.owner} onChange={(e) => update({ owner: e.target.value })} placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label>Project admins <span className="req">*</span></label>
          <div className="tag-input">
            {/* 👇 SAFE MAP FUNCTION */}
            {Array.isArray(form.admins) && form.admins.map(admin => (
              <span key={admin} className="tag">{admin} <X size={12} style={{ cursor: 'pointer' }} /></span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Mark letter <span className="req">*</span></label>
          <input value={form.markLetter} onChange={(e) => update({ markLetter: e.target.value })} maxLength={1} />
        </div>
      </div>
      <div className="form-group">
        <label>Mark colour</label>
        <div className="color-swatches">
          {MARK_COLORS.map(c => (
            <div 
              key={c} 
              className={`color-swatch ${form.markColor === c ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => update({ markColor: c })}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function StepTemplate({ form, update }) {
  return (
    <>
      <div className="template-grid">
        {TEMPLATES.map(t => (
          <div key={t.id} className={`template-card ${form.template === t.id ? 'selected' : ''}`} onClick={() => update({ template: t.id })}>
            <div className="template-header"><div className="template-radio" /> {t.title}</div>
            <div className="template-desc">{t.desc}</div>
            <div className="template-tags">
              <span className="template-tag">{t.steps}</span>
              {t.tag && <span className="template-tag">{t.tag}</span>}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 16 }}>Name things your way</h3>
      <div className="form-row-3">
        <div className="form-group">
          <label>One case is called <span className="req">*</span></label>
          <input value={form.caseWord} onChange={(e) => update({ caseWord: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Plural <span className="req">*</span></label>
          <input value={form.pluralWord} onChange={(e) => update({ pluralWord: e.target.value })} />
        </div>
        <div className="form-group">
          <label>The person it is about <span className="req">*</span></label>
          <input value={form.personWord} onChange={(e) => update({ personWord: e.target.value })} />
        </div>
      </div>
      <div className="form-row-3">
        <div className="form-group">
          <label>Reference prefix <span className="req">*</span></label>
          <input value={form.referencePrefix} onChange={(e) => update({ referencePrefix: e.target.value })} />
          <div className="helper-text">XX-2026-000001</div>
        </div>
        <div className="form-group">
          <label>A team that acts on it</label>
          <input value={form.teamWord} onChange={(e) => update({ teamWord: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Calendar</label>
          <select value={form.calendar} onChange={(e) => update({ calendar: e.target.value })}>
            <option>CMU (Mon to Fri)</option>
            <option>Branches (Mon to Sat)</option>
          </select>
        </div>
      </div>
    </>
  );
}

function StepWords({ form }) {
  return (
    <table className="words-table">
      <thead>
        <tr><th>Engine word</th><th>This project says</th><th>Plural</th></tr>
      </thead>
      <tbody>
        {ENGINE_WORDS.map(w => (
          <tr key={w.key}>
            <td style={{ color: '#94a3b8' }}>{w.label}</td>
            <td><input defaultValue={w.key === 'case' ? form.caseWord : ''} placeholder="..." /></td>
            <td><input defaultValue={w.key === 'case' ? form.pluralWord : ''} placeholder={w.plural} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StepDataSources() {
  return (
    <div className="ds-grid">
      {DATA_SOURCES.map(s => (
        <label key={s.id} className="ds-card">
          <input type="checkbox" defaultChecked={s.checked} />
          <div className="ds-info"><h4>{s.title}</h4><p>{s.desc}</p></div>
        </label>
      ))}
    </div>
  );
}

function StepCalendar({ form, update }) {
  return (
    <div className="form-row">
      <div className="form-group">
        <label>Calendar <span className="req">*</span></label>
        <select value={form.calendar} onChange={(e) => update({ calendar: e.target.value })}>
          <option>CMU (Mon to Fri)</option>
          <option>Branches (Mon to Sat)</option>
        </select>
        <div className="helper-text">Working hours and holidays behind every SLA and due date.</div>
      </div>
      <div className="form-group">
        <label>First response within (working hours)</label>
        <input type="number" defaultValue={8} />
      </div>
    </div>
  );
}

function StepTeams({ form, update }) {
  const addTeam = () => update({ teams: [...form.teams, { id: Date.now(), name: '', lead: '', members: [] }] });
  const updateTeam = (id, patch) => update({ teams: form.teams.map(t => t.id === id ? { ...t, ...patch } : t) });
  const removeTeam = (id) => update({ teams: form.teams.filter(t => t.id !== id) });

  const addMember = (teamId) => {
    const team = form.teams.find(t => t.id === teamId);
    updateTeam(teamId, { members: [...team.members, { id: Date.now(), name: '', role: 'Officer' }] });
  };
  const updateMember = (teamId, memberId, patch) => {
    const team = form.teams.find(t => t.id === teamId);
    updateTeam(teamId, { members: team.members.map(m => m.id === memberId ? { ...m, ...patch } : m) });
  };
  const removeMember = (teamId, memberId) => {
    const team = form.teams.find(t => t.id === teamId);
    updateTeam(teamId, { members: team.members.filter(m => m.id !== memberId) });
  };

  return (
    <>
      {form.teams.map((team, idx) => (
        <div key={team.id} className="dynamic-card">
          <div className="dynamic-header">
            <strong style={{ fontSize: 14 }}>Team {idx + 1}</strong>
            <button className="btn-icon-danger" onClick={() => removeTeam(team.id)}><Trash2 size={16} /></button>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Team name *</label>
              <input value={team.name} onChange={(e) => updateTeam(team.id, { name: e.target.value })} placeholder="e.g. Fulfilment team" />
            </div>
            <div className="form-group">
              <label>Team Lead</label>
              <input value={team.lead} onChange={(e) => updateTeam(team.id, { lead: e.target.value })} placeholder="Sara Ahmed" />
            </div>
          </div>

          {team.members.length > 0 && (
            <div className="members-list">
              {team.members.map(m => (
                <div key={m.id} className="member-row">
                  <input 
                    className="member-input" 
                    value={m.name} 
                    onChange={(e) => updateMember(team.id, m.id, { name: e.target.value })} 
                    placeholder="Member Name" 
                  />
                  <select 
                    className="member-select" 
                    value={m.role} 
                    onChange={(e) => updateMember(team.id, m.id, { role: e.target.value })}
                  >
                    <option>Officer</option>
                    <option>Verifier</option>
                    <option>Supervisor</option>
                  </select>
                  <button className="btn-icon-danger" onClick={() => removeMember(team.id, m.id)}><X size={16} /></button>
                </div>
              ))}
            </div>
          )}
          
          <button className="btn-add-sub" onClick={() => addMember(team.id)}>
            <Plus size={12} /> Add Member
          </button>
        </div>
      ))}
      
      <button className="btn-add-dashed" onClick={addTeam}>
        <Plus size={14} /> Add Team
      </button>
    </>
  );
}

function StepCategories({ form, update }) {
  const addCat = () => update({ categories: [...form.categories, { id: Date.now(), name: '' }] });
  const updateCat = (id, patch) => update({ categories: form.categories.map(c => c.id === id ? { ...c, ...patch } : c) });
  const removeCat = (id) => update({ categories: form.categories.filter(c => c.id !== id) });

  return (
    <>
      {form.categories.map((cat, idx) => (
        <div key={cat.id} className="dynamic-card">
          <div className="dynamic-header">
            <strong style={{ fontSize: 14 }}>Category {idx + 1}</strong>
            <button className="btn-icon-danger" onClick={() => removeCat(cat.id)}><Trash2 size={16} /></button>
          </div>
          <div className="form-group">
            <label>Category Name</label>
            <input value={cat.name} onChange={(e) => updateCat(cat.id, { name: e.target.value })} placeholder="e.g. ATM Issues" />
          </div>
        </div>
      ))}
      <button className="btn-add-dashed" onClick={addCat}>
        <Plus size={14} /> Add Category
      </button>
    </>
  );
}

function StepReview({ form }) {
  return (
    <>
      <div className="review-list">
        <div className="review-row"><span>Project</span><strong>{form.name || '—'} · {form.code || '—'}</strong></div>
        <div className="review-row"><span>What it handles</span><strong>{form.description || '—'}</strong></div>
        <div className="review-row"><span>Admins</span><strong>{Array.isArray(form.admins) ? form.admins.join(', ') : form.admins}</strong></div>
        <div className="review-row"><span>Template</span><strong>{form.template || '—'}</strong></div>
        <div className="review-row"><span>Words</span><strong>{form.caseWord} / {form.pluralWord}, {form.personWord}</strong></div>
        <div className="review-row"><span>Teams</span><strong>{form.teams.length} defined</strong></div>
        <div className="review-row"><span>Categories</span><strong>{form.categories.length} defined</strong></div>
        <div className="review-row"><span>Calendar</span><strong>{form.calendar}</strong></div>
      </div>
      
      <div className="warning-banner">
        Go live adds the project to the project switcher with its own words and mark. Its admins can start work on it at once.
      </div>
    </>
  );
}