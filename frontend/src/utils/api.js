import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const ADMIN_TOKEN_KEY = 'admin_token';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin') {
        window.location.href = '/admin';
      }
    }
    const message = err.response?.data?.message || err.message || 'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export const jobsApi = {
  getAll:   (params) => api.get('/jobs', { params }),
  getAdminList: (params) => api.get('/jobs', { params: { ...params, scope: 'admin' } }),
  getById:  (id)     => api.get(`/jobs/${id}`),
  getAdminById: (id) => api.get(`/jobs/${id}`, { params: { scope: 'admin' } }),
  filter:   (params) => api.get('/jobs/filter', { params }),
  create:   (data)   => api.post('/jobs', data),
  update:   (id, data) => api.put(`/jobs/${id}`, data),
  delete:   (id)     => api.delete(`/jobs/${id}`),
};

export const authApi = {
  login:  (data) => api.post('/auth/login', data),
  me:     ()     => api.get('/auth/me'),
  setup:  (data) => api.post('/auth/setup', data),
};

export const adminApi = {
  stats: () => api.get('/admin/stats'),
};

export const subscribersApi = {
  subscribe:   (data)  => api.post('/subscribers', data),
  unsubscribe: (token) => api.get(`/subscribers/unsubscribe?token=${token}`),
};

export default api;
