import { motion } from 'framer-motion';
import { UserPlus, Users, ShieldCheck, LayoutDashboard } from 'lucide-react';

const steps = [
  {
    num: '01', title: 'Add Your Clients', icon: <UserPlus size={24} />,
    iconBg: '#EFF6FF', iconColor: '#2563EB',
    desc: 'Fill in client details including name, contact, DOB, and location in seconds.',
    gradient: 'linear-gradient(135deg, #2563EB, #60A5FA)',
    emoji: '👤',
  },
  {
    num: '02', title: 'Build Family Records', icon: <Users size={24} />,
    iconBg: '#F5F3FF', iconColor: '#7C3AED', reverse: true,
    desc: 'Link spouses, children, and relatives to create complete family profiles.',
    gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
    emoji: '👨‍👩‍👧‍👦',
  },
  {
    num: '03', title: 'Upload & Verify Documents', icon: <ShieldCheck size={24} />,
    iconBg: '#ECFDF5', iconColor: '#059669',
    desc: 'Our OCR engine reads and validates every document automatically.',
    gradient: 'linear-gradient(135deg, #059669, #34D399)',
    emoji: '📄',
  },
  {
    num: '04', title: 'Search & Manage', icon: <LayoutDashboard size={24} />,
    iconBg: '#FFF7ED', iconColor: '#D97706', reverse: true,
    desc: 'Find any client instantly. Track document status across your entire database.',
    gradient: 'linear-gradient(135deg, #D97706, #FBBF24)',
    emoji: '🔍',
  },
];

function StepVisual({ gradient, emoji }) {
  return (
    <div style={{
      width: '100%', aspectRatio: '16 / 10', maxHeight: 280, borderRadius: 16, background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15), transparent 60%)',
      }} />
      <div style={{ fontSize: 72, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>{emoji}</div>
      <div style={{
        position: 'absolute', bottom: 20, left: 20, right: 20,
        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
        borderRadius: 12, padding: '12px 16px',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
        <div style={{ height: 6, flex: 1, borderRadius: 3, background: 'rgba(255,255,255,0.3)' }}>
          <div style={{ height: '100%', width: '70%', borderRadius: 3, background: '#fff' }} />
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="landing-section" id="how-it-works" style={{ background: 'var(--bg-base)' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'rgba(37,99,235,0.04)', filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div className="section-container">
        <div className="section-header-center">
          <span className="section-badge">🔄 Simple Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get started in four simple steps</p>
        </div>

        <div className="hiw-steps">
          <div className="hiw-line" />
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className={`hiw-step ${s.reverse ? 'reverse' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="hiw-step-content">
                <div className="hiw-step-num">{s.num}</div>
                <div className="hiw-icon" style={{ background: s.iconBg, color: s.iconColor }}>
                  {s.icon}
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              <div className="hiw-step-image">
                <StepVisual gradient={s.gradient} emoji={s.emoji} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
