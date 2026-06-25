import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = () => api.get('/categories').then(r => setCategories(r.data));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, form);
        toast.success('Updated');
      } else {
        const slug = form.name.toLowerCase().replace(/\s+/g, '-');
        await api.post('/categories', { ...form, slug });
        toast.success('Created');
      }
      setForm({ name: '', description: '' });
      setEditId(null); setShowForm(false); fetch();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this glass category? Sunglasses using it will remain but unlinked.')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Deleted'); fetch(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="heading-display text-2xl">Sunglass Glass Categories</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Glass category is required for all sunglasses products</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', description: '' }); }} className="btn-gold flex items-center gap-2">
            <Plus size={16} /> Add Category
          </button>
        </div>

        {showForm && (
          <div className="card-luxury p-6 mb-6">
            <h3 className="label-luxury mb-4">{editId ? 'Edit Category' : 'New Category'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
              <div>
                <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>Category Name *</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-luxury text-sm" placeholder="e.g. Aviator" />
              </div>
              <div>
                <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>Description</label>
                <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-luxury text-sm" placeholder="Short description" />
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="btn-gold flex items-center gap-2 py-3"><Save size={14} /> Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost py-3 px-3"><X size={14} /></button>
              </div>
            </form>
          </div>
        )}

        <div className="card-luxury overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ borderBottom: '1px solid var(--border-soft)' }}>
              <tr>
                {['Name', 'Slug', 'Description', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 label-luxury" style={{ fontSize: 9 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td className="p-4 font-medium" style={{ color: 'var(--text-main)' }}>{c.name}</td>
                  <td className="p-4 font-mono text-xs" style={{ color: 'var(--text-dim)' }}>{c.slug}</td>
                  <td className="p-4 text-xs" style={{ color: 'var(--text-muted)' }}>{c.description || '—'}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setForm({ name: c.name, description: c.description || '' }); setEditId(c._id); setShowForm(true); }} style={{ color: 'var(--accent-silver)' }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(c._id)} style={{ color: '#e57373' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No glass categories yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
