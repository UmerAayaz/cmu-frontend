import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/localApi.js'
import PageHeader from '../../components/PageHeader.jsx'

function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div style={{ border: '1px solid #efc7ca', background: '#fff3f4', color: '#9d222a', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 }}>{message}</div>
  )
}

function EmptyState({ title, description }) {
  return (
    <div style={{ padding: 48, textAlign: 'center', color: '#6b7280' }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
      <div style={{ fontWeight: 600, color: '#111827', fontSize: 16, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{description}</div>
    </div>
  )
}

function ConfirmDialog({ open, title, variant = 'primary', confirmLabel, onConfirm, onCancel, children }) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(24,27,31,.45)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 20 }} onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div style={{ width: 'min(520px, 100%)', background: '#fff', borderRadius: 14, boxShadow: '0 24px 80px rgba(0,0,0,.22)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18, color: '#111827' }}>{title}</h3>
          <button onClick={onCancel} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>
        <div style={{ padding: 22, fontSize: 14, color: '#374151' }}>{children}</div>
        <div style={{ padding: '14px 22px', borderTop: '1px solid #f3f4f6', background: '#fafafa', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onCancel} style={{ padding: '9px 18px', background: '#fff', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '9px 18px', background: variant === 'danger' ? '#dc2626' : 'var(--primary-red, #dc2626)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{confirmLabel || 'Confirm'}</button>
        </div>
      </div>
    </div>
  )
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts || toasts.length === 0) return null
  const palette = {
    success: { bg: '#D1FAE5', fg: '#065F46' },
    error:   { bg: '#FEE2E2', fg: '#991B1B' },
    warning: { bg: '#FEF3C7', fg: '#92400E' },
    info:    { bg: '#DBEAFE', fg: '#1E40AF' },
  }
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => {
        const c = palette[t.type] || palette.info
        return (
          <div key={t.id} style={{ padding: '12px 16px', borderRadius: 8, minWidth: 280, maxWidth: 420, background: c.bg, color: c.fg, fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <span>{t.message}</span>
            <button onClick={() => onRemove(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'inherit', padding: 0 }}>×</button>
          </div>
        )
      })}
    </div>
  )
}

function useToast() {
  const [toasts, setToasts] = useState([])
  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((p) => [...p, { id, message, type }])
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), duration)
  }
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id))
  return { toasts, showToast, removeToast }
}

const STATUS_MAP = {
  Draft:     { key: 'draft',     label: 'Draft',     icon: '○' },
  Published: { key: 'published', label: 'Published', icon: '●' },
  Archived:  { key: 'archived',  label: 'Archived',  icon: '◌' },
}
const getStatusMeta = (s) => STATUS_MAP[s] || STATUS_MAP.Draft

