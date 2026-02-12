import type { member } from "@/shared/types/member";
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

  async getHRUsers(nameKey: string, page: number, count: number) {
    const params: Record<string, string | number> = {
      PageNumber: page,
      PageSize: count,
    };

    if (nameKey) {
      params.Name = nameKey;
    }

    const { data } = await systemApi.get(`/v1/User/HR`, { params });
    return data.data.data;
  }

  async getAllUsers() {
    const { data } = await systemApi.get(`/v1/Members`);
    return data.data.map((att: any) => ({
          ...att,
          name: att.fullName,
          id: att.id,
          gradYear: att.graduationYear,
        }));
  }

  async createUser(userData: member) {
    const mappedData = {
      fullName: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      committee: userData.committee,
      position: userData.position,
      nationalId: userData.nationalId,
      engineeringMajor: userData.engineeringMajor,
      educationSystem: userData.educationSystem,
      gradYear: userData.gradYear,
    };

    const { data } = await systemApi.post(`/v1/Members`, mappedData);
    return data;
  }

  async updateUser(userId: string, userData: member) {
    const mappedData = {
      fullName: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      committee: userData.committee,
      position: userData.position,
      nationalId: userData.nationalId,
      engineeringMajor: userData.engineeringMajor,
      educationSystem: userData.educationSystem,
      gradYear: userData.gradYear,
    };

    const { data } = await systemApi.put(`/v1/Members/${userId}`, mappedData);
    return data;
  }

  async deleteUser(userId: string) {
    const { data } = await systemApi.delete(`/v1/Members/${userId}`);
    return data;
  }
}
