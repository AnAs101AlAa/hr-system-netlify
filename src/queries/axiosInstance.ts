import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:5000/",
  timeout: 10000, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
