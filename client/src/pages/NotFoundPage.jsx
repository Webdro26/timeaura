import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 flex items-center justify-center min-h-[80vh] px-4">
        <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            className="font-display text-[150px] font-bold leading-none text-gradient opacity-20 select-none"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >404</motion.div>
          <h1 className="font-display text-3xl font-bold text-white -mt-8 mb-3">Page Not Found</h1>
          <p className="text-gray-400 mb-8">Looks like this page has gone out of style.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="btn-primary flex items-center gap-2"><Home size={16} /> Go Home</Link>
            <button onClick={() => window.history.back()} className="btn-outline flex items-center gap-2"><ArrowLeft size={16} /> Go Back</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
