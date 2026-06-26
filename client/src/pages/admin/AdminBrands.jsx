import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, ImagePlus } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const emptyForm = {
  name: '',
  slug: '',
  logo: '',
  description: '',
  type: 'watch',
};

const makeSlug = (name = '') =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState('');

  const fetchBrands = () => {
    const query = filterType ? `?type=${filterType}` : '';
    api.get(`/brands${query}`).then((r) => setBrands(r.data));
  };

  useEffect(() => {
    fetchBrands();
  }, [filterType]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('Brand name is required');
      return;
    }

    try {
      const payload = {
        ...form,
        slug: form.slug || makeSlug(form.name),
      };

      if (editId) {
        await api.put(`/brands/${editId}`, payload);
        toast.success('Brand updated');
      } else {
        await api.post('/brands', payload);
        toast.success('Brand created');
      }

      resetForm();
      fetchBrands();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save brand');
    }
  };

  const handleEdit = (brand) => {
    setForm({
      name: brand.name || '',
      slug: brand.slug || '',
      logo: brand.logo || '',
      description: brand.description || '',
      type: brand.type || 'watch',
    });
    setEditId(brand._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this brand? Products using this brand will remain.')) return;

    try {
      await api.delete(`/brands/${id}`);
      toast.success('Brand deleted');
      fetchBrands();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append('images', file);

      const res = await api.post('/upload/images?type=brands', fd);

      const uploadedUrl = res.data.urls?.[0];

      if (!uploadedUrl) {
        toast.error('Logo upload failed');
        return;
      }

      setForm((p) => ({ ...p, logo: uploadedUrl }));
      toast.success('Logo uploaded');
    } catch {
      toast.error('Upload failed. Check Cloudinary setup.');
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <AdminSidebar />

      <main className="flex-1 ml-60 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="heading-display text-2xl">Brands</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Manage watch and sunglasses brands with logos
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm(emptyForm);
            }}
            className="btn-gold flex items-center gap-2"
          >
            <Plus size={16} /> Add Brand
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            ['', 'All Brands'],
            ['watch', 'Watch Brands'],
            ['sunglasses', 'Sunglass Brands'],
          ].map(([value, label]) => (
            <button
              key={label}
              onClick={() => setFilterType(value)}
              className="px-5 py-2.5 text-xs uppercase tracking-widest transition-colors"
              style={
                filterType === value
                  ? { background: 'var(--accent-gold)', color: '#1E1B18' }
                  : { border: '1px solid var(--border-soft)', color: 'var(--text-muted)' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {showForm && (
          <div className="card-luxury p-6 mb-6">
            <h3 className="label-luxury mb-5">{editId ? 'Edit Brand' : 'New Brand'}</h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-5">
              <div>
                <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>
                  Brand Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      name: e.target.value,
                      slug: makeSlug(e.target.value),
                    }))
                  }
                  className="input-luxury text-sm"
                  placeholder="e.g. Rolex"
                />
              </div>

              <div>
                <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>
                  Brand Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  className="input-luxury text-sm"
                >
                  <option value="watch">Watch</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>
                  Logo URL
                </label>
                <input
                  value={form.logo}
                  onChange={(e) => setForm((p) => ({ ...p, logo: e.target.value }))}
                  className="input-luxury text-sm"
                  placeholder="Paste logo URL"
                />
              </div>

              <div>
                <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>
                  Upload Logo
                </label>

                <label className="input-luxury text-sm flex items-center justify-center gap-2 cursor-pointer">
                  <ImagePlus size={14} /> Choose Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>

              <div className="lg:col-span-3">
                <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>
                  Description
                </label>
                <input
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="input-luxury text-sm"
                  placeholder="Short brand description"
                />
              </div>

              <div className="flex items-end gap-2">
                <button type="submit" className="btn-gold flex items-center gap-2 py-3">
                  <Save size={14} /> Save
                </button>

                <button type="button" onClick={resetForm} className="btn-ghost py-3 px-3">
                  <X size={14} />
                </button>
              </div>

              {form.logo && (
                <div className="lg:col-span-4">
                  <p className="label-luxury mb-2" style={{ fontSize: 10 }}>
                    Preview
                  </p>
                  <div
                    className="w-32 h-20 flex items-center justify-center p-4"
                    style={{
                      background: 'var(--bg-soft)',
                      border: '1px solid var(--border-soft)',
                      borderRadius: 10,
                    }}
                  >
                    <img src={form.logo} alt="Brand logo" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        <div className="card-luxury overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ borderBottom: '1px solid var(--border-soft)' }}>
              <tr>
                {['Logo', 'Name', 'Type', 'Slug', 'Description', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left p-4 label-luxury" style={{ fontSize: 9 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {brands.map((b) => (
                <tr key={b._id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td className="p-4">
                    <div
                      className="w-16 h-10 flex items-center justify-center p-2"
                      style={{
                        background: 'var(--bg-soft)',
                        border: '1px solid var(--border-soft)',
                        borderRadius: 8,
                      }}
                    >
                      {b.logo ? (
                        <img src={b.logo} alt={b.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                          No Logo
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 font-medium" style={{ color: 'var(--text-main)' }}>
                    {b.name}
                  </td>

                  <td className="p-4">
                    <span className="badge-gold capitalize">{b.type}</span>
                  </td>

                  <td className="p-4 font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
                    {b.slug}
                  </td>

                  <td className="p-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {b.description || '—'}
                  </td>

                  <td className="p-4">
                    <span style={{ color: b.isActive ? '#22c55e' : '#e57373' }}>
                      {b.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(b)} style={{ color: 'var(--accent-silver)' }}>
                        <Edit2 size={14} />
                      </button>

                      <button onClick={() => handleDelete(b._id)} style={{ color: '#e57373' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {brands.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                    No brands yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}