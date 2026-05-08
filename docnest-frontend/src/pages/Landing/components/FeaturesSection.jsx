import { motion } from 'framer-motion';
import { FileCheck, GitBranch, Table, ScanLine, Activity, Search } from 'lucide-react';

const features = [
  {
    icon: <FileCheck size={24} />, title: 'Smart Document Management',
    desc: 'Upload Aadhaar, PAN, DL, Electricity Bills with AI-powered OCR validation. Track every document status in real-time.',
    iconBg: '#EFF6FF', iconColor: '#2563EB', span: true,
  },
  {
    icon: <GitBranch size={24} />, title: 'Interactive Family Tree',
    desc: 'Visualize complete family hierarchies with expandable nodes and relationship mapping.',
    iconBg: '#F5F3FF', iconColor: '#7C3AED',
  },
  {
    icon: <Table size={24} />, title: 'Excel Bulk Import',
    desc: 'Upload hundreds of clients at once from any spreadsheet format.',
    iconBg: '#ECFDF5', iconColor: '#059669',
  },
  {
    icon: <ScanLine size={24} />, title: 'OCR Document Verification',
    desc: 'AI reads your documents and validates them automatically with pattern matching.',
    iconBg: '#FFF7ED', iconColor: '#D97706', span: true,
  },
  {
    icon: <Activity size={24} />, title: 'Activity Timeline',
    desc: 'Every action logged with timestamp — full audit trail for compliance.',
    iconBg: '#FDF2F8', iconColor: '#DB2777',
  },
  {
    icon: <Search size={24} />, title: 'Real-time Search & Filters',
    desc: 'Find any client in milliseconds with advanced filtering and sorting.',
    iconBg: '#F0F9FF', iconColor: '#0284C7', span: true,
  },
];

export default function FeaturesSection() {
  return (
    <section className="landing-section" id="features">
      <div className="section-container">
        <div className="section-header-center">
          <span className="section-badge">⚡ Everything You Need</span>
          <h2 className="section-title">One Platform. Every Document.</h2>
          <p className="section-subtitle">
            Stop juggling spreadsheets and folders. DocNest organizes everything automatically.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="feature-icon" style={{ background: f.iconBg, color: f.iconColor }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
