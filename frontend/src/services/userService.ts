import API from "./api";
import type { User, ProfileUpdateRequest } from "../types/User";

export const getUserProfile = async (): Promise<User> => {
  const response = await API.get<User>("/user/profile");
  return response.data;
};

export const updateUserProfile = async (
  data: ProfileUpdateRequest
): Promise<{ message: string; user: User }> => {
  const response = await API.put<{ message: string; user: User }>("/user/profile", data);
  return response.data;
};
