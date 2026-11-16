import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ChevronDown, ChevronRight, Folder, Layers, Loader2, Edit, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import '../styles/workflow-module.css';

const API_BASE_URL = 'https://localhost:7214/api/Lookup';
const LOOKUP_LIST_ID = 1; 

export default function Lookups() {
  const [items, setItems] = useState([]); 
  const [treeData, setTreeData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState([]); 

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [activeParent, setActiveParent] = useState(null); 

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    parentItemId: '',
    sortOrder: 0
  });

  // ── 1. GET API (Data Fetch, Sort & Tree Build) ──
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/LookupItemGet?id=${LOOKUP_LIST_ID}`);
      
      if (response.data && response.data.isSuccess) {
        const rawData = response.data.data;
        
        // 1. Sort by sortOrder
        const sortedData = [...rawData].sort((a, b) => {
          const orderA = Number(a.sortOrder) || 0;
          const orderB = Number(b.sortOrder) || 0;
          return orderA - orderB;
        });

        setItems(sortedData);

        // 2. Build Tree (Only Root -> Child. No grand-children)
        const buildTree = (data, parentId = null) => {
          return data
            .filter(item => {
              const itemParentId = (!item.parentItemId || item.parentItemId === 0) ? null : item.parentItemId;
              return itemParentId === parentId;
            })
            .map(item => {
              // Only build children for root items. Children won't have further children.
              const children = parentId === null ? buildTree(data, item.id) : [];
              return { ...item, children: children };
            });
        };
        
        setTreeData(buildTree(sortedData, null));
      }
    } catch (error) {
      console.error("GET Error:", error);
      toast.error('Failed to fetch data from API');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchItems(); 
  }, []); 

  const toggleNode = (id) => {
    setExpandedNodes(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // ── Modal Handlers ──
  const openAddModal = (parent = null) => {
    setEditingItem(null);
    setActiveParent(parent);
    setFormData({ 
      name: '', 
      code: '', 
      parentItemId: parent ? parent.id : '', 
      sortOrder: parent ? (parent.children?.length || 0) + 1 : treeData.length + 1 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setActiveParent(null);
    setFormData({ 
      name: item.name, 
      code: item.code || '', 
      parentItemId: item.parentItemId || '', 
      sortOrder: item.sortOrder || 0 
    });
    setIsModalOpen(true);
  };

  // ── 2. POST API (Save/Update) ──
  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Name is required');
    setIsSaving(true);

    let finalCode = formData.code.trim();
    if (!finalCode) {
      finalCode = formData.name.toLowerCase().replace(/\s+/g, '_');
    }

    const apiPayload = {
      lookupListId: LOOKUP_LIST_ID,
      userId: 0, 
      items: [
        {
          id: editingItem ? editingItem.id : 0, 
          code: finalCode,
          label: formData.name, 
          parentItemId: formData.parentItemId ? Number(formData.parentItemId) : 0, 
          sortOrder: Number(formData.sortOrder) || 0,
          attributesJson: "{}"
        }
      ]
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/LookupItemsSave`, apiPayload);
      if (response.data.isSuccess || response.status === 200) {
        toast.success(editingItem ? 'Updated successfully!' : 'Saved successfully!');
        setIsModalOpen(false);
        fetchItems(); 
        
        if (!editingItem && activeParent && !expandedNodes.includes(activeParent.id)) {
          setExpandedNodes(prev => [...prev, activeParent.id]);
        }
      }
    } catch (error) {
      console.error("POST Error:", error);
      toast.error('Failed to save data to API');
    } finally {
      setIsSaving(false);
    }
  };

  // Dropdown Options: Only Root Nodes can be parents
  const getDropdownOptions = () => {
    return treeData.map(node => ({ value: node.id, label: node.name }));
  };

  // ⭐ RENDER TREE (Exact match to your image) ⭐
  const renderTree = (nodes, depth = 0) => {
    return nodes.map(node => {
      const isExpanded = expandedNodes.includes(node.id);
      const hasChildren = node.children && node.children.length > 0;
      
      // Sirf Root (depth 0) items ke child ban sakte hain
      const canHaveChildren = depth === 0; 

      // Icons: Red Folder for Root, Grey Layers for Child
      const Icon = depth === 0 ? Folder : Layers;
      const iconColor = depth === 0 ? "var(--primary-red)" : "#64748B";

      return (
        <div key={node.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div 
            style={{ 
              display: 'flex', alignItems: 'center', padding: '16px 20px', 
              paddingLeft: `${20 + depth * 30}px`, // Indentation for children
              background: isExpanded ? '#F8FAFC' : '#fff', 
              cursor: hasChildren ? 'pointer' : 'default'
            }} 
            onClick={() => hasChildren && toggleNode(node.id)}
          >
            {/* Chevron Arrow */}
            <div style={{ width: 24, color: '#64748B', display: 'flex', alignItems: 'center' }}>
              {hasChildren ? (isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />) : null}
            </div>
            
            {/* Folder/Layers Icon */}
            <Icon size={18} color={iconColor} style={{ marginRight: 12 }} />
            
            {/* Item Name */}
            <div style={{ flex: 1, fontWeight: depth === 0 ? 600 : 500, fontSize: 15, color: '#0F172A' }}>
              {node.name}
            </div>
            
            {/* Right Side Actions (Minimal look like image) */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              
              {/* Edit Button */}
              <button 
                className="wf-btn wf-btn--ghost" 
                style={{ padding: '4px 8px', fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }} 
                onClick={(e) => { e.stopPropagation(); openEditModal(node); }}
              >
                <Edit size={14} /> Edit
              </button>
              
              {/* Add Child Button (Only for Root items) */}
              {canHaveChildren && (
                <button 
                  className="wf-btn wf-btn--ghost" 
                  style={{ padding: '4px 8px', fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }} 
                  onClick={(e) => { e.stopPropagation(); openAddModal(node); }}
                >
                  <Plus size={14} /> Add
                </button>
              )}
            </div>
          </div>

          {/* Render Children */}
          {isExpanded && hasChildren && (
            <div style={{ background: '#F8FAFC' }}>
              {renderTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
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
          <p className="wf-subtitle">Manage hierarchy</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Ek button Add New Item ka (optional, agar aap chahein) */}
          <button className="wf-btn wf-btn--secondary" onClick={() => openAddModal(null)}>
            <Plus size={16} /> Add New Item
          </button>
          <button className="wf-btn wf-btn--primary" onClick={() => openAddModal(null)}>
            <Plus size={16} /> Add Root Lookup
          </button>
        </div>
      </div>

      {/* MAIN TREE CARD */}
      <div className="wf-card" style={{ overflow: 'hidden', marginBottom: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* Card Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#334155', margin: 0 }}>Active Lookups</h2>
        </div>
        
        {/* List Items */}
        <div>
           {treeData.length === 0 ? (
             <div style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>No lookups found. Add one to get started.</div>
           ) : renderTree(treeData, 0)}
        </div>
      </div>

      {/* MODAL */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? `Edit Item: ${editingItem.name}` : (activeParent ? `Add to "${activeParent.name}"` : 'Add Root Lookup')}
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
          <label className="wf-label">Item Name <span className="wf-label__req"> *</span></label>
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
              <option value="">-- No Parent (Root Level) --</option>
              {/* Dropdown mein sirf Root items aayenge */}
              {getDropdownOptions().filter(opt => !editingItem || opt.value !== editingItem.id).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
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
