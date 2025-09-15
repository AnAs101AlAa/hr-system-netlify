import axios from "axios";

export const systemApi = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 10000, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const formsApi = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 10000, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
