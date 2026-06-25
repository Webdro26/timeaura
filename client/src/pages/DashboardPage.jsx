import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Heart, LogOut, Edit2, Save, X } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, setUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const saveProfile = async () => {
    try {
      const res = await api.put('/auth/profile', { name, email });
      setUser(u => ({ ...u, ...res.data }));
      setEditing(false);
      toast.success('Profile updated');
    } catch { toast.error('Failed to update'); }
  };

  const statusColors = {
    placed: 'text-blue-400 bg-blue-400/10',
    confirmed: 'text-electric bg-electric/10',
    processing: 'text-yellow-400 bg-yellow-400/10',
    shipped: 'text-purple-400 bg-purple-400/10',
    delivered: 'text-green-400 bg-green-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="section-heading mb-8">My Account</h1>
        <div className="grid md:grid-cols-3 gap-6">

          {/* Profile Card */}
          <motion.div className="card-dark p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-electric to-blue-600 flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-white" />
            </div>
            <div className="text-center mb-4">
              {editing ? (
                <div className="space-y-2">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="input-dark text-sm text-center" />
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional)" className="input-dark text-sm text-center" />
                  <div className="flex gap-2">
                    <button onClick={saveProfile} className="flex-1 btn-primary text-sm py-1.5 flex items-center justify-center gap-1">
                      <Save size={12} /> Save
                    </button>
                    <button onClick={() => setEditing(false)} className="btn-outline text-sm py-1.5 px-3">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-white">{user?.name || 'User'}</h3>
                  <p className="text-sm text-gray-400">{user?.phone}</p>
                  {user?.email && <p className="text-xs text-gray-500">{user.email}</p>}
                  <button onClick={() => setEditing(true)} className="mt-2 text-xs text-electric flex items-center gap-1 mx-auto hover:underline">
                    <Edit2 size={10} /> Edit Profile
                  </button>
                </>
              )}
            </div>

            <div className="space-y-1 border-t border-dark-border pt-4">
              <Link to="/orders" className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-colors">
                <Package size={14} /> My Orders
              </Link>
              <Link to="/wishlist" className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-colors">
                <Heart size={14} /> Wishlist
              </Link>
              <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-400/10 text-sm w-full transition-colors">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div className="md:col-span-2 card-dark p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white">Recent Orders</h3>
              <Link to="/orders" className="text-xs text-electric hover:underline">View All</Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10">
                <Package size={32} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No orders yet</p>
                <Link to="/shop" className="btn-primary text-sm mt-4 inline-block">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="border border-dark-border rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-mono text-electric text-sm">{order.orderId}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[order.orderStatus] || 'text-gray-400'}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">{order.items?.length} item(s)</p>
                      <p className="font-bold text-white">₹{order.total?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
