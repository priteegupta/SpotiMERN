import API from "./api";
import type { Playlist } from "../types/Playlist";
import type { Song } from "../types/Song";

// Get user playlists
export const getPlaylists = async (): Promise<Playlist[]> => {
  const response = await API.get<Playlist[]>("/playlists");
  return response.data;
};

// Create a new playlist
export const createPlaylist = async (playlistName: string, description?: string): Promise<Playlist> => {
  const response = await API.post<Playlist>("/playlists", { playlistName, description });
  return response.data;
};

// Update playlist name/description
export const updatePlaylist = async (id: string, data: { playlistName?: string; description?: string }): Promise<Playlist> => {
  const response = await API.put<Playlist>(`/playlists/${id}`, data);
  return response.data;
};

// Delete playlist
export const deletePlaylist = async (id: string): Promise<{ message: string }> => {
  const response = await API.delete<{ message: string }>(`/playlists/${id}`);
  return response.data;
};

// Add song to playlist
export const addSongToPlaylist = async (playlistId: string, songId: string): Promise<{ message: string; playlist: Playlist }> => {
  const response = await API.post<{ message: string; playlist: Playlist }>(`/playlists/${playlistId}/songs`, { songId });
  return response.data;
};

// Remove song from playlist
export const removeSongFromPlaylist = async (playlistId: string, songId: string): Promise<{ message: string; playlist: Playlist }> => {
  const response = await API.delete<{ message: string; playlist: Playlist }>(`/playlists/${playlistId}/songs/${songId}`);
  return response.data;
};

// Search song in playlist
export const searchSongInPlaylist = async (playlistId: string, keyword: string): Promise<Song[]> => {
  const response = await API.get<Song[]>(`/playlists/${playlistId}/search?keyword=${encodeURIComponent(keyword)}`);
  return response.data;
};

// Toggle repeat on playlist
export const toggleRepeat = async (playlistId: string): Promise<{ message: string; repeat: boolean }> => {
  const response = await API.put<{ message: string; repeat: boolean }>(`/playlists/${playlistId}/repeat`);
  return response.data;
};

// Toggle shuffle on playlist
export const toggleShuffle = async (playlistId: string): Promise<{ message: string; shuffle: boolean }> => {
  const response = await API.put<{ message: string; shuffle: boolean }>(`/playlists/${playlistId}/shuffle`);
  return response.data;
};
