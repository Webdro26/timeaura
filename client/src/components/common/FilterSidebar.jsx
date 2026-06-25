import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

export default function FilterSidebar({ filters, onFilterChange, brands = [], categories = [], type = 'all' }) {
  const [openSections, setOpenSections] = useState({ category: true, gender: true, price: true, brand: true, tags: true });

  const toggle = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));

  const Section = ({ id, title, children }) => (
    <div className="pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-soft)' }}>
      <button onClick={() => toggle(id)} className="flex items-center justify-between w-full text-left mb-3">
        <span className="label-luxury">{title}</span>
        <ChevronDown size={14} style={{ color: 'var(--text-dim)', transform: openSections[id] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence>
        {openSections[id] && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const CheckItem = ({ label, value, filterKey }) => (
    <label className="flex items-center gap-2 cursor-pointer group mb-2.5">
      <input
        type="checkbox"
        checked={filters[filterKey] === value}
        onChange={e => onFilterChange(filterKey, e.target.checked ? value : '')}
        className="w-4 h-4 accent-current"
        style={{ accentColor: 'var(--accent-gold)' }}
      />
      <span className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>{label}</span>
    </label>
  );

  // Category type filter (only relevant when browsing "Shop All")
  const showCategoryFilter = type === 'all';
  // Brand filter ONLY for watches — never for sunglasses
  const showBrandFilter = (type === 'watch' || (type === 'all' && filters.category !== 'sunglasses')) && brands.length > 0;
  // Glass category filter ONLY for sunglasses
  const showGlassFilter = (type === 'sunglasses' || (type === 'all' && filters.category !== 'watch')) && categories.length > 0;

  return (
    <div className="card-luxury p-5 sticky top-24">
      <div className="flex items-center gap-2 mb-5">
        <SlidersHorizontal size={14} style={{ color: 'var(--accent-gold)' }} />
        <span className="label-luxury">Filters</span>
        {Object.values(filters).some(Boolean) && (
          <button onClick={() => onFilterChange('clear')} className="ml-auto text-xs flex items-center gap-1" style={{ color: '#e57373' }}>
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {showCategoryFilter && (
        <Section id="category" title="Category">
          <CheckItem label="Watches" value="watch" filterKey="category" />
          <CheckItem label="Sunglasses" value="sunglasses" filterKey="category" />
        </Section>
      )}

      <Section id="gender" title="Gender">
        {['men', 'women', 'unisex'].map(g => (
          <CheckItem key={g} label={g.charAt(0).toUpperCase() + g.slice(1)} value={g} filterKey="gender" />
        ))}
      </Section>

      {showBrandFilter && (
        <Section id="brand" title="Watch Brand">
          {brands.map(b => (
            <CheckItem key={b._id} label={b.name} value={b._id} filterKey="brand" />
          ))}
        </Section>
      )}

      {showGlassFilter && (
        <Section id="glassCategory" title="Glass Type">
          {categories.map(c => (
            <CheckItem key={c._id} label={c.name} value={c._id} filterKey="glassCategory" />
          ))}
        </Section>
      )}

      <Section id="tags" title="Collection">
        <CheckItem label="Best Sellers" value="bestseller" filterKey="tags" />
        <CheckItem label="New Arrivals" value="new" filterKey="tags" />
        <CheckItem label="Trending" value="trending" filterKey="tags" />
      </Section>

      <Section id="price" title="Price Range">
        <div className="space-y-2.5">
          {[['Under ₹2,000', '0', '2000'], ['₹2,000 – ₹5,000', '2000', '5000'], ['₹5,000 – ₹15,000', '5000', '15000'], ['Above ₹15,000', '15000', '']].map(([label, min, max]) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={filters.minPrice === min && filters.maxPrice === max}
                onChange={() => onFilterChange('priceRange', { min, max })}
                style={{ accentColor: 'var(--accent-gold)' }}
              />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section id="sort" title="Sort By">
        <select
          value={filters.sort || 'newest'}
          onChange={e => onFilterChange('sort', e.target.value)}
          className="input-luxury text-sm py-2"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </Section>
    </div>
  );
}
