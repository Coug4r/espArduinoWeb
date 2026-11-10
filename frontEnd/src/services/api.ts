import axios, { type InternalAxiosRequestConfig } from "axios";

export const TOKEN_STORAGE_KEY = "iot_control_token";
export const USER_STORAGE_KEY = "iot_control_user";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://esparduinoweb.vercel.app";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401s and token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto-redirect on login/register failures
      const requestUrl = error.config?.url || "";
      const isAuthEndpoint = requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");

      if (!isAuthEndpoint) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent("iot:unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;

