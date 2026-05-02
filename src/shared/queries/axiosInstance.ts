import axios from "axios";

export const systemApi = axios.create({
  baseURL: "https://test-prod.runasp.net/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to handle FormData
systemApi.interceptors.request.use((config) => {
  // If data is FormData, remove the Content-Type header to let the browser set it with the boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});
