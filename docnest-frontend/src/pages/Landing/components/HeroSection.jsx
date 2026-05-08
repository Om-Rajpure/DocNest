import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, FileCheck, Users, Shield } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };

const floatCards = [
  { cls: 'float-card-1', color: '#10B981', label: '✅ Document Verified' },
  { cls: 'float-card-2', color: '#2563EB', label: '4 Clients Added Today' },
  { cls: 'float-card-3', color: '#8B5CF6', label: '🌳 Family Tree Updated' },
];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-mesh" />
      <div className="hero-dots dot-bg" />

      <div className="section-container">
        <div className="hero-split">
          {/* Left */}
          <motion.div className="hero-left" variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <span className="section-badge hero-badge">🚀 Trusted by 500+ companies</span>
            </motion.div>

            <motion.h1 className="hero-title" variants={item}>
              Manage Clients,{'\n'}Documents &{'\n'}Families — <span className="highlight">Smarter.</span>
            </motion.h1>

            <motion.p className="hero-sub" variants={item}>
              DocNest brings all your client records, identity documents,
              and family relationships into one intelligent, secure platform.
            </motion.p>

            <motion.div className="hero-cta-row" variants={item}>
              <button className="btn-primary-hero" onClick={() => navigate('/register')}>
                Get Started Free →
              </button>
              <button className="btn-secondary-hero">
                <Play size={16} /> Watch Demo
              </button>
            </motion.div>

            <motion.div className="hero-trust" variants={item}>
              <span><span className="check">✓</span> No credit card required</span>
              <span><span className="check">✓</span> Free 14-day trial</span>
              <span><span className="check">✓</span> Cancel anytime</span>
            </motion.div>
          </motion.div>

          {/* Right — CSS-based dashboard mockup */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="hero-preview">
              <div className="hero-preview-header" style={{
                background: 'linear-gradient(135deg, #1E3A8A, #2563EB, #0EA5E9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20,
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <FileCheck size={28} color="rgba(255,255,255,0.8)" />
                  <Users size={28} color="rgba(255,255,255,0.8)" />
                  <Shield size={28} color="rgba(255,255,255,0.8)" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-display)' }}>
                  DocNest
                </div>
              </div>
              <div className="hero-preview-body">
                <div className="hero-preview-stats">
                  <div className="hero-mini-stat">
                    <div className="num">500+</div>
                    <div className="lbl">Clients</div>
                  </div>
                  <div className="hero-mini-stat">
                    <div className="num">50K</div>
                    <div className="lbl">Documents</div>
                  </div>
                  <div className="hero-mini-stat">
                    <div className="num">99.9%</div>
                    <div className="lbl">Uptime</div>
                  </div>
                </div>
                {/* Mini progress bars */}
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Aadhaar', pct: 85, color: '#2563EB' },
                    { label: 'PAN Card', pct: 72, color: '#10B981' },
                    { label: 'License', pct: 60, color: '#F59E0B' },
                  ].map((b, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{b.label}</span>
                        <span style={{ fontSize: 11, color: '#0F1729', fontWeight: 600 }}>{b.pct}%</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 3, background: '#F1F5F9', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, background: b.color, width: `${b.pct}%`, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating cards */}
            {floatCards.map((fc, i) => (
              <motion.div
                key={i}
                className={`float-card ${fc.cls}`}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              >
                <div className="float-dot" style={{ background: fc.color }} />
                {fc.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
