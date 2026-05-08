import { useState } from 'react';
import { Globe, Link2, Code2, Heart, Sparkles } from 'lucide-react';
import DeveloperModal from './DeveloperModal';

export default function LandingFooter() {
  const [devOpen, setDevOpen] = useState(false);

  return (
    <>
      <footer className="landing-footer">
        <div className="section-container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-mark">D</div>
                <span className="footer-logo-text">DocNest</span>
              </div>
              <p>Smart client document and family management platform built for modern enterprises.</p>
              <div className="footer-social">
                <a href="https://github.com/Om-Rajpure" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Code2 size={18} /></a>
                <a href="https://www.linkedin.com/in/om-rajpure" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Link2 size={18} /></a>
                <a href="https://conceptsin5.com/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio"><Globe size={18} /></a>
              </div>
            </div>

            {/* Product */}
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Changelog</a>
            </div>

            {/* Company */}
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>

            {/* Developer */}
            <div className="footer-col">
              <h4>Connect</h4>
              <a href="https://www.instagram.com/conceptsin5" target="_blank" rel="noopener noreferrer">📸 Instagram</a>
              <a href="https://www.youtube.com/@conceptsin5" target="_blank" rel="noopener noreferrer">▶️ YouTube</a>
              <a href="https://github.com/Om-Rajpure" target="_blank" rel="noopener noreferrer">💻 GitHub</a>
              <button
                onClick={() => setDevOpen(true)}
                className="footer-dev-btn"
              >
                <Sparkles size={14} />
                Meet the Developer
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2024 DocNest. All rights reserved.</span>
            <button
              onClick={() => setDevOpen(true)}
              className="footer-dev-badge"
            >
              <Code2 size={13} />
              Built by <strong>Om Rajpure</strong>
            </button>
            <span>Made with <span className="heart">❤️</span> in India 🇮🇳</span>
          </div>
        </div>
      </footer>

      <DeveloperModal isOpen={devOpen} onClose={() => setDevOpen(false)} />
    </>
  );
}
