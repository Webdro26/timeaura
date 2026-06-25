import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FRAME_COUNT = 300;
const frameSrc = (i) => `/frames/hero/frame_${String(i).padStart(4, '0')}.jpg`;
const POSTER_FRAME = frameSrc(60);

function drawCover(ctx, img, canvas) {
  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = cw / ch;

  let w, h, x, y;

  if (imgRatio > canvasRatio) {
    h = ch;
    w = h * imgRatio;
    x = (cw - w) / 2;
    y = 0;
  } else {
    w = cw;
    h = w / imgRatio;
    x = 0;
    y = (ch - h) / 2;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, x, y, w, h);
}

export default function ScrollVideoHero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const cacheRef = useRef({});
  const currentFrameRef = useRef(1);
  const rafRef = useRef(null);

  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawFrame(currentFrameRef.current);
  };

  const loadFrame = (frameNumber) => {
    if (frameNumber < 1 || frameNumber > FRAME_COUNT) return;
    if (cacheRef.current[frameNumber]) return cacheRef.current[frameNumber];

    const img = new Image();
    img.src = frameSrc(frameNumber);
    cacheRef.current[frameNumber] = img;
    return img;
  };

  const drawFrame = (frameNumber) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let img = cacheRef.current[frameNumber];

    if (!img) img = loadFrame(frameNumber);

    if (!img.complete || img.naturalWidth === 0) {
      img.onload = () => drawFrame(frameNumber);

      for (let i = frameNumber - 1; i >= 1; i--) {
        const prev = cacheRef.current[i];
        if (prev?.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
      }
    }

    if (!img?.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    drawCover(ctx, img, canvas);
  };

  const preloadAround = (frameNumber) => {
    for (let i = frameNumber - 4; i <= frameNumber + 8; i++) {
      loadFrame(i);
    }
  };

  useEffect(() => {
    const first = loadFrame(60);
    first.onload = () => {
      setReady(true);
      setupCanvas();
      drawFrame(1);
    };

    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, []);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (progress) => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        const frameNumber = Math.min(
          FRAME_COUNT,
          Math.max(1, Math.floor(progress * FRAME_COUNT))
        );

        currentFrameRef.current = frameNumber;
        loadFrame(frameNumber);
        preloadAround(frameNumber);
        drawFrame(frameNumber);

        rafRef.current = null;
      });
    });

    return () => {
      unsub();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="relative h-[140vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <img
          src={POSTER_FRAME}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? 'opacity-0' : 'opacity-100'}`}
        />

        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.12),rgba(0,0,0,0.72)_70%,rgba(0,0,0,0.96)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black" />

        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 text-center"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <div className="max-w-4xl">
            <p className="label-luxury mb-6">Luxury Timepieces & Eyewear</p>

            <h1
              className="heading-display mb-6"
              style={{ fontSize: 'clamp(52px, 10vw, 130px)', letterSpacing: '0.18em' }}
            >
              TIMEAURA
            </h1>

            <p
              className="mb-4"
              style={{
                color: 'var(--accent-gold-light)',
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(22px, 3vw, 34px)',
                fontStyle: 'italic',
              }}
            >
              Precision Meets Style
            </p>

            <p className="mx-auto mb-10 max-w-xl text-sm md:text-base" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Premium watches and sunglasses curated for modern luxury.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/watches" className="btn-gold">
                Shop Watches <ArrowRight size={14} />
              </Link>
              <Link to="/sunglasses" className="btn-outline-gold">
                Explore Sunglasses
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="mx-auto mb-2 h-10 w-px bg-gradient-to-b from-[var(--accent-gold)] to-transparent" />
          <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: 'var(--text-dim)' }}>
            Scroll
          </p>
        </div>
      </div>
    </section>
  );
}