import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ChevronRight, ChevronLeft, Plus, Trash2, Check, X } from 'lucide-react';
import { projectsApi } from '../api/projects.api';
import { useProjectStore } from '../store/projectStore';
import '../styles/workflow-module.css';

const STEPS = ['Info', 'Teams', 'Categories', 'Review'];

// Helper to auto-pick a theme based on string hash
const THEME_KEYS = ['blue', 'red', 'purple', 'teal', 'amber', 'emerald', 'rose', 'slate'];
const getAutoTheme = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return THEME_KEYS[hash % THEME_KEYS.length];
};

export default function CreateProjectWizard() {
  const navigate = useNavigate();
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    department: '',
    startDate: '',
    endDate: '',
    teams: [],
    categories: [],
  });

  const createMutation = useMutation({
    mutationFn: (payload) => projectsApi.create(payload),
    onSuccess: (project) => {
      toast.success('Project created successfully');
      setActiveProject(project);
      navigate(`/projects/${project.id}/dashboard`);
    },
    onError: (err) => toast.error(err.message),
  });

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleNameChange = (name) => {
    update({ name });
    if (!form.code) {
      const code = name.toUpperCase().replace(/[^A-Z0-9]/g, '-').slice(0, 8) + '-2026';
      update({ code });
    }
  };

  const canProceed = () => {
    if (step === 0) return form.name.trim() && form.code.trim();
    return true;
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return toast.error('Project name is required');
    if (!form.code.trim()) return toast.error('Project code is required');
    
    // Auto-assign theme based on code + name
    const autoTheme = getAutoTheme(form.code + form.name);
    
    createMutation.mutate({ 
      ...form, 
      theme: autoTheme, 
      sidebarStyle: 'dark' 
    });
  };

  return (
    <div className="wf-page">
      <div className="wf-header">
        <div>
          <h1 className="wf-title">Create New Project</h1>
          <p className="wf-subtitle">Set up project, teams, categories and workflows</p>
        </div>
        <button className="wf-btn wf-btn--secondary" onClick={() => navigate('/projects')}>
          <X size={16} /> Cancel
        </button>
      </div>

      {/* Stepper */}
      <div className="wf-steps">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`wf-step ${i === step ? 'wf-step--active' : i < step ? 'wf-step--done' : ''}`}
          >
            <div className="wf-step__num">
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="wf-wizard">
        {step === 0 && <StepInfo form={form} update={update} onNameChange={handleNameChange} />}
        {step === 1 && <StepTeams form={form} update={update} />}
        {step === 2 && <StepCategories form={form} update={update} />}
        {step === 3 && <StepReview form={form} />}

        <div className="wf-wizard__footer">
          <button
            className="wf-btn wf-btn--secondary"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              className="wf-btn wf-btn--primary"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className="wf-btn wf-btn--primary"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating…' : '✅ Create Project'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────── STEP 1: Info (Theme Picker Removed) ────────────── */
