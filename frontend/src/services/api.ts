// api.ts — Central axios instance for all API calls
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('af_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('af_token');
      localStorage.removeItem('af_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const handleApiError = (err: unknown): never => {
  const e = err as any;
  throw new Error(e.response?.data?.message || e.message || 'An error occurred');
};
