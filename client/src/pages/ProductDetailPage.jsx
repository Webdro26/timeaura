import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Shield,
  Truck,
  ChevronRight,
  Minus,
  Plus,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/common/ProductCard';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    setQty(1);

    api
      .get(`/products/slug/${slug}`)
      .then((res) => {
        setProduct(res.data);
        return api.get(`/products?category=${res.data.category}&limit=6`);
      })
      .then((res) => {
        setRelated((res.data.products || []).filter((p) => p.slug !== slug).slice(0, 4));
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent-gold)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: 'var(--bg-main)' }}>
        <h1 className="heading-display text-3xl">Product Not Found</h1>
        <Link to="/shop" className="btn-gold">Back To Collection</Link>
      </div>
    );
  }

  const discount =
    product.price && product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const finalPrice = product.discountPrice || product.price;
  const brandName = product.brand?.name || product.glassCategory?.name || product.category;

  const handleBuyNow = async () => {
    await addToCart(product._id, qty);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs mb-10" style={{ color: 'var(--text-dim)' }}>
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link
              to={product.category === 'watch' ? '/watches' : '/sunglasses'}
              className="hover:text-gold transition-colors capitalize"
            >
              {product.category === 'watch' ? 'Watches' : 'Sunglasses'}
            </Link>
            <ChevronRight size={12} />
            <span className="truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div
                className="relative aspect-[4/5] overflow-hidden group"
                style={{
                  borderRadius: 'var(--radius-card)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-soft)',
                }}
              >
                <img
                  src={product.images?.[activeImg] || 'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwbd8e8365/images/Titan/Catalog/90110WL04_1.jpg?sw=600&sh=600'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.25), transparent 45%)' }} />

                {discount > 0 && (
                  <div className="absolute top-5 left-5 badge-gold">
                    Save {discount}%
                  </div>
                )}

                {product.tags?.includes('new') && (
                  <div className="absolute top-5 right-5 badge-gold">
                    New Arrival
                  </div>
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className="aspect-square overflow-hidden transition-all"
                      style={{
                        borderRadius: 8,
                        border: activeImg === i ? '1px solid var(--accent-gold)' : '1px solid var(--border-soft)',
                        opacity: activeImg === i ? 1 : 0.55,
                      }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.section
              className="lg:sticky lg:top-28 self-start"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
            >
              <p className="label-luxury mb-4">{brandName}</p>

              <h1
                className="heading-display mb-5"
                style={{ fontSize: 'clamp(34px, 4.5vw, 58px)', lineHeight: 1.05 }}
              >
                {product.name}
              </h1>

              <div className="divider-soft mb-6" />

              <div className="flex items-baseline gap-4 mb-6">
                <span
                  style={{
                    color: 'var(--accent-gold)',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(30px, 4vw, 44px)',
                  }}
                >
                  ₹{finalPrice?.toLocaleString()}
                </span>

                {discount > 0 && (
                  <>
                    <span className="line-through text-lg" style={{ color: 'var(--text-dim)' }}>
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <span className="text-xs uppercase tracking-widest" style={{ color: '#7ddc9a' }}>
                      You save ₹{(product.price - finalPrice).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm leading-8 mb-7 max-w-xl" style={{ color: 'var(--text-muted)' }}>
                {product.description}
              </p>

              <div className="flex items-center gap-2 mb-8">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: product.stock > 0 ? '#7ddc9a' : '#e57373' }}
                />
                <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {product.stock > 5
                    ? 'In Stock'
                    : product.stock > 0
                      ? `Only ${product.stock} Left`
                      : 'Out Of Stock'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div
                  className="flex items-center justify-between w-full sm:w-36 px-4 py-3"
                  style={{ border: '1px solid var(--border-soft)', background: 'var(--bg-card)' }}
                >
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ color: 'var(--text-muted)' }}>
                    <Minus size={15} />
                  </button>
                  <span style={{ color: 'var(--text-main)' }}>{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))} style={{ color: 'var(--text-muted)' }}>
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product._id, qty)}
                  disabled={product.stock === 0}
                  className="btn-outline-gold flex-1"
                >
                  <ShoppingBag size={15} /> Add To Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="btn-gold flex-1"
                >
                  Buy Now
                </button>

                <button
                  className="h-[50px] w-[50px] flex items-center justify-center"
                  style={{ border: '1px solid var(--border-soft)', color: 'var(--text-muted)' }}
                >
                  <Heart size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-8" style={{ background: 'var(--border-soft)' }}>
                {[
                  { icon: Shield, title: 'Authentic', desc: 'Verified quality' },
                  { icon: Truck, title: 'Delivery', desc: 'Fast shipping' },
                  { icon: RotateCcw, title: 'Returns', desc: '7-day support' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="p-5 text-center" style={{ background: 'var(--bg-card)' }}>
                    <Icon size={18} className="mx-auto mb-3" style={{ color: 'var(--accent-gold)' }} />
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--text-main)' }}>
                      {title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{desc}</p>
                  </div>
                ))}
              </div>

              {product.specifications?.length > 0 && (
                <div className="card-luxury p-6 mb-8">
                  <div className="flex items-center gap-2 mb-5">
                    <Sparkles size={15} style={{ color: 'var(--accent-gold)' }} />
                    <h3 className="label-luxury">Specifications</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'var(--border-soft)' }}>
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="p-4" style={{ background: 'var(--bg-main)' }}>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>{spec.key}</p>
                        <p className="text-sm" style={{ color: 'var(--text-main)' }}>{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-luxury p-6">
                <p className="label-luxury mb-3">About The Collection</p>
                <p className="text-sm leading-7" style={{ color: 'var(--text-muted)' }}>
                  Every TimeAura piece is selected for its balance of form, function, and everyday elegance.
                  Designed for those who appreciate refined details and timeless presentation.
                </p>
              </div>
            </motion.section>
          </div>

          {related.length > 0 && (
            <section className="mt-28">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="label-luxury mb-3">Curated For You</p>
                  <h2 className="heading-section">You May Also Like</h2>
                </div>
                <Link to="/shop" className="nav-link-luxury">View All</Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {related.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}