function StepInfo({ form, update, onNameChange }) {
  return (
    <>
      <h2 className="wf-wizard__title">Project Info</h2>
      <p className="wf-wizard__sub">Basic details of the project</p>

      <div className="wf-row">
        <div className="wf-field">
          <label className="wf-label">Project Name <span className="wf-label__req">*</span></label>
          <input
            className="wf-input"
            value={form.name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Complaint Management Unit"
          />
        </div>
        <div className="wf-field">
          <label className="wf-label">Project Code <span className="wf-label__req">*</span></label>
          <input
            className="wf-input"
            value={form.code}
            onChange={(e) => update({ code: e.target.value.toUpperCase() })}
            placeholder="CMU-2026"
          />
        </div>
      </div>

      <div className="wf-field">
        <label className="wf-label">Description</label>
        <textarea
          className="wf-textarea"
          rows={3}
          value={form.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Brief description of this project"
        />
      </div>

      <div className="wf-row">
        <div className="wf-field">
          <label className="wf-label">Department</label>
          <input
            className="wf-input"
            value={form.department}
            onChange={(e) => update({ department: e.target.value })}
            placeholder="e.g. Customer Care"
          />
        </div>
        <div className="wf-field">
          <label className="wf-label">Start Date</label>
          <input
            type="date"
            className="wf-input"
            value={form.startDate}
            onChange={(e) => update({ startDate: e.target.value })}
          />
        </div>
      </div>
    </>
  );
}

/* ────────────── STEP 2: Teams ────────────── */
function StepTeams({ form, update }) {
  const addTeam = () => {
    update({
      teams: [
        ...form.teams,
        { id: Date.now(), name: '', lead: '', members: [] },
      ],
    });
  };

  const updateTeam = (id, patch) => {
    update({
      teams: form.teams.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });
  };

  const removeTeam = (id) => {
    update({ teams: form.teams.filter((t) => t.id !== id) });
  };

  const addMember = (teamId) => {
    const team = form.teams.find((t) => t.id === teamId);
    updateTeam(teamId, {
      members: [...team.members, { id: Date.now(), name: '', role: 'Officer' }],
    });
  };

  const updateMember = (teamId, memberId, patch) => {
    const team = form.teams.find((t) => t.id === teamId);
    updateTeam(teamId, {
      members: team.members.map((m) => (m.id === memberId ? { ...m, ...patch } : m)),
    });
  };

  const removeMember = (teamId, memberId) => {
    const team = form.teams.find((t) => t.id === teamId);
    updateTeam(teamId, { members: team.members.filter((m) => m.id !== memberId) });
  };

  return (
    <>
      <h2 className="wf-wizard__title">Teams</h2>
      <p className="wf-wizard__sub">Define teams that will handle cases in this project</p>

      {form.teams.map((team, idx) => (
        <div key={team.id} className="wf-team-card">
          <div className="wf-team-card__head">
            <strong>Team {idx + 1}</strong>
            <button type="button" className="wf-btn wf-btn--ghost wf-btn--icon" onClick={() => removeTeam(team.id)} style={{ color: '#DC2626' }}>
              <Trash2 size={14} />
            </button>
          </div>

          <div className="wf-row">
            <div className="wf-field">
              <label className="wf-label">Team Name</label>
              <input className="wf-input" value={team.name} onChange={(e) => updateTeam(team.id, { name: e.target.value })} placeholder="Compliance Team" />
            </div>
            <div className="wf-field">
              <label className="wf-label">Team Lead</label>
              <input className="wf-input" value={team.lead} onChange={(e) => updateTeam(team.id, { lead: e.target.value })} placeholder="Sara Ahmed" />
            </div>
          </div>

          {team.members.length > 0 && (
            <div className="wf-members">
              {team.members.map((m) => (
                <div key={m.id} className="wf-member-row">
                  <input className="wf-input" style={{ padding: '4px 8px', fontSize: 13 }} value={m.name} onChange={(e) => updateMember(team.id, m.id, { name: e.target.value })} placeholder="Member name" />
                  <select className="wf-select" style={{ width: 120, padding: '4px 8px', fontSize: 13 }} value={m.role} onChange={(e) => updateMember(team.id, m.id, { role: e.target.value })}>
                    <option>Officer</option>
                    <option>Verifier</option>
                    <option>Supervisor</option>
                  </select>
                  <button type="button" className="wf-btn wf-btn--ghost wf-btn--icon" onClick={() => removeMember(team.id, m.id)} style={{ color: '#DC2626' }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="button" className="wf-btn wf-btn--secondary" onClick={() => addMember(team.id)} style={{ alignSelf: 'flex-start', fontSize: 12, padding: '5px 10px' }}>
            <Plus size={12} /> Add Member
          </button>
        </div>
      ))}

      <button type="button" className="wf-btn wf-btn--secondary" onClick={addTeam}>
        <Plus size={14} /> Add Team
      </button>
    </>
  );
}

/* ────────────── STEP 3: Categories ────────────── */
function StepCategories({ form, update }) {
  const addCategory = () => {
    update({ categories: [...form.categories, { id: Date.now(), name: '', priority: 'Medium', subCategories: [] }] });
  };
  const updateCat = (id, patch) => {
    update({ categories: form.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  };
  const removeCat = (id) => {
    update({ categories: form.categories.filter((c) => c.id !== id) });
  };
  const addSub = (catId) => {
    const cat = form.categories.find((c) => c.id === catId);
    updateCat(catId, { subCategories: [...cat.subCategories, { id: Date.now(), name: '', products: [] }] });
  };
  const addProduct = (catId, subId) => {
    const cat = form.categories.find((c) => c.id === catId);
    updateCat(catId, {
      subCategories: cat.subCategories.map((s) => s.id === subId ? { ...s, products: [...s.products, { id: Date.now(), name: '', priority: 'Medium' }] } : s)
    });
  };
  const updateSub = (catId, subId, patch) => {
    const cat = form.categories.find((c) => c.id === catId);
    updateCat(catId, { subCategories: cat.subCategories.map((s) => s.id === subId ? { ...s, ...patch } : s) });
  };

  return (
    <>
      <h2 className="wf-wizard__title">Categories & Products</h2>
      <p className="wf-wizard__sub">Hierarchy: Category → Sub-category → Product</p>

      {form.categories.map((cat) => (
        <div key={cat.id} className="wf-cat-card">
          <div className="wf-cat-card__head">
            <div style={{ display: 'flex', gap: 8, flex: 1 }}>
              <input className="wf-input" value={cat.name} onChange={(e) => updateCat(cat.id, { name: e.target.value })} placeholder="Category name" />
              <select className="wf-select" style={{ width: 130 }} value={cat.priority} onChange={(e) => updateCat(cat.id, { priority: e.target.value })}>
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </select>
            </div>
            <button type="button" className="wf-btn wf-btn--ghost wf-btn--icon" onClick={() => removeCat(cat.id)} style={{ color: '#DC2626' }}>
              <Trash2 size={14} />
            </button>
          </div>

          {cat.subCategories.map((sub) => (
            <div key={sub.id}>
              <div className="wf-cat-item">
                <input className="wf-input" style={{ padding: '4px 8px', fontSize: 13 }} value={sub.name} onChange={(e) => updateSub(cat.id, sub.id, { name: e.target.value })} placeholder="Sub-category name" />
                <button type="button" className="wf-btn wf-btn--ghost wf-btn--icon" onClick={() => addProduct(cat.id, sub.id)} title="Add product">
                  <Plus size={12} />
                </button>
              </div>

              {sub.products.map((p) => (
                <div key={p.id} className="wf-cat-item wf-cat-item__sub">
                  <input className="wf-input" style={{ padding: '4px 8px', fontSize: 13 }} value={p.name} onChange={(e) => {
                      const cat2 = form.categories.find((c) => c.id === cat.id);
                      const sub2 = cat2.subCategories.find((s) => s.id === sub.id);
                      updateSub(cat.id, sub.id, { products: sub2.products.map((x) => x.id === p.id ? { ...x, name: e.target.value } : x) });
                    }} placeholder="Product name" />
                </div>
              ))}
            </div>
          ))}
          <button type="button" className="wf-btn wf-btn--secondary" onClick={() => addSub(cat.id)} style={{ alignSelf: 'flex-start', fontSize: 12, padding: '5px 10px' }}>
            <Plus size={12} /> Add Sub-category
          </button>
        </div>
      ))}
      <button type="button" className="wf-btn wf-btn--secondary" onClick={addCategory}>
        <Plus size={14} /> Add Category
      </button>
    </>
  );
}

/* ────────────── STEP 4: Review ────────────── */
function StepReview({ form }) {
  return (
    <>
      <h2 className="wf-wizard__title">Review & Create</h2>
      <p className="wf-wizard__sub">Confirm details before creating the project</p>

      <div className="wf-review">
        <div className="wf-review-row"><span>Project Name</span><strong>{form.name || '—'}</strong></div>
        <div className="wf-review-row"><span>Project Code</span><strong>{form.code || '—'}</strong></div>
        <div className="wf-review-row"><span>Department</span><strong>{form.department || '—'}</strong></div>
        <div className="wf-review-row"><span>Teams</span><strong>{form.teams.length} teams</strong></div>
        <div className="wf-review-row"><span>Categories</span><strong>{form.categories.length} categories</strong></div>
      </div>
    </>
  );
}