import axios from 'axios';
import { API_URL } from '../constants/theme';
import { getToken } from './auth';

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
