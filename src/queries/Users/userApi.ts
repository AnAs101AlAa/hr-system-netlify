import { api } from "../axiosInstance";
import type { User } from "@/types/user";

const USER_API_URL = api.defaults.baseURL + "/users/";

export const login = async (credentials: Partial<User>) => {
  const { data } = await api.post(USER_API_URL + "login", credentials);
  return data;
};

export const logout = async () => {
  const { data } = await api.post(USER_API_URL + "logout");
  return data; 
};

export const session = async () => {
  const { data } = await api.get(USER_API_URL + "session");
  return data; 
};