import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Shield, Star, Truck, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />
      <div className="pt-24 pb-20">
        {/* Hero */}
        <div className="relative py-20 bg-gradient-to-br from-steel via-gunmetal to-charcoal mb-16 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-electric rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <motion.h1 className="font-display text-5xl font-bold text-white mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              About <span className="text-gradient">TimeAura</span>
            </motion.h1>
            <p className="text-gray-400 text-lg">Where luxury meets everyday style</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-4">Our Story</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                TimeAura was born from a simple belief: premium accessories should be accessible to everyone. We curate the finest watches and sunglasses from around the world, bringing them directly to your doorstep.
              </p>
              <p className="text-gray-400 leading-relaxed">
                From iconic Swiss-inspired designs to bold streetwear aesthetics, every product in our collection is hand-picked to ensure quality, authenticity, and style.
              </p>
            </div>
            <div className="glass-card p-8">
              <div className="grid grid-cols-2 gap-6">
                {[['10,000+', 'Happy Customers'], ['500+', 'Products'], ['50+', 'Brands'], ['4.9★', 'Avg Rating']].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <div className="font-display text-3xl font-bold text-electric">{num}</div>
                    <div className="text-gray-400 text-sm mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Authenticity', desc: '100% genuine products with full warranty' },
              { icon: Star, title: 'Premium Quality', desc: 'Curated from top global brands' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Pan-India delivery in 3-7 days' },
              { icon: Award, title: 'Excellence', desc: '5-star rated customer service' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-5 text-center">
                <Icon size={24} className="text-electric mx-auto mb-3" />
                <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
