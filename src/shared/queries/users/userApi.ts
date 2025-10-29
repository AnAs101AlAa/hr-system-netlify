import { systemApi } from "../axiosInstance";
import type { User } from "@/shared/types/user";

const LOGIN_ROUTE = "/v1/Auth/";    // <-- NO /api prefix here
const USER_API_URL = "/users/";     // <-- NO /api prefix here

export class UserApi {
  async login(credentials: Partial<User>) {
    const { data } = await systemApi.post(LOGIN_ROUTE + "login", credentials);
    return data;
  }

  async logout() {
    const { data } = await systemApi.post(LOGIN_ROUTE + "logout");
    return data;
  }

  async session() {
    const { data } = await systemApi.get(USER_API_URL + "session");
    return data;
  }

  async getMemberDetails(userId: string) {
    const { data } = await systemApi.get(`/v1/Members/${userId}`);
    return data.data; // Access the nested data property
  }
}
