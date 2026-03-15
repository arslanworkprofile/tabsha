import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { LoginPage, RegisterPage } from './pages/auth/AuthPages';

// Lazy-loaded pages for fast initial load
const HomePage              = lazy(() => import('./pages/shop/HomePage'));
const ShopPage              = lazy(() => import('./pages/shop/ShopPage'));
const ProductDetailPage     = lazy(() => import('./pages/shop/ProductDetailPage'));
const CartPage              = lazy(() => import('./pages/shop/CartPage'));
const CheckoutPage          = lazy(() => import('./pages/shop/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/shop/OrderConfirmationPage'));
const WishlistPage          = lazy(() => import('./pages/shop/WishlistPage'));
const ProfilePage           = lazy(() => import('./pages/shop/ProfilePage'));
const MyOrdersPage          = lazy(() => import('./pages/shop/MyOrdersPage'));
const SizeGuidePage         = lazy(() => import('./pages/shop/SizeGuidePage'));
const NotFoundPage          = lazy(() => import('./pages/NotFoundPage'));
const AdminLayout           = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard        = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts         = lazy(() => import('./pages/admin/AdminProducts'));
const AdminAddProduct       = lazy(() => import('./pages/admin/AdminAddProduct'));
const AdminCategories       = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders           = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderDetail      = lazy(() => import('./pages/admin/AdminOrderDetail'));
const AdminUsers            = lazy(() => import('./pages/admin/AdminUsers'));

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 400, marginBottom: 16, letterSpacing: '-.02em' }}>
          <span style={{ color: '#b8973e' }}>T</span>absha
        </div>
        <span className="spinner" style={{ display: 'block', margin: '0 auto' }} />
      </div>
    </div>
  );
}

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
      <main style={{ minHeight: '70vh' }}>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </main>
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
          style: { fontFamily: 'Inter, sans-serif', fontSize: '13px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,.1)' },
          success: { iconTheme: { primary: '#b8973e', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/"               element={<ShopLayout><HomePage /></ShopLayout>} />
        <Route path="/shop"           element={<ShopLayout><ShopPage /></ShopLayout>} />
        <Route path="/shop/:category" element={<ShopLayout><ShopPage /></ShopLayout>} />
        <Route path="/product/:slug"  element={<ShopLayout><ProductDetailPage /></ShopLayout>} />
        <Route path="/cart"           element={<ShopLayout><CartPage /></ShopLayout>} />
        <Route path="/wishlist"       element={<ShopLayout><WishlistPage /></ShopLayout>} />
        <Route path="/size-guide"     element={<ShopLayout><SizeGuidePage /></ShopLayout>} />
        <Route path="/checkout"       element={<ProtectedRoute><ShopLayout><CheckoutPage /></ShopLayout></ProtectedRoute>} />
        <Route path="/order-confirmation/:id" element={<ProtectedRoute><ShopLayout><OrderConfirmationPage /></ShopLayout></ProtectedRoute>} />
        <Route path="/profile"        element={<ProtectedRoute><ShopLayout><ProfilePage /></ShopLayout></ProtectedRoute>} />
        <Route path="/my-orders"      element={<ProtectedRoute><ShopLayout><MyOrdersPage /></ShopLayout></ProtectedRoute>} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<RegisterPage />} />
        <Route path="/admin" element={<AdminRoute><Suspense fallback={<PageLoader />}><AdminLayout /></Suspense></AdminRoute>}>
          <Route index               element={<AdminDashboard />} />
          <Route path="products"     element={<AdminProducts />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          <Route path="products/edit/:id" element={<AdminAddProduct />} />
          <Route path="categories"   element={<AdminCategories />} />
          <Route path="orders"       element={<AdminOrders />} />
          <Route path="orders/:id"   element={<AdminOrderDetail />} />
          <Route path="users"        element={<AdminUsers />} />
        </Route>
        <Route path="*" element={<ShopLayout><NotFoundPage /></ShopLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
