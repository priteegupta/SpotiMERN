import React from "react";
import type { Song } from "../types/Song";
import type { Playlist } from "../types/Playlist";
import { useAudio } from "../context/AudioContext";

interface SongCardProps {
  song: Song;
  playlists?: Playlist[];
  onAddToPlaylist?: (playlistId: string, songId: string) => void;
  currentQueue?: Song[];
}

const SongCard: React.FC<SongCardProps> = ({ song, playlists = [], onAddToPlaylist, currentQueue }) => {
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong, getSongFullImageUrl } = useAudio();

  const isCurrent = currentSong && currentSong._id === song._id;

  const handlePlayClick = () => {
    if (isCurrent) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song, currentQueue);
    }
  };


  return (
    <div 
      className={`spotify-card d-flex flex-column justify-content-between h-100 text-start ${isCurrent ? "active-song-card" : ""}`}
      onDoubleClick={(e) => {
        e.preventDefault();
        handlePlayClick();
      }}
      style={{ userSelect: "none" }}
    >
      <div>
        {/* Cover Art Image */}
        <div className="song-card-img-wrapper mb-3 position-relative">
          <img
            src={getSongFullImageUrl(song)}
            alt={song.songName}
            className="song-card-img"
            draggable="false"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=300&auto=format&fit=crop";
            }}
          />
          {/* Green Play Button Overlay */}
          <button
            onClick={handlePlayClick}
            className="play-hover-btn"
            title={isCurrent && isPlaying ? "Pause" : "Play"}
          >
            {isCurrent && isPlaying ? <i className="bi bi-pause-fill"></i> : <i className="bi bi-play-fill"></i>}
          </button>
        </div>

        {/* Song Details */}
        <h5 className="text-truncate text-white mb-1" title={song.songName}>
          {song.songName}
        </h5>
        <p className="text-light-gray text-truncate mb-1" style={{ fontSize: "0.85rem" }}>
          {song.artist}
        </p>
        <p className="text-muted text-truncate mb-1" style={{ fontSize: "0.8rem" }}>
          Album: {song.albumName}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
          <span className="badge bg-secondary" style={{ fontSize: "0.7rem" }}>
            {song.genre}
          </span>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            <i className="bi bi-clock me-1"></i>
            {song.duration}
          </span>
        </div>
      </div>

      <div>


        {/* Add To Playlist Section */}
        {playlists.length > 0 && onAddToPlaylist && (
          <div className="dropdown mt-2 w-100">
            <button
              className="btn btn-outline-secondary btn-sm w-100 dropdown-toggle text-light-gray"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ fontSize: "0.75rem", borderColor: "var(--border-gray)" }}
            >
              <i className="bi bi-plus-circle me-1"></i> Add to Playlist
            </button>
            <ul className="dropdown-menu dropdown-menu-dark w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
              {playlists.map((pl) => (
                <li key={pl._id}>
                  <button
                    className="dropdown-item py-2"
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => onAddToPlaylist(pl._id, song._id)}
                  >
                    {pl.playlistName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;
