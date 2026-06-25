import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/common/ProductCard';
import FilterSidebar from '../components/common/FilterSidebar';
import api from '../utils/api';

export default function ShopAllPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filters, setFilters] = useState({
    category: '', gender: '', brand: '', glassCategory: '', tags: searchParams.get('tags') || '',
    minPrice: '', maxPrice: '', sort: 'newest', search: searchParams.get('search') || '',
  });

  useEffect(() => {
    Promise.all([api.get('/brands'), api.get('/categories')]).then(([b, c]) => {
      setBrands(b.data);
      setCategories(c.data);
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.glassCategory) params.append('glassCategory', filters.glassCategory);
      if (filters.tags) params.append('tags', filters.tags);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.search) params.append('search', filters.search);
      params.append('page', page);
      params.append('limit', 12);

      const res = await api.get(`/products?${params}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {}
    setLoading(false);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({ category: '', gender: '', brand: '', glassCategory: '', tags: '', minPrice: '', maxPrice: '', sort: 'newest', search: '' });
    } else if (key === 'priceRange') {
      setFilters(p => ({ ...p, minPrice: value.min, maxPrice: value.max }));
    } else if (key === 'category') {
      // Switching category type clears the irrelevant brand/glass filter
      setFilters(p => ({ ...p, category: value, brand: '', glassCategory: '' }));
    } else {
      setFilters(p => ({ ...p, [key]: value }));
    }
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="section-heading mb-1">Shop All</h1>
          <p className="text-gray-400 text-sm">{total} products found</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} brands={brands} categories={categories} />
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 text-sm text-gray-400 border border-dark-border px-3 py-2 rounded-xl"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-dark aspect-[3/4] animate-pulse bg-dark-card" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No products found</p>
                <button onClick={() => handleFilterChange('clear')} className="mt-4 btn-outline">Clear Filters</button>
              </div>
            ) : (
              <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </motion.div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === i + 1 ? 'bg-electric text-charcoal' : 'bg-dark-card border border-dark-border text-gray-400 hover:border-electric hover:text-electric'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilter(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gunmetal overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-white">Filters</span>
              <button onClick={() => setShowMobileFilter(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} brands={brands} categories={categories} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
