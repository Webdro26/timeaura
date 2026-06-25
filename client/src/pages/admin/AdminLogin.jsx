import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      toast.success('Welcome back, Admin');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-main)' }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(201,164,92,0.04), transparent)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(199,199,199,0.03), transparent)' }} />
      </div>

      <motion.div className="w-full max-w-sm relative" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>
        {/* Brand mark */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <span className="heading-display text-2xl" style={{ letterSpacing: '0.25em' }}>TIMEAURA</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck size={16} style={{ color: 'var(--accent-gold)' }} />
            <h1 className="label-luxury" style={{ fontSize: 13, letterSpacing: '0.25em' }}>Admin Portal</h1>
          </div>
          <div className="divider-gold w-16 mx-auto mt-3" />
        </div>

        <form onSubmit={handleLogin} className="card-luxury p-8 space-y-5">
          <div>
            <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@timeaura.com" className="input-luxury pl-10" />
            </div>
          </div>
          <div>
            <label className="label-luxury block mb-2" style={{ fontSize: 10 }}>Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }} />
              <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className="input-luxury pl-10 pr-10" />
              <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-dim)' }}>
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : 'Access Dashboard'}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-dim)' }}>
          Default: admin@timeaura.com / Admin@123
        </p>
        <p className="text-center mt-4">
          <Link to="/" className="text-xs transition-colors" style={{ color: 'var(--text-dim)' }}>← Back to Store</Link>
        </p>
      </motion.div>
    </div>
  );
}
