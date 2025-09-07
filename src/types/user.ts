export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  photoUrl?: string;
  role: "admin" | "user";
  password?: string;
  token?: string;
}