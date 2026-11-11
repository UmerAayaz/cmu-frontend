import { useEffect, useState } from 'react'
import { api } from '../../api/localApi.js'
import PageHeader from '../../components/PageHeader.jsx'
import FieldModal from './FieldModal.jsx'
import './eform.css'

export default function FieldLibraryPage({ navigate }) {
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingField, setEditingField] = useState(null)

  const load = async () => {
    setLoading(true)
    try { const data = await api('/library-fields'); setFields(Array.isArray(data) ? data : []) }
    catch (err) { console.error(err) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const remove = async (id, label) => {
    if (!window.confirm(`Delete field "${label}"?`)) return
    try { await api(`/library-fields/${id}`, { method: 'DELETE' }); await load() } catch (err) { alert(err.message) }
  }

  return (
    <>
      <PageHeader
        eyebrow="E-FORM BUILDER" title="Field Library" description="Reusable fields available across all forms"
        actions={
          <div className="page-actions">
            {/* <button className="btn btn-secondary" onClick={() => navigate('..')}>← Back to Forms</button> */}
            <button className="btn btn-primary" onClick={() => { setEditingField(null); setShowModal(true) }}>+ Add Field</button>
          </div>
        }
      />
      <section className="panel" style={{ padding: 20 }}>
        {loading ? <div>Loading fields…</div> : fields.length === 0 ? <div>No fields yet.</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead><tr style={{ borderBottom: '2px solid #f3f4f6', textAlign: 'left' }}><th style={{ padding: 12 }}>Label</th><th style={{ padding: 12 }}>Key</th><th style={{ padding: 12 }}>Type</th><th style={{ padding: 12 }}>Actions</th></tr></thead>
            <tbody>
              {fields.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: 12 }}><strong>{f.label}</strong></td>
                  <td style={{ padding: 12 }}><code>{f.fieldKey}</code></td>
                  <td style={{ padding: 12 }}><span className="badge">{f.fieldType}</span></td>
                  <td style={{ padding: 12 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditingField(f); setShowModal(true) }}>Edit</button>
                    <button className="btn btn-danger-soft btn-sm" style={{ marginLeft: 6 }} onClick={() => remove(f.id, f.label)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <FieldModal open={showModal} field={editingField} onClose={() => setShowModal(false)} onSaved={load} />
    </>
  )
}