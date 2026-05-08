import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Code2, Heart } from 'lucide-react';

const socials = [
  { name: 'Instagram', url: 'https://www.instagram.com/conceptsin5', color: '#E1306C', icon: '📸' },
  { name: 'YouTube', url: 'https://www.youtube.com/@conceptsin5', color: '#FF0000', icon: '▶️' },
  { name: 'GitHub', url: 'https://github.com/Om-Rajpure', color: '#333', icon: '💻' },
  { name: 'Portfolio', url: 'https://conceptsin5.com/', color: '#2563EB', icon: '🌐' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/om-rajpure', color: '#0A66C2', icon: '💼' },
];

export default function DeveloperModal({ isOpen, onClose }) {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    fetch('https://api.github.com/users/Om-Rajpure')
      .then(r => r.json())
      .then(d => { if (d.avatar_url) setAvatarUrl(d.avatar_url); })
      .catch(() => {});
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dev-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 24, width: '100%', maxWidth: 420,
              boxShadow: '0 25px 80px rgba(15,23,42,0.25)', overflow: 'hidden', position: 'relative',
            }}
          >
            {/* Header gradient */}
            <div style={{
              height: 120, background: 'linear-gradient(135deg, #1E40AF 0%, #0EA5E9 50%, #06B6D4 100%)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1), transparent 50%)',
              }} />
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.15)',
                  border: 'none', borderRadius: 8, padding: 6, color: '#fff', cursor: 'pointer',
                  backdropFilter: 'blur(4px)', display: 'flex',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: -48 }}>
              <div style={{
                width: 96, height: 96, borderRadius: '50%', border: '4px solid #fff',
                background: avatarUrl ? `url(${avatarUrl}) center/cover` : 'linear-gradient(135deg, #2563EB, #0EA5E9)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-display)',
              }}>
                {!avatarUrl && 'OR'}
              </div>
            </div>

            {/* Info */}
            <div style={{ textAlign: 'center', padding: '16px 32px 0' }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0F1729', fontFamily: 'var(--font-display)', margin: 0 }}>
                Om Rajpure
              </h3>
              <p style={{
                fontSize: 13, fontWeight: 600, color: '#2563EB', marginTop: 4,
                background: '#EFF6FF', display: 'inline-block', padding: '4px 14px', borderRadius: 9999,
              }}>
                Full Stack Developer
              </p>
              <p style={{ fontSize: 14, color: '#64748B', marginTop: 12, lineHeight: 1.6 }}>
                Passionate full-stack developer focused on building scalable enterprise applications and AI-powered systems.
              </p>
            </div>

            {/* Social links */}
            <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 12,
                    border: '1.5px solid #E2E8F0', background: '#fff',
                    textDecoration: 'none', transition: 'all 200ms', cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = s.color;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 16px ${s.color}20`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#0F1729' }}>{s.name}</span>
                  <ExternalLink size={14} color="#94A3B8" />
                </a>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              borderTop: '1px solid #E2E8F0', padding: '14px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontSize: 12, color: '#94A3B8',
            }}>
              <span>Built with</span> <Heart size={12} color="#EF4444" fill="#EF4444" /> <span>by Om Rajpure</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
