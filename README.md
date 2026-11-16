import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ChevronDown, ChevronRight, Folder, Layers, Loader2, Edit, Save, Box } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import '../styles/workflow-module.css';

const API_BASE_URL = 'https://localhost:7214/api/Lookup';
const LOOKUP_LIST_ID = 1; 

export default function Lookups() {
  const [allItems, setAllItems] = useState([]); // Flat list ke liye
  const [treeData, setTreeData] = useState([]); // Tree view ke liye
  const [isLoading, setIsLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState([]); 

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [activeParent, setActiveParent] = useState(null); 

  // Form State
  const [formData, setFormData] = useState({
    name: '', code: '', parentItemId: '', sortOrder: 0
  });

  // ── 1. GET API ──
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/LookupItemGet?id=${LOOKUP_LIST_ID}`);
      
      if (response.data && response.data.isSuccess) {
        const rawData = response.data.data;

        // 1. Sort by sortOrder
        const sortedData = [...rawData].sort((a, b) => {
          return (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0);
        });

        // Flat List ke liye save karein
        setAllItems(sortedData);

        // 2. Build Tree (Only Root -> Child)
        const roots = sortedData.filter(item => !item.parentItemId || item.parentItemId === 0);
        const structuredData = roots.map(root => {
          const children = sortedData.filter(item => item.parentItemId === root.id);
          return { ...root, children: children };
        });

        setTreeData(structuredData);
      }
    } catch (error) {
      console.error("GET Error:", error);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []); 

  const toggleNode = (id) => {
    setExpandedNodes(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // ── Modal Handlers ──
  const openAddRootModal = () => {
    setEditingItem(null);
    setActiveParent(null);
    setFormData({ name: '', code: '', parentItemId: '', sortOrder: treeData.length + 1 });
    setIsModalOpen(true);
  };

  const openAddChildModal = (parent) => {
    setEditingItem(null);
    setActiveParent(parent);
    setFormData({ 
      name: '', code: '', parentItemId: parent.id, sortOrder: (parent.children?.length || 0) + 1 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setActiveParent(null);
    setFormData({ 
      name: item.name, code: item.code || '', parentItemId: item.parentItemId || '', sortOrder: item.sortOrder || 0 
    });
    setIsModalOpen(true);
  };

  // ── 2. POST API ──
  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Name is required');
    setIsSaving(true);

    let finalCode = formData.code.trim() || formData.name.toLowerCase().replace(/\s+/g, '_');

    const apiPayload = {
      lookupListId: LOOKUP_LIST_ID,
      userId: 0, 
      items: [{
        id: editingItem ? editingItem.id : 0, 
        code: finalCode,
        label: formData.name, 
        parentItemId: formData.parentItemId ? Number(formData.parentItemId) : 0, 
        sortOrder: Number(formData.sortOrder) || 0,
        attributesJson: "{}"
      }]
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/LookupItemsSave`, apiPayload);
      if (response.data.isSuccess || response.status === 200) {
        toast.success('Saved successfully!');
        setIsModalOpen(false);
        fetchItems(); 
        
        if (!editingItem && activeParent && !expandedNodes.includes(activeParent.id)) {
          setExpandedNodes(prev => [...prev, activeParent.id]);
        }
      }
    } catch (error) {
      console.error("POST Error:", error);
      toast.error('Failed to save data');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="wf-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Loader2 className="animate-spin" size={32} color="var(--primary-red)" />
    </div>
  );

  return (
    <div className="wf-page">
      {/* HEADER */}
      <div className="wf-header">
        <div>
          <h1 className="wf-title">Lookups Management</h1>
          <p className="wf-subtitle">Manage hierarchy and items</p>
        </div>
        <button className="wf-btn wf-btn--primary" onClick={openAddRootModal}>
          <Plus size={16} /> Add Root Lookup
        </button>
      </div>

      {/* ⭐ 1. TREE VIEW ⭐ */}
      <div className="wf-card" style={{ overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', margin: 0 }}>Active Lookups</h2>
        </div>
        
        <div style={{ paddingBottom: '10px' }}>
           {treeData.length === 0 ? (
             <div style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No lookups found.</div>
           ) : (
             treeData.map((root) => {
               const isExpanded = expandedNodes.includes(root.id);
               const hasChildren = root.children && root.children.length > 0;

               return (
                 <div key={root.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                   <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', cursor: hasChildren ? 'pointer' : 'default' }} onClick={() => hasChildren && toggleNode(root.id)}>
                     <div style={{ width: 24, color: '#64748B', display: 'flex', alignItems: 'center' }}>
                       {hasChildren ? (isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />) : null}
                     </div>
                     <Folder size={18} color="var(--primary-red)" style={{ marginRight: 12 }} />
                     <div style={{ flex: 1, fontWeight: 600, fontSize: 15, color: '#0F172A' }}>{root.name}</div>
                     <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                       <button className="wf-btn wf-btn--ghost" style={{ padding: '4px 8px', fontSize: 13, color: '#64748B' }} onClick={(e) => { e.stopPropagation(); openEditModal(root); }}>
                         <Edit size={14} style={{ marginRight: 4 }} /> Edit
                       </button>
                       <button className="wf-btn wf-btn--ghost" style={{ padding: '4px 8px', fontSize: 13, color: '#64748B' }} onClick={(e) => { e.stopPropagation(); openAddChildModal(root); }}>
                         <Plus size={14} style={{ marginRight: 4 }} /> Add
                       </button>
                     </div>
                   </div>

                   {isExpanded && hasChildren && (
                     <div style={{ background: '#F8FAFC' }}>
                       {root.children.map(child => (
                         <div key={child.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 20px 12px 56px', borderTop: '1px solid #F1F5F9' }}>
                           <Layers size={16} color="#64748B" style={{ marginRight: 12 }} />
                           <div style={{ flex: 1, fontWeight: 500, fontSize: 14, color: '#334155' }}>{child.name}</div>
                           <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                             <button className="wf-btn wf-btn--ghost" style={{ padding: '4px 8px', fontSize: 13, color: '#64748B' }} onClick={() => openEditModal(child)}>
                               <Edit size={14} style={{ marginRight: 4 }} /> Edit
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               );
             })
           )}
        </div>
      </div>

      {/* ⭐ 2. ALL ITEMS LIST (Flat Table) ⭐ */}
      <div className="wf-card" style={{ overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', margin: 0 }}>Item List</h2>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ padding: '12px 20px', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Item Name</th>
              <th style={{ padding: '12px 20px', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Parent Name</th>
              <th style={{ padding: '12px 20px', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Sort Order</th>
              <th style={{ padding: '12px 20px', fontSize: '13px', color: '#64748B', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.parentItemId ? <Box size={16} color="#94A3B8" /> : <Folder size={16} color="var(--primary-red)" />}
                    <span style={{ fontWeight: 500, color: '#0F172A', fontSize: '14px' }}>{item.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 20px' }}>
                  {item.parentName ? (
                    <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 }}>
                      {item.parentName}
                    </span>
                  ) : (
                    <span style={{ color: '#94A3B8', fontSize: '13px', fontStyle: 'italic' }}>Root Item (None)</span>
                  )}
                </td>
                <td style={{ padding: '12px 20px', fontSize: '13px', color: '#64748B' }}>{item.sortOrder}</td>
                <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                  <button className="wf-btn wf-btn--secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openEditModal(item)}>
                    <Edit size={14} style={{ marginRight: '4px' }} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'Edit Item' : (activeParent ? `Add to "${activeParent.name}"` : 'Add Root Lookup')}
        footer={
          <>
            <button className="wf-btn wf-btn--secondary" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancel</button>
            <button className="wf-btn wf-btn--primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : <><Save size={16} style={{ marginRight: '6px' }}/> Save</>}
            </button>
          </>
        }
      >
        <div className="wf-field">
          <label className="wf-label">Name <span className="wf-label__req"> *</span></label>
          <input className="wf-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Sub Category" autoFocus />
        </div>

        <div className="wf-field">
          <label className="wf-label">Code (Optional)</label>
          <input className="wf-input" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="Auto-generated if blank" />
        </div>

        <div className="wf-field">
          <label className="wf-label">Select Parent (Optional)</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <select 
              className="wf-select" 
              value={formData.parentItemId} 
              onChange={(e) => setFormData({ ...formData, parentItemId: e.target.value })}
              style={{ appearance: 'none', WebkitAppearance: 'none', paddingRight: '40px', width: '100%' }}
            >
              <option value="">-- No Parent (Make it Root) --</option>
              {treeData.map(node => (
                <option key={node.id} value={node.id} disabled={editingItem && node.id === editingItem.id}>
                  {node.name}
                </option>
              ))}
            </select>
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }}>
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        <div className="wf-field">
          <label className="wf-label">Sort Order</label>
          <input type="number" className="wf-input" value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}
