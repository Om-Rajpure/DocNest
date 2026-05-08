import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-circle cta-circle-1" />
      <div className="cta-circle cta-circle-2" />
      <div className="cta-circle cta-circle-3" />

      <div className="section-container">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles size={48} color="#fff" style={{ marginBottom: 16 }} />
          <h2>Ready to Organize Your Client Data?</h2>
          <p className="cta-sub">Join 500+ companies already using DocNest</p>

          <div className="cta-buttons">
            <button className="cta-btn-white" onClick={() => navigate('/register')}>
              Start Free Trial
            </button>
            <button className="cta-btn-ghost">Schedule Demo</button>
          </div>

          <div className="cta-trust">
            <span>🔒 Bank-grade Security</span>
            <span>🇮🇳 India Compliant</span>
            <span>📞 24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
