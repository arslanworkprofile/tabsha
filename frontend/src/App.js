import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth pages
import { LoginPage, RegisterPage } from './pages/auth/AuthPages';

// Shop pages - direct imports (no lazy, more reliable on Railway)
import HomePage          from './pages/shop/HomePage';
import ShopPage          from './pages/shop/ShopPage';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CartPage          from './pages/shop/CartPage';
import CheckoutPage      from './pages/shop/CheckoutPage';
import OrderConfirmationPage from './pages/shop/OrderConfirmationPage';
import WishlistPage      from './pages/shop/WishlistPage';
import ProfilePage       from './pages/shop/ProfilePage';
import MyOrdersPage      from './pages/shop/MyOrdersPage';
import SizeGuidePage     from './pages/shop/SizeGuidePage';
import NotFoundPage      from './pages/NotFoundPage';

// Admin pages
import AdminLayout       from './pages/admin/AdminLayout';
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminProducts     from './pages/admin/AdminProducts';
import AdminAddProduct   from './pages/admin/AdminAddProduct';
import AdminCategories   from './pages/admin/AdminCategories';
import AdminOrders       from './pages/admin/AdminOrders';
import AdminOrderDetail  from './pages/admin/AdminOrderDetail';
import AdminUsers        from './pages/admin/AdminUsers';

function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function ShopLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '70vh' }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  const { initAuth } = useAuthStore();

  // eslint-disable-next-line
  useEffect(() => { initAuth(); }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2800,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0,0,0,.1)',
          },
          success: { iconTheme: { primary: '#b8973e', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Shop */}
        <Route path="/"               element={<ShopLayout><HomePage /></ShopLayout>} />
        <Route path="/shop"           element={<ShopLayout><ShopPage /></ShopLayout>} />
        <Route path="/shop/:category" element={<ShopLayout><ShopPage /></ShopLayout>} />
        <Route path="/product/:slug"  element={<ShopLayout><ProductDetailPage /></ShopLayout>} />
        <Route path="/cart"           element={<ShopLayout><CartPage /></ShopLayout>} />
        <Route path="/wishlist"       element={<ShopLayout><WishlistPage /></ShopLayout>} />
        <Route path="/size-guide"     element={<ShopLayout><SizeGuidePage /></ShopLayout>} />

        {/* Protected */}
        <Route path="/checkout"       element={<ProtectedRoute><ShopLayout><CheckoutPage /></ShopLayout></ProtectedRoute>} />
        <Route path="/order-confirmation/:id" element={<ProtectedRoute><ShopLayout><OrderConfirmationPage /></ShopLayout></ProtectedRoute>} />
        <Route path="/profile"        element={<ProtectedRoute><ShopLayout><ProfilePage /></ShopLayout></ProtectedRoute>} />
        <Route path="/my-orders"      element={<ProtectedRoute><ShopLayout><MyOrdersPage /></ShopLayout></ProtectedRoute>} />

        {/* Auth */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index               element={<AdminDashboard />} />
          <Route path="products"     element={<AdminProducts />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          <Route path="products/edit/:id" element={<AdminAddProduct />} />
          <Route path="categories"   element={<AdminCategories />} />
          <Route path="orders"       element={<AdminOrders />} />
          <Route path="orders/:id"   element={<AdminOrderDetail />} />
          <Route path="users"        element={<AdminUsers />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<ShopLayout><NotFoundPage /></ShopLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
