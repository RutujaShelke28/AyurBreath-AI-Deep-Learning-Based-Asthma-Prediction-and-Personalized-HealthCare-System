import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // Proxies to Next.js API Routes in App Router
});

API.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('ayur_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        // Ignore
      }
    }
  }
  return config;
});

export default API;
