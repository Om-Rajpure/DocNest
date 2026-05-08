import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { FaInstagram, FaYoutube, FaGithub, FaGlobe, FaLinkedinIn } from 'react-icons/fa';

const socials = [
  { icon: FaInstagram, label: 'Instagram', url: 'https://www.instagram.com/conceptsin5' },
  { icon: FaYoutube, label: 'YouTube', url: 'https://www.youtube.com/@conceptsin5' },
  { icon: FaGithub, label: 'GitHub', url: 'https://github.com/Om-Rajpure' },
  { icon: FaGlobe, label: 'Portfolio', url: 'https://conceptsin5.com/' },
  { icon: FaLinkedinIn, label: 'LinkedIn', url: 'https://www.linkedin.com/in/om-rajpure' },
];

export default function DeveloperModal({ isOpen, onClose }) {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [tooltip, setTooltip] = useState('');
  const cardRef = useRef(null);

  // Fetch GitHub avatar
  useEffect(() => {
    fetch('https://api.github.com/users/Om-Rajpure')
      .then(r => r.json())
      .then(d => { if (d.avatar_url) setAvatarUrl(d.avatar_url); })
      .catch(() => {});
  }, []);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Mouse-follow glow
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dev-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Developer Profile"
        >
          <motion.div
            ref={cardRef}
            className="dev-card"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380, mass: 0.8 }}
            onClick={e => e.stopPropagation()}
            onMouseMove={handleMouseMove}
            style={{
              '--glow-x': `${mousePos.x}%`,
              '--glow-y': `${mousePos.y}%`,
            }}
          >
            {/* Mouse-follow glow */}
            <div className="dev-glow" />

            {/* Animated gradient bg */}
            <div className="dev-gradient-bg">
              <div className="dev-orb dev-orb-1" />
              <div className="dev-orb dev-orb-2" />
              <div className="dev-orb dev-orb-3" />
            </div>

            {/* Close btn */}
            <button className="dev-close" onClick={onClose} aria-label="Close">
              <X size={16} strokeWidth={2.5} />
            </button>

            {/* Profile content */}
            <div className="dev-content">
              {/* Avatar */}
              <div className="dev-avatar-wrap">
                <div className="dev-avatar-ring" />
                <div
                  className="dev-avatar"
                  style={{
                    backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
                  }}
                >
                  {!avatarUrl && <span>OR</span>}
                </div>
              </div>

              {/* Name */}
              <h3 className="dev-name">Om Rajpure</h3>

              {/* Role badge */}
              <div className="dev-role-badge">
                <span className="dev-role-shimmer" />
                <span className="dev-role-text">Full Stack Developer</span>
              </div>

              {/* Bio */}
              <p className="dev-bio">
                Building scalable web experiences and intelligent enterprise systems.
              </p>

              {/* Social dock */}
              <div className="dev-social-dock">
                {socials.map((s, i) => (
                  <div key={i} className="dev-social-wrap"
                    onMouseEnter={() => setTooltip(s.label)}
                    onMouseLeave={() => setTooltip('')}
                  >
                    {tooltip === s.label && (
                      <motion.span
                        className="dev-tooltip"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {s.label}
                      </motion.span>
                    )}
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dev-social-btn"
                      aria-label={s.label}
                    >
                      <s.icon size={18} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="dev-footer">
              <span className="dev-footer-text">
                Built with <Heart size={11} className="dev-heart" /> by Om Rajpure
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
