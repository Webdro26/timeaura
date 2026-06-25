import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  // Admin routes use adminToken, user routes use token
  const isAdminRoute = config.url?.startsWith('/admin') || 
    config.url?.startsWith('/upload') ||
    (config.method !== 'get' && 
      ['/products', '/brands', '/categories', '/coupons', '/contact', '/banners'].some(r => config.url?.startsWith(r)));
  
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');
  
  const token = (isAdminRoute && adminToken) ? adminToken : (userToken || adminToken);
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) config.headers['x-session-id'] = sessionId;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const url = err.config?.url || '';
      if (url.includes('/admin')) {
        localStorage.removeItem('adminToken');
      } else {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(err);
  }
);

export default api;
