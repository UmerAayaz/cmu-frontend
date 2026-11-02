import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const { token, currentProjectId } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (currentProjectId) config.headers['X-Project-Id'] = currentProjectId;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    const message =
      err.response?.data?.message ||
      err.response?.data?.title ||
      err.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);