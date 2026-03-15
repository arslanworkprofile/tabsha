import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success('Account created! Welcome to Tabsha!');
      navigate('/');
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
            <h2>"Style is a way to<br />say who you are<br />without speaking."</h2>
            <p>— Rachel Zoe</p>
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
            <h1 className="auth-form__title">Create Account</h1>
            <p className="auth-form__sub">Join Tabsha for exclusive offers</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrap">
                <FiUser size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input input-with-icon"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
            </div>

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
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button type="button" className="input-icon-right" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrap">
                <FiLock size={16} className="input-icon" />
                <input
                  type="password"
                  className="form-input input-with-icon"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-form__submit" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <>Create Account <FiArrowRight size={16} /></>}
            </button>
          </form>

          <p className="auth-form__switch" style={{ marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" className="auth-form__link auth-form__link--bold">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
