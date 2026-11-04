import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Folder, Layers, Tag, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import '../styles/workflow-module.css';

// ⭐ Initial Mock Data (Document ke mutabiq)
const INITIAL_DATA = [
  {
    id: 1, name: 'Complaint', priority: 'High',
    subCategories: [
      {
        id: 11, name: 'ATM Issue',
        products: [
          { id: 111, name: 'Card Not Read', priority: 'High' },
          { id: 112, name: 'Cash Jam', priority: 'Critical' },
        ]
      },
      {
        id: 12, name: 'Mobile Banking',
        products: [
          { id: 121, name: 'App Crash', priority: 'High' },
        ]
      }
    ]
  },
  {
    id: 2, name: 'Service Request', priority: 'Medium',
    subCategories: [
      {
        id: 21, name: 'Account Opening',
        products: [
          { id: 211, name: 'KYC Verification', priority: 'Medium' },
        ]
      }
    ]
  }
];

// ── Priority → badge class mapping ──
const priorityBadgeClass = (priority) => {
  switch (priority) {
    case 'Critical': return 'wf-badge--critical';
    case 'High':     return 'wf-badge--high';
    case 'Medium':   return 'wf-badge--medium';
    case 'Low':      return 'wf-badge--low';
    default:         return 'wf-badge--neutral';
  }
};

