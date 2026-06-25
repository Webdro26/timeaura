import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/common/ProductCard';
import api from '../utils/api';

export default function MenPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?gender=men&limit=20').then(r => setProducts(r.data.products)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="relative bg-gradient-to-r from-steel to-charcoal py-16 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-electric font-mono text-sm uppercase tracking-widest mb-2">Collection</p>
            <h1 className="font-display text-5xl font-bold text-white">Men's</h1>
            <p className="text-gray-400 mt-2">Watches & sunglasses for men</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="card-dark aspect-[3/4] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
