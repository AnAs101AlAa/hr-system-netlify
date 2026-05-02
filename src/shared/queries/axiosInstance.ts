import axios from "axios";

export const systemApi = axios.create({
  baseURL: "https://test-prod.runasp.net/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const anonymousApi = axios.create({
  baseURL: "https://test-prod.runasp.net/api",
  timeout: 10000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to handle FormData for both APIs
[systemApi, anonymousApi].forEach((api) => {
  api.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      // Remove Content-Type header so browser sets it with proper boundary
      delete config.headers["Content-Type"];
    }
    return config;
  });
});