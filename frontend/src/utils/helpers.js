// Price formatter
export const formatPrice = (amount, currency = 'PKR') =>
  `${currency} ${Number(amount).toLocaleString('en-PK')}`;

// Discount calculator
export const calcDiscount = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

// Slug generator
export const toSlug = (str) =>
  str.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

// Truncate text
export const truncate = (str, maxLen = 100) =>
  str && str.length > maxLen ? str.slice(0, maxLen) + '...' : str;

// Get primary image
export const getPrimaryImage = (images, fallback = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80') => {
  if (!images || images.length === 0) return fallback;
  const primary = images.find(img => img.isPrimary);
  return primary?.url || images[0]?.url || fallback;
};

// Validate email
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Validate Pakistani phone
export const isValidPhone = (phone) =>
  /^(\+92|0092|0)[0-9]{10}$/.test(phone.replace(/[-\s]/g, ''));

// Format date
export const formatDate = (dateStr, options = {}) => {
  const defaults = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-PK', { ...defaults, ...options });
};

// Format relative time
export const timeAgo = (dateStr) => {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

// Order status config
export const ORDER_STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#f59e0b', bg: '#fef3e2' },
  confirmed:  { label: 'Confirmed',  color: '#3b82f6', bg: '#e3f2fd' },
  processing: { label: 'Processing', color: '#8b5cf6', bg: '#f3e5f5' },
  shipped:    { label: 'Shipped',    color: '#10b981', bg: '#e8f5e9' },
  delivered:  { label: 'Delivered',  color: '#059669', bg: '#d4edda' },
  cancelled:  { label: 'Cancelled',  color: '#ef4444', bg: '#fde8e6' },
  returned:   { label: 'Returned',   color: '#6b7280', bg: '#f5f5f5' },
};

// Cart helpers
export const getCartKey = (productId, size, color) =>
  `${productId}-${size || 'nosize'}-${color || 'nocolor'}`;

export const calcCartTotals = (items) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCost = subtotal >= 3000 ? 0 : 250;
  const total = subtotal + shippingCost;
  return { subtotal, shippingCost, total };
};

// Storage helpers
export const storage = {
  get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  remove: (key) => { try { localStorage.removeItem(key); } catch {} },
};

// Generate random ID
export const nanoid = (len = 8) =>
  Math.random().toString(36).slice(2, 2 + len);
