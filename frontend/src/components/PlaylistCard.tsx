import React from "react";
import { Link } from "react-router-dom";
import type { Playlist } from "../types/Playlist";

interface PlaylistCardProps {
  playlist: Playlist;
  onDelete: (id: string) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onDelete }) => {
  const songCount = playlist.songs ? playlist.songs.length : 0;

  return (
    <div className="spotify-card d-flex flex-column justify-content-between h-100">
      <div>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h4 className="text-white text-truncate mb-0" style={{ maxWidth: "80%" }}>
            {playlist.playlistName}
          </h4>
          <span className="badge bg-success rounded-pill" style={{ fontSize: "0.75rem" }}>
            {songCount} {songCount === 1 ? "song" : "songs"}
          </span>
        </div>
        <p className="text-light-gray text-truncate-3-lines mb-3" style={{ fontSize: "0.85rem", minHeight: "45px" }}>
          {playlist.description || "No description provided."}
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-secondary">
        <Link to={`/playlists/${playlist._id}`} className="btn btn-spotify btn-sm py-1.5 px-3" style={{ fontSize: "0.8rem" }}>
          <i className="bi bi-play-fill me-1"></i> View Playlist
        </Link>
        <button
          onClick={() => onDelete(playlist._id)}
          className="btn btn-outline-danger btn-sm border-0"
          title="Delete Playlist"
        >
          <i className="bi bi-trash-fill"></i>
        </button>
      </div>
    </div>
  );
};

export default PlaylistCard;
