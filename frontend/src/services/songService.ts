import API from "./api";
import type { Song } from "../types/Song";

// Get all songs (optional parameter 'all=true' for admin to see hidden ones)
export const getSongs = async (all = false): Promise<Song[]> => {
  const response = await API.get<Song[]>(`/songs?all=${all}`);
  return response.data;
};

// Search songs by query params
export const searchSongs = async (params: { artist?: string; album?: string; musicDirector?: string }): Promise<Song[]> => {
  const query = new URLSearchParams();
  if (params.artist) query.append("artist", params.artist);
  if (params.album) query.append("album", params.album);
  if (params.musicDirector) query.append("musicDirector", params.musicDirector);

  const response = await API.get<Song[]>(`/songs/search?${query.toString()}`);
  return response.data;
};

// Get single song by ID
export const getSongById = async (id: string): Promise<Song> => {
  const response = await API.get<Song>(`/songs/${id}`);
  return response.data;
};

// Admin: Create a new song
export const createSong = async (songData: Omit<Song, "_id" | "isVisible" | "createdAt" | "updatedAt">): Promise<Song> => {
  const response = await API.post<Song>("/songs", songData);
  return response.data;
};

// Admin: Update a song
export const updateSong = async (id: string, songData: Partial<Song>): Promise<Song> => {
  const response = await API.put<Song>(`/songs/${id}`, songData);
  return response.data;
};

// Admin: Toggle visibility
export const toggleSongVisibility = async (id: string): Promise<{ message: string; isVisible: boolean }> => {
  const response = await API.put<{ message: string; isVisible: boolean }>(`/songs/visibility/${id}`);
  return response.data;
};

// Admin: Delete a song
export const deleteSong = async (id: string): Promise<{ message: string }> => {
  const response = await API.delete<{ message: string }>(`/songs/${id}`);
  return response.data;
};
