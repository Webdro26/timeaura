import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Home, ArrowRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[80vh] px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success icon */}
          <motion.div
            className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle size={48} className="text-green-400" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="font-display text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-400 mb-4">Your order has been placed successfully.</p>

            {orderId && (
              <div className="glass-card p-4 mb-6 inline-block">
                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                <p className="font-mono text-electric font-bold">{orderId}</p>
              </div>
            )}

            <p className="text-sm text-gray-400 mb-8">
              We'll send you updates about your order. Expected delivery in 3-7 business days.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/orders" className="btn-primary flex items-center justify-center gap-2">
                <Package size={16} /> Track Order
              </Link>
              <Link to="/" className="btn-outline flex items-center justify-center gap-2">
                <Home size={16} /> Continue Shopping
              </Link>
            </div>
          </motion.div>

          {/* Confetti-like dots */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? '#00d4ff' : '#ffd700',
                top: `${20 + i * 10}%`,
                left: `${10 + i * 15}%`,
              }}
              animate={{ y: [0, -30, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
