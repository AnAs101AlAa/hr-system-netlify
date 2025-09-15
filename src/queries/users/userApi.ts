import { systemApi } from "../axiosInstance";
import type { User } from "@/types/user";

const USER_API_URL = systemApi.defaults.baseURL + "/users/";

export class UserApi {
  async login(credentials: Partial<User>) {
    const { data } = await systemApi.post(USER_API_URL + "login", credentials);
    return data;
  }

  async logout() {
    const { data } = await systemApi.post(USER_API_URL + "logout");
    return data;
  }

  async session() {
    const { data } = await systemApi.get(USER_API_URL + "session");
    return data;
  }
}
