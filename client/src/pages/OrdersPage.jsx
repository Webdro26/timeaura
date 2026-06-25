import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../utils/api';

const statusColors = {
  placed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  confirmed: 'text-electric bg-electric/10 border-electric/20',
  processing: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  shipped: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  delivered: 'text-green-400 bg-green-400/10 border-green-400/20',
  cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="section-heading mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="card-dark h-24 animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No orders placed yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <motion.div key={order._id} className="card-dark overflow-hidden" layout>
                <div
                  className="p-5 flex items-start justify-between cursor-pointer"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gunmetal flex items-center justify-center">
                      <Package size={20} className="text-electric" />
                    </div>
                    <div>
                      <p className="font-mono text-electric text-sm font-bold">{order.orderId}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      <p className="text-xs text-gray-400 mt-1">{order.items?.length} item(s) · ₹{order.total?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium capitalize ${statusColors[order.orderStatus] || ''}`}>
                      {order.orderStatus}
                    </span>
                    {expanded === order._id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                {expanded === order._id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-dark-border p-5"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Items</h4>
                        <div className="space-y-3">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex gap-3">
                              {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gunmetal" />}
                              <div>
                                <p className="text-sm text-white">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.discountPrice?.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">Delivery Address</h4>
                        <div className="text-sm text-gray-400 space-y-0.5">
                          <p className="text-white">{order.shippingAddress?.name}</p>
                          <p>{order.shippingAddress?.addressLine1}</p>
                          {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                        </div>
                        <div className="mt-4 space-y-1 text-sm">
                          <div className="flex justify-between text-gray-400">
                            <span>Payment</span>
                            <span className={order.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}>{order.paymentStatus}</span>
                          </div>
                          <div className="flex justify-between font-bold text-white">
                            <span>Total</span><span>₹{order.total?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
