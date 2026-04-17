import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
};

export const animeService = {
  search: (q: string, page = 1) =>
    api.get('/api/anime/search', { params: { q, page } }),
  getById: (id: number) =>
    api.get(`/api/anime/${id}`),
  getTop: () =>
    api.get('/api/anime/top/list'),
};

export const watchlistService = {
  getAll: () => api.get('/api/watchlist'),
  add: (data: any) => api.post('/api/watchlist', data),
  update: (animeId: number, data: any) => api.put(`/api/watchlist/${animeId}`, data),
  remove: (animeId: number) => api.delete(`/api/watchlist/${animeId}`),
};

export default api;
