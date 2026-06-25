import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/common/ProductCard';
import api from '../utils/api';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/profile').then(r => setWishlist(r.data.wishlist || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="section-heading mb-8">My Wishlist</h1>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="card-dark aspect-[3/4] animate-pulse" />)}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Your wishlist is empty</p>
            <Link to="/shop" className="btn-primary">Discover Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {wishlist.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
