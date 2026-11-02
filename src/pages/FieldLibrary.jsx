import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Search, Edit, Trash2, FileText, AlertCircle } from 'lucide-react';
import { formsApi } from '../api/forms.api';
import FieldModal from './FieldModal';
import '../styles/workflow-module.css';

const TYPE_LABELS = {
  text: 'Text',
  textarea: 'Text Area',
  number: 'Number',
  date: 'Date',
  dropdown: 'Dropdown',
  radio: 'Radio',
  checkbox: 'Checkbox',
  file: 'File Upload',
};

export default function FieldLibrary() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['field-library'],
    queryFn: formsApi.listFields,
  });

  const deleteMutation = useMutation({
    mutationFn: formsApi.deleteField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-library'] });
      toast.success('Field deleted');
    },
    onError: (err) => toast.error(err.message),
  });

  const fields = useMemo(() => {
    const items = data?.items ?? [];
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter(
      (f) =>
        f.label.toLowerCase().includes(s) ||
        f.fieldKey.toLowerCase().includes(s) ||
        f.fieldType.toLowerCase().includes(s)
    );
  }, [data, search]);

  const handleDelete = (field) => {
    if (!window.confirm(`Delete "${field.label}"? This cannot be undone.`)) return;
    deleteMutation.mutate(field.id);
  };

  const openCreate = () => {
    setEditingField(null);
    setModalOpen(true);
  };

  const openEdit = (field) => {
    setEditingField(field);
    setModalOpen(true);
  };

  return (
    <div className="wf-page">
      {/* Header */}
      <div className="wf-header">
        <div>
          <h1 className="wf-title">Field Library</h1>
          <p className="wf-subtitle">
            Reusable form fields — used across all forms in this project
          </p>
        </div>
        <button className="wf-btn wf-btn--primary" onClick={openCreate}>
          <Plus size={16} /> Add Field
        </button>
      </div>

      {/* Toolbar */}
      <div className="wf-toolbar">
        <div className="wf-search">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fields by label, key or type…"
          />
        </div>
        <span style={{ fontSize: 13, color: '#64748B' }}>
          {fields.length} {fields.length === 1 ? 'field' : 'fields'}
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="wf-table-wrap">
          <div className="wf-table__empty">Loading…</div>
        </div>
      ) : fields.length === 0 ? (
        <div className="wf-table-wrap">
          <div className="wf-empty">
            <div className="wf-empty__icon">
              <FileText size={40} />
            </div>
            <div className="wf-empty__title">
              {search ? 'No matching fields' : 'No fields yet'}
            </div>
            <div className="wf-empty__msg">
              {search
                ? 'Try a different search term'
                : 'Create your first reusable field to get started'}
            </div>
            {!search && (
              <button className="wf-btn wf-btn--primary" onClick={openCreate}>
                <Plus size={16} /> Add Field
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="wf-table-wrap">
          <table className="wf-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>#</th>
                <th>Label</th>
                <th>Field Key</th>
                <th>Type</th>
                <th>Required</th>
                <th>Created</th>
                <th style={{ width: 120, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f, idx) => (
                <tr key={f.id}>
                  <td style={{ color: '#94A3B8' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 500 }}>{f.label}</td>
                  <td>
                    <span className="wf-key-tag">{f.fieldKey}</span>
                  </td>
                  <td>
                    <span className="wf-badge wf-badge--neutral">
                      {TYPE_LABELS[f.fieldType] || f.fieldType}
                    </span>
                  </td>
                  <td>
                    {f.required ? (
                      <span className="wf-badge wf-badge--warning">Required</span>
                    ) : (
                      <span style={{ color: '#94A3B8', fontSize: 12 }}>Optional</span>
                    )}
                  </td>
                  <td style={{ color: '#64748B', fontSize: 13 }}>{f.createdAt}</td>
                  <td>
                    <div className="wf-table__actions">
                      <button
                        className="wf-btn wf-btn--ghost wf-btn--icon"
                        onClick={() => openEdit(f)}
                        title="Edit"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        className="wf-btn wf-btn--ghost wf-btn--icon"
                        onClick={() => handleDelete(f)}
                        title="Delete"
                        style={{ color: '#DC2626' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <FieldModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        field={editingField}
      />
    </div>
  );
}