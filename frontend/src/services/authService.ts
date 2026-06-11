import API from "./api";

import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/User";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await API.post("/auth/login", data);

  return response.data;
};

export const registerUser = async (
  data: RegisterRequest,
): Promise<{ message: string }> => {
  const response = await API.post("/auth/register", data);

  return response.data;
};
