import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiLogOut, FiMenu, FiExternalLink, FiChevronRight } from 'react-icons/fi';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';
import './AdminLayout.css';

const NAV = [
  { icon: FiGrid,      label: 'Dashboard', to: '/admin',            end: true },
  { icon: FiPackage,   label: 'Products',  to: '/admin/products'              },
  { icon: FiTag,       label: 'Categories',to: '/admin/categories'            },
  { icon: FiShoppingBag,label:'Orders',   to: '/admin/orders'               },
  { icon: FiUsers,     label: 'Users',     to: '/admin/users'                },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  const SidebarInner = ({ mobile = false }) => (
    <div className="adm-sidebar-inner">
      <div className="adm-logo">
        <span className="adm-logo-icon">T</span>
        {(!collapsed || mobile) && (
          <div className="adm-logo-text">
            <span>Tabsha</span>
            <small>Admin Panel</small>
          </div>
        )}
      </div>
      <nav className="adm-nav">
        {NAV.map(({ icon: Icon, label, to, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `adm-link${isActive ? ' active' : ''}`}
            title={collapsed && !mobile ? label : undefined}
          >
            <Icon size={17} />
            {(!collapsed || mobile) && <span>{label}</span>}
            {(!collapsed || mobile) && <FiChevronRight size={13} className="adm-link-arrow" />}
          </NavLink>
        ))}
      </nav>
      <div className="adm-bottom">
        {(!collapsed || mobile) && user && (
          <div className="adm-user">
            <div className="adm-user-avatar">{user.name?.charAt(0)}</div>
            <div className="adm-user-info">
              <strong>{user.name}</strong>
              <span>Administrator</span>
            </div>
          </div>
        )}
        <button className="adm-link adm-logout" onClick={handleLogout} title="Logout">
          <FiLogOut size={17} />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className={`adm-layout${collapsed ? ' adm-layout--collapsed' : ''}`}>
      {/* Desktop sidebar */}
      <aside className="adm-sidebar">
        <SidebarInner />
        <button className="adm-collapse-btn" onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expand' : 'Collapse'}>
          <FiChevronRight size={13} style={{ transform: collapsed ? 'none' : 'rotate(180deg)', transition: 'transform .25s' }} />
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && <div className="adm-backdrop" onClick={() => setMobileOpen(false)} />}
      <aside className={`adm-sidebar adm-sidebar--mobile${mobileOpen ? ' open' : ''}`}>
        <SidebarInner mobile />
      </aside>

      {/* Main */}
      <div className="adm-main">
        <header className="adm-topbar">
          <button className="adm-ham" onClick={() => setMobileOpen(true)}><FiMenu size={20} /></button>
          <span className="adm-topbar-title">Admin Panel</span>
          <div className="adm-topbar-actions">
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiExternalLink size={13} /> View Store
            </a>
          </div>
        </header>
        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
