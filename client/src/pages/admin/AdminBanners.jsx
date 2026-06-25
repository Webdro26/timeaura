import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const INIT = { title: '', subtitle: '', image: '', link: '', position: 'hero', order: 0, isActive: true };

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(INIT);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchBanners = () => api.get('/banners/admin/all').then(r => setBanners(r.data));
  useEffect(() => { fetchBanners(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('images', file);
      const res = await api.post('/upload/images', formData);
      setForm(p => ({ ...p, image: res.data.urls[0] }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) return toast.error('Please upload or provide a banner image');
    try {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editId) {
        await api.put(`/banners/${editId}`, payload);
        toast.success('Banner updated');
      } else {
        await api.post('/banners', payload);
        toast.success('Banner created');
      }
      setForm(INIT); setEditId(null); setShowForm(false); fetchBanners();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (b) => {
    setForm({ title: b.title || '', subtitle: b.subtitle || '', image: b.image || '', link: b.link || '', position: b.position, order: b.order, isActive: b.isActive });
    setEditId(b._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try { await api.delete(`/banners/${id}`); toast.success('Deleted'); fetchBanners(); }
    catch { toast.error('Failed'); }
  };

  const toggleActive = async (b) => {
    await api.put(`/banners/${b._id}`, { isActive: !b.isActive });
    fetchBanners();
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="heading-display text-2xl">Homepage Banners</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Manage promotional banners shown on the storefront
            </p>
          </div>
          <button onClick={() => { setForm(INIT); setEditId(null); setShowForm(true); }} className="btn-gold flex items-center gap-2">
            <Plus size={16} /> Add Banner
          </button>
        </div>

        {/* Hero video note */}
        <div className="card-luxury p-5 mb-6" style={{ borderColor: 'var(--border-gold)' }}>
          <h3 className="label-luxury mb-2">Hero Video</h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            The homepage hero uses a scroll-driven video animation. To change the hero video:
          </p>
          <ol className="text-sm mt-2 space-y-1 list-decimal list-inside" style={{ color: 'var(--text-muted)' }}>
            <li>Replace <code style={{ color: 'var(--accent-gold)' }}>client/src/assets/videos/hero.mp4</code> with your new video</li>
            <li>Run the ffmpeg frame extraction command (see README) to regenerate frames in <code style={{ color: 'var(--accent-gold)' }}>client/public/frames/hero/</code></li>
            <li>Restart the dev server</li>
          </ol>
        </div>

        {showForm && (
          <div className="card-luxury p-6 mb-6">
            <h3 className="label-luxury mb-4">{editId ? 'Edit Banner' : 'New Banner'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>Title</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-luxury text-sm" placeholder="e.g. Luxury Sunglasses Collection" />
                </div>
                <div>
                  <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>Subtitle</label>
                  <input value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} className="input-luxury text-sm" placeholder="e.g. Now Available" />
                </div>
                <div>
                  <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>Link (e.g. /shop?tags=new)</label>
                  <input value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} className="input-luxury text-sm" placeholder="/shop" />
                </div>
                <div>
                  <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>Position</label>
                  <select value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} className="input-luxury text-sm">
                    <option value="hero">Hero</option>
                    <option value="mid">Mid Page</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
                <div>
                  <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>Order</label>
                  <input type="number" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} className="input-luxury text-sm" placeholder="0" />
                </div>
              </div>

              <div>
                <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>Banner Image *</label>
                <div className="flex items-center gap-4">
                  {form.image && <img src={form.image} alt="" className="w-24 h-16 object-cover" style={{ borderRadius: 4, background: 'var(--bg-soft)' }} />}
                  <label className="flex items-center gap-2 px-4 py-2.5 cursor-pointer text-xs uppercase tracking-widest" style={{ border: '1px dashed var(--border-soft)', color: 'var(--text-muted)' }}>
                    {uploading ? <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} /> : <Upload size={14} />}
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <span className="text-xs" style={{ color: 'var(--text-dim)' }}>or</span>
                  <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} className="input-luxury text-sm flex-1" placeholder="Paste image URL" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button type="submit" className="btn-gold flex items-center gap-2"><Save size={14} /> {editId ? 'Update' : 'Create'} Banner</button>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(INIT); }} className="btn-ghost px-3"><X size={14} /></button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {banners.map(b => (
            <div key={b._id} className="card-luxury overflow-hidden">
              <div className="relative aspect-[16/7]">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                <span className="badge-gold absolute top-3 left-3 capitalize">{b.position}</span>
                {!b.isActive && <span className="absolute top-3 right-3 text-xs px-2 py-0.5" style={{ background: 'rgba(0,0,0,0.6)', color: '#e57373', borderRadius: 2 }}>Inactive</span>}
              </div>
              <div className="p-4">
                <p className="font-medium" style={{ color: 'var(--text-main)' }}>{b.title || 'Untitled'}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{b.subtitle}</p>
                {b.link && <p className="text-xs mt-1 font-mono" style={{ color: 'var(--accent-gold)' }}>{b.link}</p>}
                <div className="flex gap-3 mt-3">
                  <button onClick={() => handleEdit(b)} className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-silver)' }}><Edit2 size={12} /> Edit</button>
                  <button onClick={() => toggleActive(b)} className="text-xs" style={{ color: b.isActive ? '#facc15' : '#4ade80' }}>{b.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => handleDelete(b._id)} className="text-xs flex items-center gap-1" style={{ color: '#e57373' }}><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="card-luxury p-12 text-center md:col-span-2">
              <ImageIcon size={32} style={{ color: 'var(--text-dim)' }} className="mx-auto mb-3" />
              <p style={{ color: 'var(--text-muted)' }}>No banners yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
