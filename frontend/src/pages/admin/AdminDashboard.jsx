// ── AdminDashboard ────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getOrderStats, getAllOrders, getUsers } from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats]   = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, deliveredOrders: 0 });
  const [orders, setOrders] = useState([]);
  const [users, setUsers]   = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrderStats(), getAllOrders({ limit: 6 }), getUsers({ limit: 1 })])
      .then(([sRes, oRes, uRes]) => {
        setStats(sRes.data);
        setOrders(oRes.data.orders || []);
        setUsers(uRes.data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STATS = [
    { label: 'Total Revenue',   value: `PKR ${(stats.totalRevenue || 0).toLocaleString()}`, icon: '💰', bg: 'rgba(184,151,62,.12)', c: 'var(--gold)' },
    { label: 'Total Orders',    value: stats.totalOrders || 0,    icon: '🛍️', bg: 'rgba(59,130,246,.12)', c: '#3b82f6' },
    { label: 'Pending Orders',  value: stats.pendingOrders || 0,  icon: '⏳', bg: 'rgba(245,158,11,.12)', c: '#f59e0b' },
    { label: 'Customers',       value: users,                      icon: '👥', bg: 'rgba(16,185,129,.12)', c: '#10b981' },
  ];

  return (
    <div>
      <div className="adm-page-hdr">
        <div><h1 className="adm-page-title">Dashboard</h1><p className="adm-page-sub">Welcome back!</p></div>
        <Link to="/admin/products/add" className="btn btn-primary btn-sm">+ Add Product</Link>
      </div>

      <div className="adm-stats">
        {STATS.map((s) => (
          <div key={s.label} className="adm-stat">
            <div className="adm-stat-label">{s.label}<div className="adm-stat-icon" style={{ background: s.bg }}>{s.icon}</div></div>
            <div className="adm-stat-value">{loading ? '—' : s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18 }}>
        <div className="adm-card">
          <div className="adm-card-hdr"><span className="adm-card-title">Recent Orders</span><Link to="/admin/orders" style={{ fontSize: 11, color: 'var(--adm-accent)', fontWeight: 600 }}>View All →</Link></div>
          <div className="adm-tbl-wrap">
            <table className="adm-tbl">
              <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {loading ? [...Array(5)].map((_, i) => <tr key={i}>{[...Array(5)].map((_, j) => <td key={j}><div className="skeleton" style={{ height: 13 }} /></td>)}</tr>)
                  : orders.length === 0 ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--g4)' }}>No orders yet</td></tr>
                  : orders.map((o) => (
                    <tr key={o._id}>
                      <td><Link to={`/admin/orders/${o._id}`} style={{ color: 'var(--adm-accent)', fontWeight: 700 }}>{o.orderNumber}</Link></td>
                      <td>{o.user?.name || '—'}</td>
                      <td style={{ fontWeight: 700 }}>PKR {o.total?.toLocaleString()}</td>
                      <td><span className={`status-badge status-badge--${o.orderStatus}`}>{o.orderStatus}</span></td>
                      <td style={{ color: 'var(--adm-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="adm-card">
          <div className="adm-card-hdr"><span className="adm-card-title">Quick Actions</span></div>
          <div className="adm-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Add New Product',   to: '/admin/products/add', icon: '📦', c: '#c9a84c' },
              { label: 'Manage Categories', to: '/admin/categories',   icon: '🏷️', c: '#3b82f6' },
              { label: 'View All Orders',   to: '/admin/orders',       icon: '🛒', c: '#f59e0b' },
              { label: 'Manage Users',      to: '/admin/users',        icon: '👥', c: '#10b981' },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="adm-quick-link">
                <div className="adm-quick-icon" style={{ background: l.c + '20' }}>{l.icon}</div>
                <span>{l.label}</span>
                <FiArrowRight size={13} style={{ marginLeft: 'auto', color: 'var(--g3)' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