export default function Lookups() {
  const [categories, setCategories] = useState(INITIAL_DATA);
  const [expandedCats, setExpandedCats] = useState([1]); // Default me pehli category khuli ho
  const [expandedSubs, setExpandedSubs] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('category'); // 'category' | 'sub' | 'product'
  const [activeParent, setActiveParent] = useState(null); // Jis parent ke andar add karna hai
  const [formData, setFormData] = useState({ name: '', priority: 'Medium' });

  // ── Handlers ──
  const toggleCat = (id) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSub = (id) => {
    setExpandedSubs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const openModal = (mode, parent = null) => {
    setModalMode(mode);
    setActiveParent(parent);
    setFormData({ name: '', priority: 'Medium' });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return toast.error('Name is required');

    if (modalMode === 'category') {
      const newCat = { id: Date.now(), name: formData.name, priority: formData.priority, subCategories: [] };
      setCategories([...categories, newCat]);
      setExpandedCats([...expandedCats, newCat.id]);
    } 
    else if (modalMode === 'sub') {
      setCategories(categories.map(cat => 
        cat.id === activeParent.id 
          ? { ...cat, subCategories: [...cat.subCategories, { id: Date.now(), name: formData.name, products: [] }] }
          : cat
      ));
    } 
    else if (modalMode === 'product') {
      setCategories(categories.map(cat => {
        if (cat.id !== activeParent.catId) return cat;
        return {
          ...cat,
          subCategories: cat.subCategories.map(sub => {
            if (sub.id !== activeParent.subId) return sub;
            return { ...sub, products: [...sub.products, { id: Date.now(), name: formData.name, priority: formData.priority }] };
          })
        };
      }));
      setExpandedSubs([...expandedSubs, activeParent.subId]);
    }

    toast.success(`${modalMode === 'category' ? 'Category' : modalMode === 'sub' ? 'Sub-category' : 'Product'} added!`);
    setIsModalOpen(false);
  };

  return (
    <div className="wf-page">
      {/* Header */}
      <div className="wf-header">
        <div>
          <h1 className="wf-title">Categories & Products</h1>
          <p className="wf-subtitle">Manage the master hierarchy for complaints</p>
        </div>
        <button className="wf-btn wf-btn--primary" onClick={() => openModal('category')}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Tree View */}
      <div className="wf-card" style={{ overflow: 'hidden' }}>
        {categories.map(cat => {
          const isCatOpen = expandedCats.includes(cat.id);
          return (
            <div key={cat.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
              
              {/* Category Row */}
              <div 
                style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', background: isCatOpen ? '#F8FAFC' : '#fff', cursor: 'pointer' }}
                onClick={() => toggleCat(cat.id)}
              >
                <div style={{ width: 24, color: '#64748B' }}>
                  {isCatOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
                <Folder size={18} color="var(--primary-red)" style={{ marginRight: 12 }} />
                <div style={{ flex: 1, fontWeight: 600, fontSize: 15, color: '#0F172A' }}>{cat.name}</div>
                <span className={`wf-badge ${priorityBadgeClass(cat.priority)}`}>
                  {cat.priority} Priority
                </span>
                <button 
                  className="wf-btn wf-btn--secondary" 
                  style={{ marginLeft: 16, padding: '4px 12px', fontSize: 12 }}
                  onClick={(e) => { e.stopPropagation(); openModal('sub', cat); }}
                >
                  <Plus size={12} /> Add Sub-category
                </button>
              </div>

              {/* Sub-categories List */}
              {isCatOpen && (
                <div style={{ padding: '0 20px 16px 56px' }}>
                  {cat.subCategories.map(sub => {
                    const isSubOpen = expandedSubs.includes(sub.id);
                    return (
                      <div key={sub.id} style={{ marginTop: 8, border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
                        
                        {/* Sub-category Row */}
                        <div 
                          style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: '#fff', cursor: 'pointer' }}
                          onClick={() => toggleSub(sub.id)}
                        >
                          <div style={{ width: 20, color: '#94A3B8' }}>
                            {isSubOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>
                          <Layers size={16} color="#64748B" style={{ marginRight: 10 }} />
                          <div style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{sub.name}</div>
                          <button 
                            className="wf-btn wf-btn--ghost" 
                            style={{ fontSize: 12, padding: '4px 8px' }}
                            onClick={(e) => { e.stopPropagation(); openModal('product', { catId: cat.id, subId: sub.id }); }}
                          >
                            <Plus size={12} /> Add Product
                          </button>
                        </div>

                        {/* Products List */}
                        {isSubOpen && (
                          <div style={{ background: '#F8FAFC', padding: '8px 16px 12px 46px' }}>
                            {sub.products.length === 0 ? (
                              <div style={{ fontSize: 12, color: '#94A3B8', padding: '8px 0' }}>No products yet.</div>
                            ) : (
                              sub.products.map(prod => (
                                <div key={prod.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 0', fontSize: 13 }}>
                                  <Tag size={14} color="#94A3B8" style={{ marginRight: 10 }} />
                                  <div style={{ flex: 1, color: '#334155' }}>{prod.name}</div>
                                  <span className={`wf-badge ${priorityBadgeClass(prod.priority)}`} style={{ fontSize: 10 }}>
                                    {prod.priority}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {cat.subCategories.length === 0 && (
                    <div style={{ fontSize: 13, color: '#94A3B8', padding: '8px 0' }}>No sub-categories yet.</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ⭐ Single Smart Modal (Category / Sub / Product) */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={
          modalMode === 'category' ? 'Add New Category' : 
          modalMode === 'sub' ? `Add Sub-category to "${activeParent?.name}"` : 
          'Add New Product'
        }
        footer={
          <>
            <button className="wf-btn wf-btn--secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="wf-btn wf-btn--primary" onClick={handleSave}>Save</button>
          </>
        }
      >
        <div className="wf-field">
          <label className="wf-label">
            {modalMode === 'category' ? 'Category Name' : modalMode === 'sub' ? 'Sub-category Name' : 'Product Name'} <span className="wf-label__req">*</span>
          </label>
          <input 
            className="wf-input" 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
            placeholder={modalMode === 'category' ? 'e.g. Complaint' : modalMode === 'sub' ? 'e.g. ATM Issue' : 'e.g. Cash Jam'} 
            autoFocus
          />
        </div>
        
        {modalMode !== 'sub' && (
          <div className="wf-field">
            <label className="wf-label">Priority</label>
            <select 
              className="wf-select"
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="Low"      >Low</option>
              <option value="Medium"   >Medium</option>
              <option value="High"     >High</option>
              <option value="Critical" >Critical</option>
            </select>
          </div>
        )}
      </Modal>
    </div>
  );
}