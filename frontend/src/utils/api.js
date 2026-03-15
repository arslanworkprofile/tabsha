import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((cfg) => {
  try {
    const raw = localStorage.getItem('tabsha-auth');
    if (raw) {
      const { state } = JSON.parse(raw);
      if (state?.token) cfg.headers.Authorization = `Bearer ${state.token}`;
    }
  } catch {}
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tabsha-auth');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const getProducts   = (p) => api.get('/products', { params: p });
export const getProduct    = (id) => api.get(`/products/${id}`);
export const getProductBySlug = (slug) => api.get(`/products/slug/${slug}`);
export const createProduct = (d) => api.post('/products', d);
export const updateProduct = (id, d) => api.put(`/products/${id}`, d);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const addReview     = (id, d) => api.post(`/products/${id}/reviews`, d);

export const getCategories    = () => api.get('/categories');
export const getAllCategories  = () => api.get('/categories/all');
export const createCategory   = (d) => api.post('/categories', d);
export const updateCategory   = (id, d) => api.put(`/categories/${id}`, d);
export const deleteCategory   = (id) => api.delete(`/categories/${id}`);

export const createOrder       = (d) => api.post('/orders', d);
export const getMyOrders       = () => api.get('/orders/my');
export const getOrder          = (id) => api.get(`/orders/${id}`);
export const getAllOrders       = (p) => api.get('/orders', { params: p });
export const updateOrderStatus = (id, d) => api.put(`/orders/${id}/status`, d);
export const deleteOrder       = (id) => api.delete(`/orders/${id}`);
export const getOrderStats     = () => api.get('/orders/admin/stats');

export const getUsers    = (p) => api.get('/users', { params: p });
export const toggleUser  = (id) => api.put(`/users/${id}/toggle`);
export const deleteUser  = (id) => api.delete(`/users/${id}`);

export const uploadImage = (fd) =>
  api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

export default api;
