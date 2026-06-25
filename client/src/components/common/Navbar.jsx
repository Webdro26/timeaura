import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Menu, X, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchesOpen, setWatchesOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const watchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    const handler = (e) => {
      if (watchRef.current && !watchRef.current.contains(e.target)) setWatchesOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'navbar-scrolled' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex flex-col items-start leading-none">
              <span style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-main)', fontSize: 20, letterSpacing: '0.25em', fontWeight: 600 }}>
                TIMEAURA
              </span>
              <span style={{ color: 'var(--accent-gold)', fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 1 }}>
                Luxury Accessories
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Watches dropdown */}
              <div ref={watchRef} className="relative">
                <button
                  className={`nav-link-luxury flex items-center gap-1 ${isActive('/watches') ? 'active' : ''}`}
                  onMouseEnter={() => setWatchesOpen(true)}
                  onClick={() => navigate('/watches')}
                >
                  Watches <ChevronDown size={12} className={`transition-transform ${watchesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {watchesOpen && (
                    <motion.div
                      className="glass-luxury absolute top-8 left-0 w-48 py-2 z-50"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      onMouseLeave={() => setWatchesOpen(false)}
                    >
                      {[
                        ['All Watches', '/watches'],
                        ["Men's Watches", '/watches?gender=men'],
                        ["Women's Watches", '/watches?gender=women'],
                        ['New Arrivals', '/watches?tags=new'],
                        ['Best Sellers', '/watches?tags=bestseller'],
                      ].map(([label, path]) => (
                        <Link key={label} to={path}
                          onClick={() => setWatchesOpen(false)}
                          className="block px-5 py-2.5 text-xs tracking-wider uppercase transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                          {label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                ['Sunglasses', '/sunglasses'],
                ["Men's", '/men'],
                ["Women's", '/women'],
                ['Shop All', '/shop'],
              ].map(([label, path]) => (
                <Link key={label} to={path} className={`nav-link-luxury ${isActive(path) ? 'active' : ''}`}>{label}</Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 lg:gap-2">
              <button onClick={() => setSearchOpen(true)}
                className="p-2.5 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <Search size={18} />
              </button>

              {user && (
                <Link to="/wishlist" className="p-2.5 transition-colors hidden lg:block"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Heart size={18} />
                </Link>
              )}

              <Link to="/cart" className="relative p-2.5 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: 'var(--accent-gold)', color: '#080808' }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <Link to="/dashboard" className="p-2.5 transition-colors hidden lg:block"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <User size={18} />
                </Link>
              ) : (
                <Link to="/login" className="hidden lg:block btn-ghost text-xs ml-2">Sign In</Link>
              )}

              <button onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0, 0, 0, 0.8)' }} onClick={() => setMobileOpen(false)} />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-72 flex flex-col"
              style={{ background: 'var(--bg-card)', borderLeft: '1px solid var(--border-soft)' }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="flex justify-between items-center p-6" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <span style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-main)', letterSpacing: '0.2em', fontSize: 16 }}>TIMEAURA</span>
                <button onClick={() => setMobileOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>
              <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
                {[
                  ['Watches', '/watches'], ['Sunglasses', '/sunglasses'],
                  ["Men's", '/men'], ["Women's", '/women'], ['Shop All', '/shop'],
                  ['About', '/about'], ['Contact', '/contact'],
                ].map(([label, path]) => (
                  <Link key={label} to={path}
                    className="block py-3 text-sm uppercase tracking-widest transition-colors"
                    style={{ color: location.pathname === path ? 'var(--accent-gold)' : 'var(--text-muted)', borderBottom: '1px solid var(--border-soft)' }}
                  >{label}</Link>
                ))}
                <div className="pt-4">
                  {user ? (
                    <>
                      <Link to="/dashboard" className="block py-3 text-sm" style={{ color: 'var(--text-muted)' }}>My Account</Link>
                      <Link to="/orders" className="block py-3 text-sm" style={{ color: 'var(--text-muted)' }}>Orders</Link>
                      <button onClick={logout} className="block py-3 text-sm w-full text-left" style={{ color: '#e57373' }}>Logout</button>
                    </>
                  ) : (
                    <Link to="/login" className="btn-outline-gold w-full mt-4 block text-center">Sign In</Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setSearchOpen(false)} />
            <motion.form onSubmit={handleSearch}
              className="relative w-full max-w-lg flex gap-0"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)' }}
              initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            >
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search watches, sunglasses..."
                className="flex-1 bg-transparent px-5 py-4 text-sm outline-none"
                style={{ color: 'var(--text-main)' }}
              />
              <button type="submit" className="btn-gold px-6 py-4 text-xs rounded-none">Search</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