function timeAgo(dateStr) {
  if (!dateStr) return 'Never'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function parseWorkflowUsage(workflows, formId, formsById = {}) {
  const result = { workflows: [], totalStages: 0 }
  if (!formId) return result
  const targetFormId = formId.toLowerCase()
  const formVersion = formsById[targetFormId]?.version
  workflows.forEach((w) => {
    if (w.status === 2 || w.status === 'Archived') return
    try {
      const designer = JSON.parse(w.designerJson || '{}')
      const nodes = designer.Nodes || designer.nodes || []
      const matching = nodes.filter((n) => ((n.FormId || n.formId || '').toLowerCase() === targetFormId))
      if (matching.length > 0) {
        result.totalStages += matching.length
        result.workflows.push({
          workflowId: w.id,
          workflowName: w.name,
          workflowStatus: w.status,
          workflowVersion: w.version,
          formVersion,
          stageNames: matching.map((n) => n.Name || n.name || 'Untitled'),
        })
      }
    } catch { /* ignore */ }
  })
  return result
}

function getWorkflowStatusLabel(status) {
  if (status === 1) return { label: 'Published', key: 'published' }
  if (status === 0) return { label: 'Draft', key: 'draft' }
  return { label: 'Archived', key: 'archived' }
}

export default function FormsListPage({ navigate }) {
  const [forms, setForms] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')
  const [updatingFormId, setUpdatingFormId] = useState('')
  const [hoveredFormId, setHoveredFormId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [confirmState, setConfirmState] = useState(null)
  const { toasts, showToast, removeToast } = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const [formsData, wfs] = await Promise.all([
        api('/forms?includeAllVersions=true'),
        api('/workflow-definitions').catch(() => []),
      ])
      setForms(Array.isArray(formsData) ? formsData : [])
      setWorkflows(Array.isArray(wfs) ? wfs : [])
      setError('')
    } catch (err) {
      console.error('LOAD FAILED:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const formsById = useMemo(() => {
    const m = {}; forms.forEach((f) => { m[f.id.toLowerCase()] = f }); return m
  }, [forms])

  const usageMap = useMemo(() => {
    const m = {}
    forms.forEach((f) => { m[f.id.toLowerCase()] = parseWorkflowUsage(workflows, f.id, formsById) })
    return m
  }, [forms, workflows, formsById])

  const latestByKey = useMemo(() => {
    const m = {}
    forms.forEach((f) => {
      const key = f.formKey || f.id
      if (!m[key] || (f.version || 0) > (m[key].version || 0)) m[key] = f
    })
    return m
  }, [forms])

  const filtered = useMemo(() => forms.filter((f) => {
    const key = f.formKey || f.id
    if (latestByKey[key]?.id !== f.id) return false
    if (search && !f.name?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatus && f.status !== filterStatus) return false
    return true
  }), [forms, search, filterStatus, latestByKey])

  const stats = useMemo(() => {
    let total = 0, published = 0, needsAttention = 0
    filtered.forEach((f) => {
      total++
      if (f.status === 'Published') published++
      const hasOldInUse = forms.some((old) =>
        old.formKey === f.formKey && old.id !== f.id &&
        (usageMap[old.id.toLowerCase()]?.workflows.length || 0) > 0
      )
      if (hasOldInUse) needsAttention++
    })
    return { total, published, needsAttention }
  }, [filtered, forms, usageMap])

  const publishForm = (form) => {
    setConfirmState({
      title: `Publish "${form.name}"?`,
      variant: 'primary',
      confirmLabel: 'Publish',
      content: <p style={{ margin: 0 }}>This will make <strong>{form.name}</strong> available in the workflow designer. You can still create new versions later.</p>,
      onConfirm: async () => {
        setConfirmState(null); setBusyId(form.id)
        try {
          await api(`/forms/${form.id}/publish`, { method: 'POST' })
          showToast(`"${form.name}" published successfully`, 'success')
          await load()
        } catch (err) { showToast(`Publish failed: ${err.message}`, 'error') }
        finally { setBusyId('') }
      },
    })
  }

  const createNewVersion = (form) => {
    setConfirmState({
      title: 'Create new version?',
      variant: 'primary',
      confirmLabel: 'Create version',
      content: <p style={{ margin: 0 }}>A new <strong>Draft</strong> version of <strong>{form.name}</strong> will be created. Workflows will continue using the current published version until you publish the new one.</p>,
      onConfirm: async () => {
        setConfirmState(null); setBusyId(form.id)
        try {
          const created = await api(`/forms/${form.id}/new-version`, { method: 'POST' })
          showToast(`New version v${created.version} created`, 'success')
          navigate(created.id)
        } catch (err) { showToast(`Create version failed: ${err.message}`, 'error') }
        finally { setBusyId('') }
      },
    })
  }

  const migrateFormToLatest = (latestForm, oldForm, workflowUsages) => {
    if (!oldForm || !workflowUsages || workflowUsages.length === 0) return
    setConfirmState({
      title: 'Update to latest version?',
      variant: 'primary',
      confirmLabel: `Update to v${latestForm.version}`,
      content: (
        <>
          <div style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
            <span style={{ opacity: 0.6 }}>v{oldForm.version}</span>
            {' → '}
            <span style={{ color: 'var(--primary-red, #dc2626)' }}>v{latestForm.version}</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>Workflows to migrate ({workflowUsages.length})</div>
            {workflowUsages.map((w) => {
              const st = getWorkflowStatusLabel(w.workflowStatus)
              return (
                <div key={w.workflowId} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
                  <span><strong>{w.workflowName}</strong> · v{w.workflowVersion}</span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: st.key === 'published' ? '#D1FAE5' : '#FEF3C7', color: st.key === 'published' ? '#065F46' : '#92400E' }}>{st.label}</span>
                </div>
              )
            })}
          </div>
        </>
      ),
      onConfirm: async () => {
        setConfirmState(null); setUpdatingFormId(latestForm.id)
        try {
          const result = await api('/workflow-definitions/migrate-form', {
            method: 'POST',
            body: { oldFormId: oldForm.id, newFormId: latestForm.id },
          })
          if (result.updatedCount > 0) showToast(`${result.updatedCount} workflow(s) updated to use v${latestForm.version}`, 'success', 5500)
          else showToast('No workflows were updated', 'info')
          if (result.warnings?.length > 0) result.warnings.forEach((w) => showToast(w, 'warning', 6500))
          await load()
        } catch (err) { showToast(`Update failed: ${err.message}`, 'error', 6500) }
        finally { setUpdatingFormId('') }
      },
    })
  }

  return (
    <>
      <PageHeader
        eyebrow="E-FORM BUILDER"
        title="Forms Library"
        description="Create and manage reusable forms attached to workflow stages"
        actions={
          <div className="page-actions">
            <button className="btn btn-secondary" onClick={() => navigate('library')}>📚 Field Library</button>
            <button className="btn btn-primary" onClick={() => navigate('new')}>+ Create Form</button>
          </div>
        }
      />

      <ErrorBanner message={error} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <div style={{ padding: '14px 18px', borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', borderLeft: '4px solid #9ca3af' }}>
          <span style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Total Forms</span>
          <strong style={{ fontSize: 24, color: '#111827' }}>{stats.total}</strong>
        </div>
        <div style={{ padding: '14px 18px', borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', borderLeft: '4px solid var(--primary-red, #dc2626)' }}>
          <span style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Published</span>
          <strong style={{ fontSize: 24, color: '#111827' }}>{stats.published}</strong>
        </div>
        <div style={{ padding: '14px 18px', borderRadius: 10, background: '#fff', border: '1px solid #e5e7eb', borderLeft: '4px solid #f59e0b' }}>
          <span style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Needs Attention</span>
          <strong style={{ fontSize: 24, color: '#111827' }}>{stats.needsAttention}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="🔍 Search forms by name…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200, padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13 }} />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, background: '#fff' }}>
          <option value="">All statuses</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Archived">Archived</option>
        </select>
        {(search || filterStatus) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setFilterStatus('') }}>Clear filters</button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading forms…</div>
      ) : filtered.length === 0 ? (
        <section className="panel" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
          <EmptyState
            title={forms.length === 0 ? 'No forms yet' : 'No forms match your filters'}
            description={forms.length === 0 ? 'Create your first form to get started.' : 'Try clearing filters or search for something else.'}
          />
        </section>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map((form) => {
            const statusMeta = getStatusMeta(form.status)
            const formUsage = usageMap[form.id.toLowerCase()] || { workflows: [], totalStages: 0 }
            const formIsInUse = formUsage.workflows.length > 0
            const oldVersionsInUse = forms.filter((old) =>
              old.formKey === form.formKey && old.id !== form.id &&
              (usageMap[old.id.toLowerCase()]?.workflows.length || 0) > 0
            ).sort((a, b) => (b.version || 0) - (a.version || 0))
            const mostRecentOld = oldVersionsInUse[0] || null
            const mostRecentOldUsage = mostRecentOld ? usageMap[mostRecentOld.id.toLowerCase()] : null
            const hasOldInUse = oldVersionsInUse.length > 0
            const isBusy = busyId === form.id
            const isUpdating = updatingFormId === form.id
            const isHovered = hoveredFormId === form.id

            return (
              <article
                key={form.id}
                onClick={() => navigate(form.id)}
                onMouseEnter={() => setHoveredFormId(form.id)}
                onMouseLeave={() => setHoveredFormId(null)}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 12, padding: 18, borderRadius: 12,
                  background: hasOldInUse ? '#fffdf5' : '#fff',
                  border: '2px solid ' + (hasOldInUse ? '#fcd34d' : 'var(--primary-red, #dc2626)'),
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: hasOldInUse ? '#f59e0b' : 'var(--primary-red, #dc2626)', borderRadius: '12px 0 0 12px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      v{form.version}
                      <span style={{ display: 'inline-block', padding: '1px 6px', marginLeft: 6, borderRadius: 4, background: '#fff', color: 'var(--primary-red, #dc2626)', fontSize: 9, fontWeight: 700, border: '1px solid var(--primary-red, #dc2626)' }}>Latest</span>
                      {form.fieldCount > 0 && ` · ${form.fieldCount} fields`}
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: form.status === 'Published' ? '#d1fae5' : form.status === 'Draft' ? '#fef3c7' : '#f3f4f6', color: form.status === 'Published' ? '#065f46' : form.status === 'Draft' ? '#92400e' : '#4b5563' }}>
                    <span style={{ fontSize: 8 }}>{statusMeta.icon}</span>{statusMeta.label}
                  </span>
                </div>

                {form.description && <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{form.description}</div>}

                {hasOldInUse && mostRecentOldUsage && (
                  <div style={{ padding: '10px 12px', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid #fcd34d', borderLeft: '4px solid #f59e0b', borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 2 }}>
                      Old version v{mostRecentOld.version} is still used in {mostRecentOldUsage.workflows.length} workflow{mostRecentOldUsage.workflows.length !== 1 ? 's' : ''}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); migrateFormToLatest(form, mostRecentOld, mostRecentOldUsage.workflows) }} disabled={isUpdating} style={{ marginTop: 8, padding: '6px 10px', fontSize: 11.5, fontWeight: 600, color: '#fff', background: '#f59e0b', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                      {isUpdating ? 'Updating…' : `Update to v${form.version} →`}
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 6, background: formIsInUse ? '#fff' : '#f9fafb', border: '1px solid ' + (formIsInUse ? 'var(--primary-red, #dc2626)' : '#e5e7eb'), fontSize: 12, color: formIsInUse ? 'var(--primary-red, #dc2626)' : '#6b7280' }}>
                  {formIsInUse ? (
                    <>
                      <strong>Used in {formUsage.workflows.length} workflow{formUsage.workflows.length !== 1 ? 's' : ''}</strong>
                      <span style={{ opacity: 0.7 }}>· {formUsage.totalStages} stage{formUsage.totalStages !== 1 ? 's' : ''}</span>
                    </>
                  ) : (
                    <span>{hasOldInUse ? 'Not used directly — old versions in workflows above' : 'Not used in any workflow'}</span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingTop: 8, borderTop: '1px solid #f3f4f6', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, background: '#f9fafb', border: '1px solid #f3f4f6', fontSize: 11, color: '#6b7280' }}>🕒 {timeAgo(form.createdAtUtc || form.updatedAtUtc)}</span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); navigate(form.id) }}>Open</button>
                    {form.status === 'Draft' && (
                      <>
                        <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); navigate(form.id) }}>Edit</button>
                        <button className="btn btn-primary btn-sm" disabled={isBusy} onClick={(e) => { e.stopPropagation(); publishForm(form) }}>{isBusy ? 'Publishing…' : 'Publish'}</button>
                      </>
                    )}
                    {form.status === 'Published' && (
                      <button className="btn btn-secondary btn-sm" disabled={isBusy} onClick={(e) => { e.stopPropagation(); createNewVersion(form) }}>{isBusy ? 'Preparing…' : 'Edit'}</button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <ConfirmDialog open={!!confirmState} title={confirmState?.title} variant={confirmState?.variant} confirmLabel={confirmState?.confirmLabel} onConfirm={confirmState?.onConfirm} onCancel={() => setConfirmState(null)}>
        {confirmState?.content}
      </ConfirmDialog>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}