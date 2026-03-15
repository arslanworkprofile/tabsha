import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight } from 'react-icons/fi';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';
import './Auth.css';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) { toast.success('Welcome back!'); navigate(from, { replace: true }); }
    else toast.error(res.message);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-icon">T</span>
            <div><div className="auth-logo-name">Tabsha</div><div className="auth-logo-sub">Custom Design</div></div>
          </Link>
          <blockquote className="auth-quote">
            <p>"Fashion is the armor<br />to survive everyday life."</p>
            <cite>— Bill Cunningham</cite>
          </blockquote>
          <div className="auth-left-bar" />
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to your Tabsha account</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-icon-wrap">
                <FiMail size={15} className="input-icon" />
                <input type="email" className="form-input input-with-icon" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <FiLock size={15} className="input-icon" />
                <input type={showPwd ? 'text' : 'password'} className="form-input input-with-icon input-with-icon-right" placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" className="input-icon-right" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}</button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#fff' }} /> : <>Sign In <FiArrowRight size={15} /></>}
            </button>
          </form>
          <div className="auth-demo">
            <p>Demo accounts:</p>
            <div>
              <button onClick={() => setForm({ email: 'admin@tabsha.pk', password: 'admin123' })}>Admin Login</button>
              <button onClick={() => setForm({ email: 'user@tabsha.pk', password: 'user123' })}>User Login</button>
            </div>
          </div>
          <p className="auth-switch">Don't have an account? <Link to="/register">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    const res = await register(form.name, form.email, form.password);
    setLoading(false);
    if (res.success) { toast.success('Welcome to Tabsha!'); navigate('/'); }
    else toast.error(res.message);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-icon">T</span>
            <div><div className="auth-logo-name">Tabsha</div><div className="auth-logo-sub">Custom Design</div></div>
          </Link>
          <blockquote className="auth-quote">
            <p>"Style is a way to say<br />who you are without speaking."</p>
            <cite>— Rachel Zoe</cite>
          </blockquote>
          <div className="auth-left-bar" />
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Join Tabsha for exclusive offers</p>
          <form onSubmit={handleSubmit} className="auth-form">
            {[
              { label: 'Full Name', type: 'text', key: 'name', icon: FiUser, placeholder: 'Your full name' },
              { label: 'Email', type: 'email', key: 'email', icon: FiMail, placeholder: 'you@example.com' },
              { label: 'Password', type: showPwd ? 'text' : 'password', key: 'password', icon: FiLock, placeholder: 'Min. 6 characters' },
              { label: 'Confirm Password', type: 'password', key: 'confirm', icon: FiLock, placeholder: 'Repeat password' },
            ].map(({ label, type, key, icon: Icon, placeholder }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <div className="input-icon-wrap">
                  <Icon size={15} className="input-icon" />
                  <input type={type} className="form-input input-with-icon" placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
                </div>
              </div>
            ))}
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#fff' }} /> : <>Create Account <FiArrowRight size={15} /></>}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
