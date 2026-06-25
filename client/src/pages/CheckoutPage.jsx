import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Plus, CreditCard, ChevronDown } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '',
    addressLine1: '', addressLine2: '', city: '', state: '', pincode: ''
  });
  const [guestInfo, setGuestInfo] = useState({ name: '', phone: '', email: '' });

  const shipping = (cart.subtotal || 0) > 999 ? 0 : 99;
  const total = (cart.subtotal || 0) - (cart.discount || 0) + shipping;

  const handlePayment = async () => {
    if (!address.name || !address.addressLine1 || !address.city || !address.pincode) {
      return toast.error('Please fill all address fields');
    }
    if (!address.phone || address.phone.length < 10) {
      return toast.error('Please enter a valid phone number');
    }
    setLoading(true);
    try {
      const items = cart.items.map(i => ({
        _id: i.product?._id, name: i.product?.name,
        price: i.product?.price, discountPrice: i.product?.discountPrice,
        images: i.product?.images, quantity: i.quantity,
      }));

      const res = await api.post('/payment/create-order', {
        items, shippingAddress: address,
        guestInfo: !user?.phone ? guestInfo : undefined,
        couponCode: cart.couponCode,
      });

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: 'TimeAura',
        description: 'Premium Accessories',
        order_id: res.data.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: res.data.dbOrderId,
            });
            await clearCart();
            navigate(`/payment-success?orderId=${verifyRes.data.orderId}`);
          } catch {
            navigate(`/payment-failed?dbOrderId=${res.data.dbOrderId}`);
          }
        },
        modal: { ondismiss: () => { setLoading(false); toast.error('Payment cancelled'); } },
        prefill: { name: address.name, contact: address.phone },
        theme: { color: '#00d4ff' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async () => {
        await api.post('/payment/failed', { dbOrderId: res.data.dbOrderId });
        navigate('/payment-failed');
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const Field = ({ label, field, value, onChange, placeholder, type = 'text', half = false }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input type={type} value={value} onChange={e => onChange(field, e.target.value)}
        placeholder={placeholder} className="input-dark text-sm" />
    </div>
  );

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="section-heading mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: Address */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest info */}
            {!user?.phone && (
              <div className="card-dark p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-electric text-charcoal text-xs flex items-center justify-center font-bold">1</span>
                  Contact Info
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[['Name', 'name', guestInfo.name, 'Your full name'],
                    ['Phone', 'phone', guestInfo.phone, '10-digit number', 'tel'],
                    ['Email (optional)', 'email', guestInfo.email, 'your@email.com', 'email']
                  ].map(([label, field, value, placeholder, type = 'text']) => (
                    <div key={field} className={field === 'email' ? 'col-span-2' : 'col-span-1'}>
                      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                      <input type={type} value={value} onChange={e => setGuestInfo(p => ({ ...p, [field]: e.target.value }))}
                        placeholder={placeholder} className="input-dark text-sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Address */}
            <div className="card-dark p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-electric text-charcoal text-xs flex items-center justify-center font-bold">
                  {!user?.phone ? '2' : '1'}
                </span>
                <MapPin size={14} className="text-electric" /> Delivery Address
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Full Name', 'name', address.name, 'Recipient name', 'text', false],
                  ['Phone', 'phone', address.phone, '10-digit number', 'tel', false],
                  ['Address Line 1', 'addressLine1', address.addressLine1, 'Street, Building', 'text', false],
                  ['Address Line 2', 'addressLine2', address.addressLine2, 'Apartment, Floor (optional)', 'text', false],
                  ['City', 'city', address.city, 'City', 'text', true],
                  ['State', 'state', address.state, 'State', 'text', true],
                  ['Pincode', 'pincode', address.pincode, '6-digit pincode', 'text', true],
                ].map(([label, field, value, placeholder, type, half]) => (
                  <Field key={field} label={label} field={field} value={value}
                    onChange={(f, v) => setAddress(p => ({ ...p, [f]: v }))}
                    placeholder={placeholder} type={type} half={half} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="card-dark p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-5">
                {cart.items?.map(item => (
                  <div key={item.product?._id} className="flex gap-3">
                    <img src={item.product?.images?.[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-gunmetal" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white line-clamp-1">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm text-white font-semibold">
                      ₹{((item.product?.discountPrice || item.product?.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark-border pt-4 space-y-2 text-sm mb-5">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span><span className="text-white">₹{cart.subtotal?.toLocaleString()}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span><span>-₹{cart.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between font-bold text-white text-base border-t border-dark-border pt-2">
                  <span>Total</span><span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || !cart.items?.length}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><CreditCard size={16} /> Pay ₹{total.toLocaleString()}</>
                }
              </button>

              <div className="flex items-center justify-center gap-2 mt-3">
                <img src="https://razorpay.com/favicon.ico" alt="Razorpay" className="w-4 h-4" />
                <span className="text-xs text-gray-500">Secured by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
