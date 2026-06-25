import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors = {
  placed: '#60a5fa', confirmed: 'var(--accent-gold)', processing: '#facc15',
  shipped: '#c084fc', delivered: '#4ade80', cancelled: '#e57373',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchOrders = () => {
    const params = filterStatus ? `?status=${filterStatus}` : '';
    api.get(`/admin/orders${params}`)
      .then(r => setOrders(r.data.orders || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { orderStatus: status });
      toast.success('Status updated');
      fetchOrders();
      if (selected?._id === id) setSelected(p => ({ ...p, orderStatus: status }));
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-display text-2xl">Orders</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{orders.length} orders</p>
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-luxury text-sm w-48">
            <option value="">All Orders</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>

        <div className="card-luxury overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{ borderBottom: '1px solid var(--border-soft)' }}>
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Update', ''].map(h => (
                  <th key={h} className="text-left p-4 label-luxury" style={{ fontSize: 9 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={9} className="p-4"><div className="h-4 skeleton" style={{ borderRadius: 4 }} /></td></tr>)
              ) : orders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td className="p-4 font-mono text-xs" style={{ color: 'var(--accent-gold)' }}>{order.orderId}</td>
                  <td className="p-4" style={{ color: 'var(--text-muted)' }}>{order.user?.name || order.guestInfo?.name || 'Guest'}</td>
                  <td className="p-4" style={{ color: 'var(--text-dim)' }}>{order.items?.length} item(s)</td>
                  <td className="p-4 font-medium" style={{ color: 'var(--text-main)' }}>₹{order.total?.toLocaleString()}</td>
                  <td className="p-4">
                    <span style={{ color: order.paymentStatus === 'paid' ? '#4ade80' : '#facc15' }} className="capitalize">
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="capitalize" style={{ color: statusColors[order.orderStatus] }}>{order.orderStatus}</span>
                  </td>
                  <td className="p-4 text-xs" style={{ color: 'var(--text-dim)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-4">
                    <select
                      value={order.orderStatus}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      className="text-xs px-2 py-1.5 capitalize"
                      style={{ background: 'var(--bg-soft)', border: '1px solid var(--border-soft)', color: 'var(--text-main)', borderRadius: 4 }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                  </td>
                  <td className="p-4">
                    <button onClick={() => setSelected(order)} style={{ color: 'var(--accent-silver)' }}>
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>No orders found</div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setSelected(null)}>
          <div className="card-luxury max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="label-luxury mb-1">Order Details</p>
                <h2 className="heading-display text-xl">{selected.orderId}</h2>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="label-luxury mb-3">Customer</h3>
                <p className="text-sm" style={{ color: 'var(--text-main)' }}>{selected.user?.name || selected.guestInfo?.name || 'Guest'}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{selected.user?.phone || selected.guestInfo?.phone}</p>
                {selected.guestInfo?.email && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{selected.guestInfo.email}</p>}
              </div>
              <div>
                <h3 className="label-luxury mb-3">Shipping Address</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {selected.shippingAddress?.name}<br />
                  {selected.shippingAddress?.addressLine1}<br />
                  {selected.shippingAddress?.addressLine2 && <>{selected.shippingAddress.addressLine2}<br /></>}
                  {selected.shippingAddress?.city}, {selected.shippingAddress?.state} - {selected.shippingAddress?.pincode}
                </p>
              </div>
            </div>

            <h3 className="label-luxury mb-3">Items</h3>
            <div className="space-y-3 mb-6">
              {selected.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.image && <img src={item.image} alt="" className="w-12 h-12 object-cover" style={{ borderRadius: 4, background: 'var(--bg-soft)' }} />}
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: 'var(--text-main)' }}>{item.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Qty: {item.quantity} × ₹{item.discountPrice?.toLocaleString()}</p>
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>₹{(item.quantity * item.discountPrice).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="divider-soft mb-4" />
            <div className="space-y-1.5 text-sm mb-6">
              <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                <span>Subtotal</span><span>₹{selected.subtotal?.toLocaleString()}</span>
              </div>
              {selected.discount > 0 && (
                <div className="flex justify-between" style={{ color: '#4ade80' }}>
                  <span>Discount {selected.couponCode && `(${selected.couponCode})`}</span><span>-₹{selected.discount?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                <span>Shipping</span><span>{selected.shippingCharge === 0 ? 'Free' : `₹${selected.shippingCharge}`}</span>
              </div>
              <div className="flex justify-between font-medium pt-1" style={{ color: 'var(--text-main)' }}>
                <span>Total</span><span style={{ color: 'var(--accent-gold)' }}>₹{selected.total?.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="label-luxury">Order Status:</span>
              <select
                value={selected.orderStatus}
                onChange={e => updateStatus(selected._id, e.target.value)}
                className="input-luxury text-sm capitalize w-40"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
              <span className="label-luxury ml-auto">Payment:</span>
              <span className="text-sm capitalize" style={{ color: selected.paymentStatus === 'paid' ? '#4ade80' : '#facc15' }}>
                {selected.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
