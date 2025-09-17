export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  photoUrl?: string;
  role: "admin" | "user" | "vest";
  password?: string;
  token?: string;
}