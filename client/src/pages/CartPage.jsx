import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, Tag, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const handleCoupon = async () => {
    setCouponLoading(true);
    try {
      const res = await applyCoupon(couponInput);
      toast.success(res.message);
      setCouponInput('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
    setCouponLoading(false);
  };

  const shipping = (cart.subtotal || 0) > 999 ? 0 : 99;
  const total = (cart.subtotal || 0) - (cart.discount || 0) + shipping;

  if (!cart.items?.length) return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingBag size={48} className="text-gray-600" />
        <h2 className="text-xl font-semibold text-white">Your cart is empty</h2>
        <p className="text-gray-400">Add some items to get started</p>
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="section-heading mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items?.map(item => (
              <motion.div
                key={item.product?._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card-dark p-4 flex gap-4"
              >
                <Link to={`/product/${item.product?.slug}`}>
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/80'}
                    alt={item.product?.name}
                    className="w-20 h-20 rounded-xl object-cover bg-gunmetal"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product?.slug}`}>
                    <h3 className="font-semibold text-white text-sm hover:text-electric transition-colors line-clamp-1">{item.product?.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">{item.product?.brand?.name || item.product?.glassCategory?.name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-dark-card border border-dark-border rounded-full px-3 py-1">
                      <button onClick={() => updateQuantity(item.product?._id, item.quantity - 1)} className="text-gray-400 hover:text-white">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm text-white w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product?._id, item.quantity + 1)} className="text-gray-400 hover:text-white">
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">₹{((item.product?.discountPrice || item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                      <button onClick={() => removeFromCart(item.product?._id)} className="text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="card-dark p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-5">Order Summary</h3>

              {/* Coupon */}
              {!cart.couponCode ? (
                <div className="flex gap-2 mb-5">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="input-dark pl-8 text-sm py-2.5"
                    />
                  </div>
                  <button onClick={handleCoupon} disabled={couponLoading || !couponInput} className="btn-outline text-sm py-2 px-4 disabled:opacity-50">
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 mb-5">
                  <span className="text-green-400 text-sm font-mono">{cart.couponCode}</span>
                  <button onClick={removeCoupon} className="text-gray-400 hover:text-red-400 text-xs">Remove</button>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{cart.subtotal?.toLocaleString()}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-₹{cart.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-dark-border pt-3 flex justify-between font-bold text-white text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <Link to="/shop" className="block text-center text-sm text-gray-500 hover:text-electric mt-3 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
