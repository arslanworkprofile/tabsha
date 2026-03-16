import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { useAuthStore, useCartStore } from '../../store';
import toast from 'react-hot-toast';
import './Navbar.css';

const NAV = [
  { label: 'New Arrivals', to: '/shop?new=true' },
  { label: 'Women',        to: '/shop/women' },
  { label: 'Men',          to: '/shop/men' },
  { label: 'Kids',         to: '/shop/kids' },
  { label: 'Bridal',       to: '/shop/bridal' },
  { label: 'Sale',         to: '/shop?sale=true', red: true },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [drawerOpen, setDrawer]   = useState(false);
  const [searchOpen, setSearch]   = useState(false);
  const [userOpen, setUser]       = useState(false);
  const [q, setQ]                 = useState('');
  const { user, logout }          = useAuthStore();
  const count = useCartStore((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const navigate                  = useNavigate();
  const location                  = useLocation();
  const userRef                   = useRef(null);
  const searchRef                 = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setDrawer(false); setSearch(false); setUser(false); }, [location]);

  useEffect(() => {
    const h = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUser(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearch(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) { navigate(`/shop?search=${encodeURIComponent(q.trim())}`); setQ(''); }
  };

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  return (
    <>
      {/* Announcement bar */}
      <div className="nb-announce">
        Free Shipping on Orders Above PKR 3,000 &nbsp;·&nbsp; Custom Stitching Available &nbsp;·&nbsp; Call: +92-300-0000000
      </div>

      <header className={`nb${scrolled ? ' nb--scrolled' : ''}`}>
        <div className="nb-inner container">
          {/* Hamburger */}
          <button className="nb-ham" onClick={() => setDrawer(true)} aria-label="Menu">
            <FiMenu size={21} />
          </button>

          {/* Logo */}
          <Link to="/" className="nb-logo">
            <span className="nb-logo-icon">T</span>
            <span className="nb-logo-text">
              Tabsha<small>Custom Design</small>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="nb-nav">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className={`nb-link${n.red ? ' nb-link--red' : ''}`}>
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="nb-actions">
            {/* Search */}
            <div className="nb-search-wrap" ref={searchRef}>
              <button className="nb-icon" onClick={() => setSearch((v) => !v)} aria-label="Search">
                {searchOpen ? <FiX size={19} /> : <FiSearch size={19} />}
              </button>
              {searchOpen && (
                <form className="nb-search-box" onSubmit={handleSearch}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search Tabsha…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="nb-search-input"
                  />
                  <button type="submit" className="nb-search-btn">Go</button>
                </form>
              )}
            </div>

            <Link to="/wishlist" className="nb-icon" aria-label="Wishlist">
              <FiHeart size={19} />
            </Link>

            <Link to="/cart" className="nb-icon nb-cart" aria-label="Cart">
              <FiShoppingBag size={19} />
              {count > 0 && <span className="nb-badge">{count > 9 ? '9+' : count}</span>}
            </Link>

            {/* User */}
            <div className="nb-user-wrap" ref={userRef}>
              <button
                className={`nb-icon nb-user-btn${user ? ' nb-user-btn--in' : ''}`}
                onClick={() => user ? setUser((v) => !v) : navigate('/login')}
                aria-label="Account"
              >
                {user ? (
                  <span className="nb-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                ) : (
                  <FiUser size={19} />
                )}
              </button>

              {userOpen && user && (
                <div className="nb-dropdown">
                  <div className="nb-dropdown-head">
                    <strong>{user?.name || 'User'}</strong>
                    <span>{user?.email || ''}</span>
                  </div>
                  <Link to="/profile" className="nb-dropdown-item"><FiSettings size={14} /> Profile</Link>
                  <Link to="/my-orders" className="nb-dropdown-item"><FiPackage size={14} /> My Orders</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="nb-dropdown-item nb-dropdown-item--gold">
                      <FiSettings size={14} /> Admin Panel
                    </Link>
                  )}
                  <button className="nb-dropdown-item nb-dropdown-item--red" onClick={handleLogout}>
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && <div className="nb-backdrop" onClick={() => setDrawer(false)} />}
      <div className={`nb-drawer${drawerOpen ? ' nb-drawer--open' : ''}`}>
        <div className="nb-drawer-head">
          <Link to="/" className="nb-logo">
            <span className="nb-logo-icon">T</span>
            <span className="nb-logo-text">Tabsha<small>Custom Design</small></span>
          </Link>
          <button onClick={() => setDrawer(false)} className="nb-icon"><FiX size={22} /></button>
        </div>
        <nav className="nb-drawer-nav">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={`nb-drawer-link${n.red ? ' nb-drawer-link--red' : ''}`}>
              {n.label}
            </Link>
          ))}
          <Link to="/size-guide" className="nb-drawer-link">Size Guide</Link>
        </nav>
        <div className="nb-drawer-foot">
          {user ? (
            <>
              <Link to="/profile" className="nb-drawer-link"><FiUser size={14} /> {user?.name || 'Profile'}</Link>
              <Link to="/my-orders" className="nb-drawer-link"><FiPackage size={14} /> My Orders</Link>
              {user?.role === 'admin' && <Link to="/admin" className="nb-drawer-link">Admin Panel</Link>}
              <button className="nb-drawer-link nb-drawer-link--red" onClick={handleLogout}><FiLogOut size={14} /> Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/login" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
