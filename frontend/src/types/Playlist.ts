import type { Song } from "./Song";

export interface Playlist {
  _id: string;

  playlistName: string;

  description: string;

  userId: string;

  songs: Song[];

  repeat: boolean;

  shuffle: boolean;

  createdAt?: string;

  updatedAt?: string;
}
