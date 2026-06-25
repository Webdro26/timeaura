import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Upload, Plus, X, ArrowLeft, Save } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const INIT = {
  name: '', description: '', price: '', discountPrice: '', category: 'watch',
  gender: 'men', brand: '', brand: '', stock: '', images: [],
  tags: [], specifications: [{ key: '', value: '' }],
};

export default function AdminAddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(INIT);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [watchBrands, setWatchBrands] = useState([]);
const [glassBrands, setGlassBrands] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/brands?type=watch'),api.get('/brands?type=sunglasses')]).then(([b, c]) => {
      setBrands(b.data); setCategories(c.data);
    });
    if (isEdit) {
      api.get(`/products/${id}`).then(r => {
        const p = r.data;
        setForm({
          name: p.name, description: p.description, price: p.price, discountPrice: p.discountPrice,
          category: p.category, gender: p.gender, brand: p.brand?._id || '', brand: p.brand?._id || '',
          stock: p.stock, images: p.images || [], tags: p.tags || [],
          specifications: p.specifications?.length ? p.specifications : [{ key: '', value: '' }],
        });
      });
    }
  }, [id]);

  // When category type changes, clear the irrelevant field
  const handleCategoryChange = (newCategory) => {
    setForm(p => ({
      ...p,
      category: newCategory,
      brand: newCategory === 'watch' ? p.brand : '',
      brand: newCategory === 'sunglasses' ? p.brand : '',
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));
      const res = await api.post('/upload/images', formData);
      setForm(p => ({ ...p, images: [...p.images, ...res.data.urls] }));
      toast.success('Images uploaded');
    } catch { toast.error('Upload failed — check Cloudinary credentials'); }
    setUploading(false);
  };

  const addImageUrl = () => {
    const url = prompt('Paste image URL:');
    if (url) setForm(p => ({ ...p, images: [...p.images, url] }));
  };

  const removeImage = (i) => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));
  const toggleTag = (tag) => setForm(p => ({ ...p, tags: p.tags.includes(tag) ? p.tags.filter(t => t !== tag) : [...p.tags, tag] }));
  const addSpec = () => setForm(p => ({ ...p, specifications: [...p.specifications, { key: '', value: '' }] }));
  const updateSpec = (i, field, value) => setForm(p => ({ ...p, specifications: p.specifications.map((s, idx) => idx === i ? { ...s, [field]: value } : s) }));
  const removeSpec = (i) => setForm(p => ({ ...p, specifications: p.specifications.filter((_, idx) => idx !== i) }));

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error('Name and price are required');
    if (!form.description) return toast.error('Description is required');

    // Strict category-based validation
    if (form.category === 'watch' && !form.brand) {
      return toast.error('Brand is required for watch products');
    }
    if (form.category === 'sunglasses' && !form.brand) {
      return toast.error('Brand is required for sunglasses products');
    }

    setSaving(true);
    try {
      const payload = { ...form };
      if (!isEdit) payload.slug = generateSlug(form.name);
      if (isEdit) delete payload.slug;

      // Enforce mutual exclusivity at the data level too
      if (form.category !== 'watch') payload.brand = undefined;
      if (form.category !== 'sunglasses') payload.brand = undefined;

      payload.specifications = payload.specifications.filter(s => s.key && s.value);

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    setSaving(false);
  };

  const Field = ({ label, children, required }) => (
    <div>
      <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>
        {label}{required && <span style={{ color: '#e57373' }}> *</span>}
      </label>
      {children}
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/admin/products" className="p-2" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="heading-display text-2xl">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div className="card-luxury p-6 grid grid-cols-2 gap-5">
            <Field label="Product Name" required>
              <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-luxury text-sm" placeholder="e.g. Casio G-Shock DW5600" />
            </Field>

            <Field label="Product Type" required>
              <select value={form.category} onChange={e => handleCategoryChange(e.target.value)} className="input-luxury text-sm">
                <option value="watch">Watch</option>
                <option value="sunglasses">Sunglasses</option>
              </select>
            </Field>

            <Field label="Gender" required>
              <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))} className="input-luxury text-sm">
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </Field>

            {/* Conditional field: Brand (watch only) OR Glass Category (sunglasses only) */}
            {form.category === 'watch' ? (
              <Field label="Watch Brand" required>
                <select required value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className="input-luxury text-sm">
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
                {brands.length === 0 && (
                  <p className="text-xs mt-1.5" style={{ color: '#e57373' }}>
                    No brands found. <Link to="/admin/brands" style={{ color: 'var(--accent-gold)' }}>Add a brand first →</Link>
                  </p>
                )}
              </Field>
            ) : (
              <Field label="Glass Category" required>
                <select required value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className="input-luxury text-sm">
                  <option value="">Select Glass Type</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs mt-1.5" style={{ color: '#e57373' }}>
                    No glass types found. <Link to="/admin/categories" style={{ color: 'var(--accent-gold)' }}>Add one first →</Link>
                  </p>
                )}
              </Field>
            )}

            <Field label="Price (₹)" required>
              <input type="number" required value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="input-luxury text-sm" placeholder="e.g. 5999" />
            </Field>
            <Field label="Discount Price (₹)">
              <input type="number" value={form.discountPrice} onChange={e => setForm(p => ({ ...p, discountPrice: e.target.value }))} className="input-luxury text-sm" placeholder="e.g. 4999" />
            </Field>

            <div className="col-span-2">
              <Field label="Stock">
                <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} className="input-luxury text-sm w-40" placeholder="0" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Description" required>
                <textarea required rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="input-luxury text-sm resize-none w-full" placeholder="Product description..." />
              </Field>
            </div>
          </div>

          {/* Tags */}
          <div className="card-luxury p-6">
            <h3 className="label-luxury mb-4">Homepage Tags</h3>
            <div className="flex gap-3">
              {['bestseller', 'new', 'trending', 'featured'].map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className="px-5 py-2 text-xs uppercase tracking-widest transition-colors"
                  style={form.tags.includes(tag)
                    ? { background: 'var(--accent-gold)', color: '#080808', border: '1px solid var(--accent-gold)' }
                    : { border: '1px solid var(--border-soft)', color: 'var(--text-muted)' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="card-luxury p-6">
            <h3 className="label-luxury mb-4">Product Images</h3>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={img} alt="" className="w-full h-full object-cover" style={{ borderRadius: 4, background: 'var(--bg-soft)' }} />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: '#e57373' }}>
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 flex flex-col items-center justify-center cursor-pointer transition-colors"
                style={{ border: '1px dashed var(--border-soft)' }}>
                {uploading ? <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} />
                  : <><Upload size={16} style={{ color: 'var(--text-dim)' }} /><span className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Upload</span></>}
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <button type="button" onClick={addImageUrl} className="w-20 h-20 flex flex-col items-center justify-center transition-colors"
                style={{ border: '1px dashed var(--border-soft)' }}>
                <Plus size={16} style={{ color: 'var(--text-dim)' }} />
                <span className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>URL</span>
              </button>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Upload via Cloudinary or paste a URL. The first image is the main image.</p>
          </div>

          {/* Specifications */}
          <div className="card-luxury p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="label-luxury">Specifications</h3>
              <button type="button" onClick={addSpec} className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-gold)' }}>
                <Plus size={12} /> Add Row
              </button>
            </div>
            <div className="space-y-2">
              {form.specifications.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <input value={spec.key} onChange={e => updateSpec(i, 'key', e.target.value)} placeholder="e.g. Water Resistance" className="input-luxury text-sm flex-1" />
                  <input value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} placeholder="e.g. 200m" className="input-luxury text-sm flex-1" />
                  <button type="button" onClick={() => removeSpec(i)} className="p-2" style={{ color: 'var(--text-dim)' }}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2">
            {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Save size={16} /> {isEdit ? 'Update Product' : 'Create Product'}</>}
          </button>
        </form>
      </main>
    </div>
  );
}
