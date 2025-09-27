import axios from "axios";

export const systemApi = axios.create({
  baseURL: "https://test-prod.runasp.net/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const formsApi = axios.create({
  baseURL: "https://test-prod.runasp.net/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
