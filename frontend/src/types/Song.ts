export interface Song {
  _id: string;

  songName: string;

  artist: string;

  musicDirector: string;

  albumName: string;

  releaseDate: string;

  duration: string;

  imageUrl: string;

  audioUrl: string;

  genre: string;

  isVisible: boolean;

  createdAt?: string;

  updatedAt?: string;
}
