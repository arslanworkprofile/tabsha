import React, { useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { useAuthStore } from '../../store';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      const { data } = await api.put('/auth/profile', payload);
      setUser(data);
      toast.success('Profile updated!');
      setForm(f => ({ ...f, password: '', confirm: '' }));
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };
  return (
    <div style={{ paddingTop: 140, paddingBottom: 80, minHeight: '70vh' }}>
      <div className="container-sm" style={{ maxWidth: 620 }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 34, fontWeight: 400, marginBottom: 8, letterSpacing: '-.02em' }}>My Profile</h1>
        <p style={{ color: 'var(--g4)', fontSize: 14, marginBottom: 32 }}>Manage your account information</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32, padding: '20px 24px', background: 'var(--g1)', borderRadius: 10 }}>
          <div style={{ width: 64, height: 64, background: 'var(--black)', color: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 600 }}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div><div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500 }}>{user?.name}</div><div style={{ fontSize: 13, color: 'var(--g4)', marginTop: 3 }}>{user?.email}</div>{user?.role === 'admin' && <span className="badge badge-gold" style={{ marginTop: 6, display: 'inline-flex' }}>Administrator</span>}</div>
        </div>
        <form onSubmit={handleSubmit} style={{ background: 'var(--white)', border: '1px solid var(--g2)', borderRadius: 10, padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={user?.email} readOnly style={{ background: 'var(--g1)' }} /><span style={{ fontSize: 12, color: 'var(--g4)' }}>Email cannot be changed</span></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} placeholder="+92-XXX-XXXXXXX" onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          <div style={{ borderTop: '1px solid var(--g2)', paddingTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Change Password <span style={{ fontWeight: 400, color: 'var(--g4)' }}>(leave blank to keep current)</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label className="form-label">New Password</label><input type="password" className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Confirm Password</label><input type="password" className="form-input" placeholder="Repeat password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} /></div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 24px' }} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }} /> : <><FiSave size={14} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
