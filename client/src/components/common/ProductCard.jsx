import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const { user } = useAuth();

  const discount = product.price && product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Sign in to save to wishlist'); return; }
    try {
      await api.post(`/auth/wishlist/${product._id}`);
      setWishlisted(w => !w);
    } catch { toast.error('Failed'); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group product-card-3d"
      style={{ borderRadius: 'var(--radius-card)' }}
    >
      {/* Image */}
      <Link
        to={`/product/${product.slug}`}
        className="img-zoom-wrap block relative aspect-[4/5] overflow-hidden"
        style={{ borderRadius: 'var(--radius-card)', background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}
        onMouseEnter={() => product.images?.length > 1 && setImgIdx(1)}
        onMouseLeave={() => setImgIdx(0)}
      >
        <img
          src={product.images?.[imgIdx] || 'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwbd8e8365/images/Titan/Catalog/90110WL04_1.jpg?sw=600&sh=600'}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {product.tags?.includes('new') && <span className="badge-gold">New</span>}
          {product.tags?.includes('bestseller') && <span className="badge-gold">Bestseller</span>}
          {discount > 0 && <span className="badge-gold">-{discount}%</span>}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'rgba(8,8,8,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <Heart size={14} style={{ color: wishlisted ? 'var(--accent-gold)' : 'var(--text-muted)', fill: wishlisted ? 'var(--accent-gold)' : 'none' }} />
        </button>

        {/* Quick View */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400"
          style={{ background: 'linear-gradient(to top, rgba(8,8,8,0.9), transparent)' }}>
          <div className="flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-widest"
            style={{ border: '1px solid var(--border-gold)', color: 'var(--accent-gold)' }}>
            <Eye size={13} /> Quick View
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="pt-4 px-1">
        <p className="label-luxury mb-1.5" style={{ fontSize: 10 }}>
          {product.brand?.name || product.glassCategory?.name || product.category}
        </p>

        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm leading-snug mb-2 transition-colors line-clamp-2"
            style={{ color: 'var(--text-main)', fontFamily: '"Playfair Display", serif' }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-base font-medium" style={{ color: 'var(--accent-gold)', fontFamily: '"Playfair Display", serif' }}>
            ₹{product.discountPrice?.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="text-xs line-through" style={{ color: 'var(--text-dim)' }}>
              ₹{product.price?.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
