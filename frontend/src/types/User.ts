export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: "user" | "admin";
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface ProfileUpdateRequest {
  name: string;
  email: string;
  phone: string;
}
