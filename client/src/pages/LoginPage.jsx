import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, KeyRound, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [step, setStep] = useState('phone'); // phone | otp | guest
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestName, setGuestName] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (phone.length !== 10) return toast.error('Enter valid 10-digit number');
    setLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { phone });
      toast.success('OTP sent!');
      if (res.data.otp) toast(`Dev OTP: ${res.data.otp}`, { icon: '🔑' }); // dev only
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { phone, otp });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success('Welcome to TimeAura!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    }
    setLoading(false);
  };

  const guestLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/guest', { name: guestName || 'Guest', phone: '0000000000' + Date.now() });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success('Continuing as guest');
      navigate('/checkout');
    } catch (err) {
      toast.error('Guest login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-electric/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric to-blue-600 flex items-center justify-center">
            <span className="text-sm font-bold text-white font-mono">T</span>
          </div>
          <span className="font-display text-2xl font-bold text-gradient">TimeAura</span>
        </Link>

        <div className="glass-card p-8">
          {step === 'phone' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-display text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400 text-sm mb-6">Login with your mobile number</p>

              <div className="mb-4">
                <label className="text-sm text-gray-400 mb-1.5 block">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400 text-sm font-mono">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && sendOtp()}
                    placeholder="Enter 10-digit number"
                    className="input-dark pl-14"
                  />
                  <Phone size={14} className="absolute right-4 top-3.5 text-gray-500" />
                </div>
              </div>

              <button onClick={sendOtp} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send OTP <ArrowRight size={14} /></>}
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-dark-card px-3 text-xs text-gray-500">OR</span>
                </div>
              </div>

              <button onClick={() => setStep('guest')} className="btn-outline w-full flex items-center justify-center gap-2">
                <User size={14} /> Continue as Guest
              </button>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={() => setStep('phone')} className="text-electric text-sm mb-4 flex items-center gap-1">← Back</button>
              <h2 className="font-display text-2xl font-bold text-white mb-2">Verify OTP</h2>
              <p className="text-gray-400 text-sm mb-6">Enter the 6-digit OTP sent to +91 {phone}</p>

              <div className="mb-4">
                <label className="text-sm text-gray-400 mb-1.5 block">OTP</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && verifyOtp()}
                    placeholder="Enter 6-digit OTP"
                    className="input-dark text-center text-2xl font-mono tracking-widest"
                  />
                  <KeyRound size={14} className="absolute right-4 top-3.5 text-gray-500" />
                </div>
              </div>

              <button onClick={verifyOtp} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify & Login'}
              </button>

              <button onClick={sendOtp} className="text-center w-full mt-3 text-sm text-gray-500 hover:text-electric">
                Resend OTP
              </button>
            </motion.div>
          )}

          {step === 'guest' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={() => setStep('phone')} className="text-electric text-sm mb-4 flex items-center gap-1">← Back</button>
              <h2 className="font-display text-2xl font-bold text-white mb-2">Guest Checkout</h2>
              <p className="text-gray-400 text-sm mb-6">No account needed. Just enter your name.</p>

              <div className="mb-4">
                <label className="text-sm text-gray-400 mb-1.5 block">Your Name (optional)</label>
                <input
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="input-dark"
                />
              </div>

              <button onClick={guestLogin} disabled={loading} className="btn-primary w-full">
                {loading ? 'Loading...' : 'Continue as Guest'}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
