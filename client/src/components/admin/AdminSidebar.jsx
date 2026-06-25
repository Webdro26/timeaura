import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Tag, Layers, Ticket, MessageSquare, LogOut, Image } from 'lucide-react';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/brands', icon: Tag, label: 'Watch Brands' },
  { to: '/admin/categories', icon: Layers, label: 'Glass Types' },
  { to: '/admin/banners', icon: Image, label: 'Homepage' },
  { to: '/admin/coupons', icon: Ticket, label: 'Coupons' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <aside className="w-60 flex flex-col min-h-screen fixed left-0 top-0 bottom-0 z-30"
      style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border-soft)' }}>
      <div className="p-6" style={{ borderBottom: '1px solid var(--border-soft)' }}>
        <Link to="/admin" className="block">
          <div className="heading-display text-lg" style={{ letterSpacing: '0.2em' }}>TIMEAURA</div>
          <div className="label-luxury mt-1" style={{ fontSize: 9 }}>Admin Portal</div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 text-sm transition-colors"
              style={active
                ? { background: 'var(--accent-gold-dim)', color: 'var(--accent-gold)', borderLeft: '2px solid var(--accent-gold)' }
                : { color: 'var(--text-muted)', borderLeft: '2px solid transparent' }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm w-full transition-colors" style={{ color: '#e57373' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
