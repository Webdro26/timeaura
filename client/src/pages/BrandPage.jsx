// BrandPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/common/ProductCard';
import api from '../utils/api';

export function BrandPage() {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get(`/brands/${slug}`).then(r => {
      setBrand(r.data);
      return api.get(`/products?brand=${r.data._id}&limit=20`);
    }).then(r => setProducts(r.data.products)).catch(() => {});
  }, [slug]);

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="relative bg-gradient-to-r from-gunmetal to-charcoal py-16 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <p className="text-electric font-mono text-sm uppercase tracking-widest mb-2">Watch Brand</p>
            <h1 className="font-display text-5xl font-bold text-white">{brand?.name || slug}</h1>
            {brand?.description && <p className="text-gray-400 mt-2">{brand.description}</p>}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
          {products.length === 0 && <p className="text-center text-gray-400 py-20">No products found for this brand.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BrandPage;
