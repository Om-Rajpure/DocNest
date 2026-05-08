import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Shield, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import './Auth.css';

const getStrength = (pwd) => {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};
const strengthColors = ['#EF4444', '#F59E0B', '#EAB308', '#10B981'];
const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'EMPLOYEE' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!agreed) e.terms = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setServerError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (success) {
    return (
      <div className="auth-success-overlay">
        <CheckCircle2 size={64} color="#10B981" />
        <h2>🎉 Account Created!</h2>
        <p>Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* Left form panel */}
      <div className="auth-form-panel">
        <motion.div className="auth-form-card" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="auth-form-logo">D</div>
          <h1>Create your account</h1>
          <p className="auth-subtitle">Start managing documents in minutes</p>

          {serverError && (
            <div className="auth-error-msg" style={{ marginBottom: 16, padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, fontSize: 13 }}>
              <AlertCircle size={14} /> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Full Name</label>
              <div className="auth-input-wrap">
                <User className="auth-input-icon" size={18} />
                <input className={`auth-input ${errors.fullName ? 'error' : ''}`} placeholder="John Doe" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
              </div>
              {errors.fullName && <div className="auth-error-msg"><AlertCircle size={12} /> {errors.fullName}</div>}
            </div>

            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <Mail className="auth-input-icon" size={18} />
                <input className={`auth-input ${errors.email ? 'error' : ''}`} type="email" placeholder="you@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              {errors.email && <div className="auth-error-msg"><AlertCircle size={12} /> {errors.email}</div>}
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" size={18} />
                <input className={`auth-input ${errors.password ? 'error' : ''}`} type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(s => !s)}>{showPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              {form.password && (
                <>
                  <div className="strength-bar">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="strength-segment" style={{ background: i < strength ? strengthColors[strength - 1] : undefined }} />
                    ))}
                  </div>
                  <div className="strength-label" style={{ color: strengthColors[strength - 1] || '#94A3B8' }}>{strengthLabels[strength - 1] || 'Too short'}</div>
                </>
              )}
              {errors.password && <div className="auth-error-msg"><AlertCircle size={12} /> {errors.password}</div>}
            </div>

            <div className="auth-input-group">
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <Shield className="auth-input-icon" size={18} />
                <input className={`auth-input ${errors.confirmPassword ? 'error' : ''}`} type={showConfirm ? 'text' : 'password'} placeholder="••••••••" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
                <button type="button" className="auth-eye-btn" onClick={() => setShowConfirm(s => !s)}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              {errors.confirmPassword && <div className="auth-error-msg"><AlertCircle size={12} /> {errors.confirmPassword}</div>}
            </div>

            <div className="auth-input-group">
              <label>Role</label>
              <div className="role-toggles">
                {['EMPLOYEE', 'MANAGER', 'ADMIN'].map(r => (
                  <button key={r} type="button" className={`role-toggle ${form.role === r ? 'active' : ''}`} onClick={() => set('role', r)}>
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="auth-checkbox-label">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                I agree to the <a href="#" style={{ color: '#2563EB', fontWeight: 500 }}>Terms of Service</a> and <a href="#" style={{ color: '#2563EB', fontWeight: 500 }}>Privacy Policy</a>
              </label>
              {errors.terms && <div className="auth-error-msg" style={{ marginTop: 4 }}><AlertCircle size={12} /> {errors.terms}</div>}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <><span className="auth-spinner" /> Creating account...</> : 'Create Account →'}
            </button>
          </form>

          <div className="auth-bottom-link">
            Already have an account? <Link to="/login">Sign in →</Link>
          </div>
        </motion.div>
      </div>

      {/* Right decorative panel */}
      <div className="auth-deco" style={{ background: 'linear-gradient(145deg, #065F46 0%, #0369A1 100%)' }}>
        <div className="auth-deco-circles">
          <div className="auth-deco-circle auth-deco-circle-1" />
          <div className="auth-deco-circle auth-deco-circle-2" />
        </div>
        <div className="auth-deco-content">
          <div className="auth-deco-logo">D</div>
          <h2>Join 500+ Companies</h2>
          <p>Create your account and start managing client documents with India's smartest platform.</p>
          <div className="auth-deco-pills">
            <span className="auth-deco-pill">📄 OCR Validation</span>
            <span className="auth-deco-pill">🌳 Family Trees</span>
            <span className="auth-deco-pill">📊 Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
