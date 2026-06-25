import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 100 });
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);
    api.get(`/products?${params}`)
      .then(r => setProducts(r.data.products || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [categoryFilter]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-display text-2xl">Products</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{products.length} products</p>
          </div>
          <Link to="/admin/products/add" className="btn-gold flex items-center gap-2">
            <Plus size={16} /> Add Product
          </Link>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative max-w-sm flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchProducts()}
              placeholder="Search products..." className="input-luxury pl-10 text-sm" />
          </div>
          <div className="flex gap-2">
            {[['', 'All'], ['watch', 'Watches'], ['sunglasses', 'Sunglasses']].map(([val, label]) => (
              <button key={val} onClick={() => setCategoryFilter(val)}
                className="px-4 py-2.5 text-xs uppercase tracking-widest transition-colors"
                style={categoryFilter === val
                  ? { background: 'var(--accent-gold)', color: '#080808' }
                  : { border: '1px solid var(--border-soft)', color: 'var(--text-muted)' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-luxury overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ borderBottom: '1px solid var(--border-soft)' }}>
              <tr>
                {['Product', 'Type', 'Brand / Category', 'Price', 'Stock', 'Tags', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 label-luxury" style={{ fontSize: 9 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="p-4"><div className="h-4 skeleton" style={{ borderRadius: 4 }} /></td></tr>
                ))
              ) : products.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 object-cover" style={{ borderRadius: 4, background: 'var(--bg-soft)' }} />
                      <div>
                        <p className="font-medium line-clamp-1" style={{ color: 'var(--text-main)' }}>{p.name}</p>
                        <p className="text-xs capitalize" style={{ color: 'var(--text-dim)' }}>{p.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="badge-gold capitalize">{p.category}</span>
                  </td>
                  <td className="p-4" style={{ color: 'var(--text-muted)' }}>
                    {p.brand?.name || p.glassCategory?.name || '—'}
                  </td>
                  <td className="p-4">
                    <span style={{ color: 'var(--accent-gold)' }} className="font-medium">₹{p.discountPrice?.toLocaleString()}</span>
                    {p.price !== p.discountPrice && <span className="text-xs ml-1 line-through" style={{ color: 'var(--text-dim)' }}>₹{p.price?.toLocaleString()}</span>}
                  </td>
                  <td className="p-4">
                    <span style={{ color: p.stock > 5 ? '#4ade80' : p.stock > 0 ? '#facc15' : '#e57373' }}>{p.stock}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {p.tags?.map(t => <span key={t} className="badge-gold capitalize">{t}</span>)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link to={`/admin/products/edit/${p._id}`} className="p-1.5 transition-colors" style={{ color: 'var(--accent-silver)' }}>
                        <Edit2 size={14} />
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 transition-colors" style={{ color: '#e57373' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <Package size={32} style={{ color: 'var(--text-dim)' }} className="mx-auto mb-3" />
              <p style={{ color: 'var(--text-muted)' }}>No products found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
