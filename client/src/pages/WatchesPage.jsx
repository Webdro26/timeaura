import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/common/ProductCard';
import api from '../utils/api';

export default function WatchesPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: searchParams.get('gender') || '',
    brand: '',
    tags: searchParams.get('tags') || '',
    sort: 'newest',
  });

  useEffect(() => { api.get('/brands').then(r => setBrands(r.data)); }, []);
  useEffect(() => { fetchProducts(); }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: 'watch', limit: 24 });
      Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
      const res = await api.get(`/products?${params}`);
      setProducts(res.data.products);
    } catch {}
    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <Navbar />

      {/* Hero banner */}
      <div className="relative pt-32 pb-16" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-soft)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="label-luxury mb-3">Heritage Timepieces</p>
            <h1 className="heading-display" style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>Watches</h1>
            <p className="text-sm mt-3 max-w-lg" style={{ color: 'var(--text-muted)' }}>
              Precision-engineered timepieces from the world's most distinguished watchmakers.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

        {/* Brand strip — WATCHES ONLY */}
        {brands.length > 0 && (
          <div className="mb-12">
            <p className="label-luxury mb-4">Filter by Brand</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilters(f => ({ ...f, brand: '' }))}
                className="px-5 py-2.5 text-xs uppercase tracking-widest whitespace-nowrap transition-colors"
                style={!filters.brand
                  ? { background: 'var(--accent-gold)', color: '#080808' }
                  : { border: '1px solid var(--border-soft)', color: 'var(--text-muted)' }}
              >All Brands</button>
              {brands.map(b => (
                <button key={b._id}
                  onClick={() => setFilters(f => ({ ...f, brand: b._id }))}
                  className="px-5 py-2.5 text-xs uppercase tracking-widest whitespace-nowrap transition-colors"
                  style={filters.brand === b._id
                    ? { background: 'var(--accent-gold)', color: '#080808' }
                    : { border: '1px solid var(--border-soft)', color: 'var(--text-muted)' }}
                >{b.name}</button>
              ))}
            </div>
          </div>
        )}

        {/* Secondary filters */}
        <div className="flex flex-wrap gap-3 mb-10 items-center">
          {['', 'men', 'women', 'unisex'].map(g => (
            <button key={g || 'all'}
              onClick={() => setFilters(f => ({ ...f, gender: g }))}
              className="px-4 py-2 text-xs uppercase tracking-widest transition-colors"
              style={filters.gender === g
                ? { color: 'var(--accent-gold)', borderBottom: '1px solid var(--accent-gold)' }
                : { color: 'var(--text-dim)', borderBottom: '1px solid transparent' }}
            >{g || 'All Genders'}</button>
          ))}
          <div className="flex-1" />
          <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))} className="input-luxury text-sm w-44">
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/5] skeleton" style={{ borderRadius: 'var(--radius-card)' }} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: 'var(--text-muted)' }}>No watches found for these filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
