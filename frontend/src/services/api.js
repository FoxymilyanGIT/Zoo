import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL,
  // Можно добавить сразу в настройки create
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Или можно добавить через интерцептор для надежности
  // config.headers['ngrok-skip-browser-warning'] = 'true';

  return config;
});

export const useApi = () => api;