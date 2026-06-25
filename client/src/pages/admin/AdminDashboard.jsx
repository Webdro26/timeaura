import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, IndianRupee, TrendingUp, AlertTriangle } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card-luxury p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="label-luxury" style={{ fontSize: 10 }}>{label}</span>
        <Icon size={18} style={{ color: 'var(--accent-gold)' }} />
      </div>
      <div className="heading-display text-3xl">{value}</div>
    </div>
  );
}

const statusColors = {
  placed: '#60a5fa', confirmed: 'var(--accent-gold)', processing: '#facc15',
  shipped: '#c084fc', delivered: '#4ade80', cancelled: '#e57373',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-main)' }}>
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8">
        <div className="mb-8">
          <h1 className="heading-display text-2xl">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Welcome back, Admin</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="card-luxury h-28 skeleton" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Package} label="Total Products" value={stats?.totalProducts || 0} />
              <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders || 0} />
              <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} />
              <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <div className="lg:col-span-2 card-luxury p-6">
                <h2 className="label-luxury mb-5 flex items-center gap-2">
                  <TrendingUp size={14} style={{ color: 'var(--accent-gold)' }} /> Recent Orders
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                        {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                          <th key={h} className="text-left pb-3 font-medium label-luxury" style={{ fontSize: 9 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentOrders?.length === 0 && (
                        <tr><td colSpan={5} className="py-6 text-center" style={{ color: 'var(--text-dim)' }}>No orders yet</td></tr>
                      )}
                      {stats?.recentOrders?.map(order => (
                        <tr key={order._id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                          <td className="py-3 font-mono text-xs" style={{ color: 'var(--accent-gold)' }}>{order.orderId}</td>
                          <td className="py-3" style={{ color: 'var(--text-muted)' }}>{order.user?.name || order.guestInfo?.name || 'Guest'}</td>
                          <td className="py-3 font-medium" style={{ color: 'var(--text-main)' }}>₹{order.total?.toLocaleString()}</td>
                          <td className="py-3">
                            <span className="text-xs capitalize" style={{ color: statusColors[order.orderStatus] }}>{order.orderStatus}</span>
                          </td>
                          <td className="py-3 text-xs" style={{ color: 'var(--text-dim)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Stock */}
              <div className="card-luxury p-6">
                <h2 className="label-luxury mb-5 flex items-center gap-2">
                  <AlertTriangle size={14} style={{ color: '#e57373' }} /> Low Stock
                </h2>
                {stats?.lowStockProducts?.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--text-dim)' }}>All products well stocked.</p>
                ) : (
                  <div className="space-y-3">
                    {stats?.lowStockProducts?.map(p => (
                      <Link key={p._id} to={`/admin/products/edit/${p._id}`} className="flex items-center gap-3 group">
                        <img src={p.images?.[0]} alt="" className="w-10 h-10 object-cover" style={{ borderRadius: 4, background: 'var(--bg-soft)' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs line-clamp-1 transition-colors" style={{ color: 'var(--text-main)' }}>{p.name}</p>
                          <p className="label-luxury" style={{ fontSize: 9 }}>{p.brand?.name || p.glassCategory?.name}</p>
                        </div>
                        <span className="text-xs font-bold" style={{ color: p.stock === 0 ? '#e57373' : '#facc15' }}>
                          {p.stock === 0 ? 'OUT' : p.stock}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
