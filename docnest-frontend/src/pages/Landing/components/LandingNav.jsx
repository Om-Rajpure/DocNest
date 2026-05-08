import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Features', 'How It Works', 'Pricing', 'About'];

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="nav-logo-mark">D</div>
          <span className="nav-logo-text">DocNest</span>
        </div>

        <div className="nav-links">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}>{l}</a>
          ))}
        </div>

        <div className="nav-actions">
          <button className="nav-btn-ghost" onClick={() => navigate('/login')}>Log In</button>
          <button className="nav-btn-primary" onClick={() => navigate('/register')}>Get Started →</button>
          <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-nav">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileOpen(false)}>{l}</a>
          ))}
          <a onClick={() => { setMobileOpen(false); navigate('/login'); }}>Log In</a>
          <a onClick={() => { setMobileOpen(false); navigate('/register'); }}>Get Started</a>
        </div>
      )}
    </nav>
  );
}
