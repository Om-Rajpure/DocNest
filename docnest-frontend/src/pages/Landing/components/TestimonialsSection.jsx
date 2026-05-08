import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma', role: 'Senior Manager, HDFC Bank',
    initials: 'PS', bgColor: '#7C3AED',
    rating: 5,
    text: 'DocNest completely transformed how we manage client KYC documents. What used to take hours now takes minutes. The OCR validation alone saved us from dozens of data entry errors every week.',
  },
  {
    name: 'Rajesh Mehta', role: 'Director, Mehta & Associates',
    initials: 'RM', bgColor: '#2563EB',
    rating: 5,
    text: 'The family tree feature is brilliant. We handle estate planning cases and being able to visualize entire family hierarchies with all their documents has been a game changer for our firm.',
  },
  {
    name: 'Anita Desai', role: 'Operations Lead, Kotak Securities',
    initials: 'AD', bgColor: '#059669',
    rating: 5,
    text: 'Excel bulk import saved us 3 days of manual data entry. We imported 500 clients in under 10 minutes. The document completeness tracking keeps our compliance team happy.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="landing-section testimonials-section">
      <div className="section-container">
        <div className="section-header-center">
          <span className="section-badge">💬 Testimonials</span>
          <h2 className="section-title">Loved by Teams Everywhere</h2>
          <p className="section-subtitle">See what our customers have to say about DocNest</p>
        </div>

        <div className="testimonials-row">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className="testimonial-quote">"</div>
              <div className="testimonial-stars">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={16} fill="#F59E0B" className="testimonial-star" />
                ))}
              </div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: t.bgColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)',
                  flexShrink: 0,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
