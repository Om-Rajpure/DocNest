import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Starter', price: 'Free', period: '', desc: 'For individuals getting started',
    features: ['Up to 50 clients', '100 documents', 'Basic search', 'Email support', 'Single user'],
    popular: false,
  },
  {
    name: 'Professional', price: '₹1,999', period: '/mo', desc: 'For growing teams and firms',
    features: ['Unlimited clients', 'Unlimited documents', 'OCR verification', 'Family tree', 'Excel import', 'Priority support', 'Up to 10 users'],
    popular: true,
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', desc: 'For large organizations',
    features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA guarantee', 'SSO & LDAP', 'Audit logs', 'Unlimited users'],
    popular: false,
  },
];

export default function PricingSection() {
  const navigate = useNavigate();

  return (
    <section className="landing-section" id="pricing">
      <div className="section-container">
        <div className="section-header-center">
          <span className="section-badge">💰 Pricing</span>
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Start free, upgrade when you need more power</p>
        </div>

        <div className="pricing-row">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              className={`pricing-card ${p.popular ? 'popular' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {p.popular && <div className="pricing-popular-badge">Most Popular</div>}
              <div className="pricing-plan">{p.name}</div>
              <div className="pricing-price">
                {p.price}<span>{p.period}</span>
              </div>
              <p className="pricing-desc">{p.desc}</p>
              <ul className="pricing-features">
                {p.features.map((f, j) => (
                  <li key={j}><Check size={16} className="check-icon" /> {f}</li>
                ))}
              </ul>
              <button
                className={`pricing-btn ${p.popular ? 'pricing-btn-primary' : 'pricing-btn-outline'}`}
                onClick={() => navigate('/register')}
              >
                {p.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
