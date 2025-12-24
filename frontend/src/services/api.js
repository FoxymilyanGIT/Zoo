import axios from "axios";

// 1. Получаем чистый хост (без /api на конце в .env)
const rawBaseURL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

// 2. Гарантируем, что в конце всегда будет /api
// Убираем лишние слеши в конце хоста, если они есть, и добавляем /api
const baseURL = `${rawBaseURL.replace(/\/+$/, "")}/api`;

export const api = axios.create({
  baseURL,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useApi = () => api;