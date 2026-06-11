import API from "./api";
import type { Notification } from "../types/Notification";

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await API.get<Notification[]>("/notifications");
  return response.data;
};

export const clearNotification = async (id: string): Promise<{ message: string }> => {
  const response = await API.post<{ message: string }>(`/notifications/${id}/clear`);
  return response.data;
};
