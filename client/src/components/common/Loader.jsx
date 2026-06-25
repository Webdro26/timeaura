import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onComplete }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 700);
    }, 2600);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'var(--bg-main)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Watch SVG Loader */}
          <div className="relative w-28 h-28 mb-10">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              {/* Band */}
              <rect x="47" y="0"  width="26" height="22" rx="4" fill="var(--bg-card)" stroke="var(--border-soft)" strokeWidth="1"/>
              <rect x="47" y="98" width="26" height="22" rx="4" fill="var(--bg-card)" stroke="var(--border-soft)" strokeWidth="1"/>
              {/* Outer ring */}
              <circle cx="60" cy="60" r="36" fill="none" stroke="var(--border-gold)" strokeWidth="1"/>
              {/* Face */}
              <circle cx="60" cy="60" r="32" fill="var(--bg-card)"/>
              <circle cx="60" cy="60" r="30" fill="var(--bg-soft)"/>
              {/* Hour markers */}
              {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => {
                const r = (a - 90) * Math.PI / 180;
                const isMaj = i % 3 === 0;
                const r1 = isMaj ? 22 : 24, r2 = isMaj ? 27 : 26;
                return <line key={a}
                  x1={60 + r1*Math.cos(r)} y1={60 + r1*Math.sin(r)}
                  x2={60 + r2*Math.cos(r)} y2={60 + r2*Math.sin(r)}
                  stroke={isMaj ? 'var(--accent-gold)' : 'var(--text-dim)'} strokeWidth={isMaj ? 1.5 : 0.8}
                />;
              })}
              {/* Hour hand */}
              <g style={{ transformOrigin: '60px 60px' }} className="hand-hour">
                <line x1="60" y1="60" x2="60" y2="42" stroke="var(--text-main)" strokeWidth="2" strokeLinecap="round"/>
              </g>
              {/* Minute hand */}
              <g style={{ transformOrigin: '60px 60px' }} className="hand-minute">
                <line x1="60" y1="60" x2="60" y2="38" stroke="var(--accent-silver)" strokeWidth="1.5" strokeLinecap="round"/>
              </g>
              {/* Second hand */}
              <g style={{ transformOrigin: '60px 60px' }} className="hand-second">
                <line x1="60" y1="68" x2="60" y2="36" stroke="var(--accent-gold)" strokeWidth="1" strokeLinecap="round"/>
              </g>
              {/* Center dot */}
              <circle cx="60" cy="60" r="2.5" fill="var(--accent-gold)"/>
              {/* Crown */}
              <rect x="94" y="57" width="5" height="6" rx="1.5" fill="var(--bg-soft)" stroke="var(--border-soft)" strokeWidth="0.8"/>
            </svg>
          </div>

          {/* Brand name */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 style={{ fontFamily: '"Playfair Display", serif', color: 'var(--text-main)', fontSize: 28, letterSpacing: '0.3em', marginBottom: 6 }}>
              TIMEAURA
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              Precision Meets Style
            </p>
          </motion.div>

          {/* Progress line */}
          <motion.div
            style={{ position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)', width: 120, height: 1, background: 'var(--border-soft)', borderRadius: 1 }}
          >
            <motion.div
              style={{ height: '100%', background: 'var(--accent-gold)', borderRadius: 1 }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
