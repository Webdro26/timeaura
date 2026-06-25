import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Truck, RefreshCcw, Award, ChevronRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import ScrollVideoHero from '../components/common/ScrollVideoHero';
import api from '../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [loaded, setLoaded] = useState(true);
  const [trending, setTrending] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [menWatches, setMenWatches] = useState([]);
  const [womenWatches, setWomenWatches] = useState([]);
  const [sunglassByCategory, setSunglassByCategory] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/products?tags=trending&limit=4'),
      api.get('/products?tags=bestseller&limit=4'),
      api.get('/products?tags=new&limit=4'),
      api.get('/products?category=watch&gender=men&limit=4'),
      api.get('/products?category=watch&gender=women&limit=4'),
      api.get('/brands'),
      api.get('/categories'),
    ]).then(([t, b, n, mw, ww, br, cat]) => {
      setTrending(t.data.products);
      setBestsellers(b.data.products);
      setNewArrivals(n.data.products);
      setMenWatches(mw.data.products);
      setWomenWatches(ww.data.products);
      setBrands(br.data.slice(0, 6));
      setCategories(cat.data.slice(0, 6));
    }).catch(() => {});
  }, []);

  // Fetch one product per glass category for the "Sunglasses by Glass Type" showcase
  useEffect(() => {
    if (categories.length === 0) return;
    Promise.all(
      categories.map(c => api.get(`/products?category=sunglasses&glassCategory=${c._id}&limit=1`))
    ).then(results => {
      const items = results
        .map((r, i) => ({ category: categories[i], product: r.data.products[0] }))
        .filter(x => x.product);
      setSunglassByCategory(items);
    }).catch(() => {});
  }, [categories]);

  

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <Navbar />

      {/* SCROLL-DRIVEN VIDEO HERO */}
      <ScrollVideoHero />

      {/* FEATURED WATCH BRANDS — watches only */}
      {brands.length > 0 && (
        <section className="section-luxury">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealHeading label="Heritage Names" title="Shop Watches by Brand" />
            <div className="grid grid-cols-3 md:grid-cols-6 gap-px mt-12" style={{ background: 'var(--border-soft)' }}>
              {brands.map((brand, i) => (
                <motion.div
                  key={brand._id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.6 }}
                >
                  <Link
                    to={`/brand/${brand.slug}`}
                    className="flex flex-col items-center justify-center text-center h-32 transition-colors group"
                    style={{ background: 'var(--bg-card)' }}
                  >
                    <span className="heading-display text-lg mb-1 transition-colors group-hover:text-gold" style={{ color: 'var(--text-main)' }}>
                      {brand.name}
                    </span>
                    <span className="label-luxury opacity-0 group-hover:opacity-100 transition-opacity">View Collection</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MEN'S WATCHES */}
      {menWatches.length > 0 && (
        <section className="section-luxury section-soft">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader label="For Him" title="Men's Watches" link="/watches?gender=men" />
            <ProductGrid products={menWatches} />
          </div>
        </section>
      )}

      {/* WOMEN'S WATCHES */}
      {womenWatches.length > 0 && (
        <section className="section-luxury">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader label="For Her" title="Women's Watches" link="/watches?gender=women" />
            <ProductGrid products={womenWatches} />
          </div>
        </section>
      )}

      {/* SUNGLASSES BY GLASS TYPE — no brands */}
      {sunglassByCategory.length > 0 && (
        <section className="section-luxury section-soft">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealHeading label="Eyewear" title="Sunglasses by Glass Type" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
              {sunglassByCategory.map(({ category, product }, i) => (
                <motion.div
                  key={category._id}
                  className="reveal"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                >
                  <Link to={`/sunglasses?glassCategory=${category._id}`} className="group block">
                    <div className="img-zoom-wrap relative aspect-[4/5] mb-4 overflow-hidden" style={{ borderRadius: 'var(--radius-card)' }}>
                      <img src={product.images?.[0]} alt={category.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.85), transparent 60%)' }} />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="label-luxury mb-1">{category.description || 'Eyewear'}</p>
                        <h3 className="heading-display text-2xl">{category.name}</h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="section-luxury">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader label="Just Dropped" title="New Arrivals" link="/shop?tags=new" />
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      {/* BEST SELLERS */}
      {bestsellers.length > 0 && (
        <section className="section-luxury section-soft">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader label="Customer Favorites" title="Best Sellers" link="/shop?tags=bestseller" />
            <ProductGrid products={bestsellers} />
          </div>
        </section>
      )}

      {/* TRENDING */}
      {trending.length > 0 && (
        <section className="section-luxury">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader label="Hot Right Now" title="Trending" link="/shop?tags=trending" />
            <ProductGrid products={trending} />
          </div>
        </section>
      )}

      {/* LUXURY PROMISE */}
      <section className="section-luxury section-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealHeading label="Our Promise" title="The TimeAura Standard" center />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-14" style={{ background: 'var(--border-soft)' }}>
            {[
              { icon: Shield, title: 'Authenticity', desc: '100% genuine products, fully warrantied' },
              { icon: Truck, title: 'White-Glove Delivery', desc: 'Complimentary on orders above ₹999' },
              { icon: RefreshCcw, title: 'Effortless Returns', desc: '7-day no-questions-asked policy' },
              { icon: Award, title: 'Curated Excellence', desc: 'Hand-selected from heritage brands' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="p-8 text-center flex flex-col items-center"
                style={{ background: 'var(--bg-card)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Icon size={22} style={{ color: 'var(--accent-gold)' }} className="mb-4" />
                <h3 className="text-sm tracking-widest uppercase mb-2" style={{ color: 'var(--text-main)' }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section-luxury">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealHeading label="Testimonials" title="What Our Patrons Say" center />
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {[
              { name: 'Arjun K.', review: 'The Casio G-Shock I purchased exceeded expectations — premium packaging, authentic product, swift delivery.', stars: 5, product: 'G-Shock DW5600' },
              { name: 'Priya S.', review: 'The aviator sunglasses are exactly as described. The craftsmanship feels genuinely premium.', stars: 5, product: 'Aviator Pro' },
              { name: 'Rohit M.', review: 'My new daily watch from TimeAura. Excellent service and an effortless ordering experience.', stars: 5, product: 'Fossil Minimalist' },
            ].map((r, i) => (
              <motion.div
                key={r.name}
                className="card-luxury p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(r.stars)].map((_, j) => <Star key={j} size={13} style={{ fill: 'var(--accent-gold)', color: 'var(--accent-gold)' }} />)}
                </div>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: 'var(--text-muted)' }}>"{r.review}"</p>
                <div className="divider-soft mb-4" />
                <p className="text-sm tracking-wide" style={{ color: 'var(--text-main)' }}>{r.name}</p>
                <p className="label-luxury mt-1">{r.product}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section-luxury section-soft">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <RevealHeading label="Stay Connected" title="Join the Inner Circle" center />
          <p className="text-sm mt-4 mb-10" style={{ color: 'var(--text-muted)' }}>
            Receive early access to new collections and exclusive offers.
          </p>
          <div className="flex gap-0 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="input-luxury rounded-none" />
            <button className="btn-gold rounded-none whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Helper Components ──────────────────────────── */

function RevealHeading({ label, title, center }) {
  return (
    <motion.div
      className={center ? 'text-center' : ''}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <p className="label-luxury mb-3">{label}</p>
      <h2 className="heading-section">{title}</h2>
      {center && <div className="divider-gold w-16 mt-5" />}
    </motion.div>
  );
}

function SectionHeader({ label, title, link }) {
  return (
    <motion.div
      className="flex items-end justify-between mb-12"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div>
        <p className="label-luxury mb-3">{label}</p>
        <h2 className="heading-section">{title}</h2>
      </div>
      <Link to={link} className="nav-link-luxury flex items-center gap-2 whitespace-nowrap">
        View All <ChevronRight size={14} />
      </Link>
    </motion.div>
  );
}

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
    </div>
  );
}
