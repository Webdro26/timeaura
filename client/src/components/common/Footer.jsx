import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-soft)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="heading-display text-2xl mb-1" style={{ letterSpacing: '0.15em' }}>TIMEAURA</h3>
            <p className="label-luxury mb-6">Luxury Accessories</p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
              Premium watches and sunglasses curated for the modern individual. Precision meets style.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 flex items-center justify-center transition-colors"
                  style={{ border: '1px solid var(--border-soft)', color: 'var(--text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-gold)'; e.currentTarget.style.borderColor = 'var(--border-gold)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-soft)'; }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="label-luxury mb-5">Shop</h4>
            <ul className="space-y-3">
              {[['Watches', '/watches'], ['Sunglasses', '/sunglasses'], ["Men's", '/men'], ["Women's", '/women'], ['New Arrivals', '/shop?tags=new'], ['Best Sellers', '/shop?tags=bestseller']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="label-luxury mb-5">Support</h4>
            <ul className="space-y-3">
              {[['About Us', '/about'], ['Contact', '/contact'], ['Track Order', '/orders'], ['Returns', '/about'], ['FAQ', '/about']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-luxury mb-5">Contact</h4>
            <ul className="space-y-3.5">
              <li className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Mail size={13} style={{ color: 'var(--accent-gold)' }} /> hello@timeaura.in
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Phone size={13} style={{ color: 'var(--accent-gold)' }} /> +91 98765 43210
              </li>
              <li className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={13} style={{ color: 'var(--accent-gold)' }} className="mt-0.5" /> Mumbai, Maharashtra, India
              </li>
            </ul>

            <div className="mt-7">
              <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Exclusive offers, delivered.</p>
              <div className="flex gap-0">
                <input placeholder="Your email" className="input-luxury rounded-none text-sm" />
                <button className="btn-gold rounded-none px-4">→</button>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-soft mt-16 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>© 2024 TimeAura. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <a href="#" className="text-xs transition-colors" style={{ color: 'var(--text-dim)' }}>Privacy Policy</a>
            <a href="#" className="text-xs transition-colors" style={{ color: 'var(--text-dim)' }}>Terms of Service</a>
            <Link to="/admin/login" className="text-xs transition-colors" style={{ color: 'var(--text-dim)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
