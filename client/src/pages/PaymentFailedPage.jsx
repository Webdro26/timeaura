import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, Home } from 'lucide-react';
import Navbar from '../components/common/Navbar';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[80vh] px-4">
        <motion.div className="text-center max-w-md" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <motion.div
            className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
          >
            <XCircle size={48} className="text-red-400" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Payment Failed</h1>
          <p className="text-gray-400 mb-8">Something went wrong with your payment. Your cart is still saved — please try again.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/checkout" className="btn-primary flex items-center justify-center gap-2">
              <RefreshCw size={16} /> Try Again
            </Link>
            <Link to="/" className="btn-outline flex items-center justify-center gap-2">
              <Home size={16} /> Go Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
