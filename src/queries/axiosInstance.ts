import axios from "axios";

export const systemApi = axios.create({
  baseURL: "https://test-prod.runasp.net",
  timeout: 10000, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const formsApi = axios.create({
  baseURL: "http://forms-backend.runasp.net/",
  timeout: 10000, 
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});
