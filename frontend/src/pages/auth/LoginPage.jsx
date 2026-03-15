import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <div className="auth-page__left-content">
          <Link to="/" className="auth-logo">
            <div className="auth-logo__mark">T</div>
            <div>
              <div className="auth-logo__name">Tabsha</div>
              <div className="auth-logo__sub">Custom Design</div>
            </div>
          </Link>
          <div className="auth-page__quote">
            <h2>"Fashion is the armor<br />to survive everyday life."</h2>
            <p>— Bill Cunningham</p>
          </div>
          <div className="auth-page__decor" />
        </div>
      </div>

      <div className="auth-page__right">
        <motion.div
          className="auth-form-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-form__header">
            <h1 className="auth-form__title">Welcome Back</h1>
            <p className="auth-form__sub">Sign in to your Tabsha account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <FiMail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-input input-with-icon"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <FiLock size={16} className="input-icon" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-input input-with-icon input-with-icon-right"
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button type="button" className="input-icon-right" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <div className="auth-form__forgot">
              <Link to="/forgot-password" className="auth-form__link">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary auth-form__submit" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <>Sign In <FiArrowRight size={16} /></>}
            </button>
          </form>

          <div className="auth-form__divider"><span>or</span></div>

          <div className="auth-form__demo">
            <p style={{ fontSize: '12px', color: 'var(--gray-400)', marginBottom: '10px', textAlign: 'center' }}>Demo Accounts</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="auth-demo-btn"
                onClick={() => {
                  setForm({ email: 'admin@tabsha.pk', password: 'admin123' });
                }}
              >
                Admin Login
              </button>
              <button
                className="auth-demo-btn"
                onClick={() => {
                  setForm({ email: 'user@tabsha.pk', password: 'user123' });
                }}
              >
                User Login
              </button>
            </div>
          </div>

          <p className="auth-form__switch">
            Don't have an account?{' '}
            <Link to="/register" className="auth-form__link auth-form__link--bold">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
