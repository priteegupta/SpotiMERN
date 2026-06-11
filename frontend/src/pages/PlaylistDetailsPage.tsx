import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import Loader from "../components/Loader";
import {
  getPlaylists,
  removeSongFromPlaylist,
  addSongToPlaylist,
  toggleRepeat,
  toggleShuffle,
} from "../services/playlistService";
import { getSongs } from "../services/songService";
import { useAudio } from "../context/AudioContext";
import type { Playlist } from "../types/Playlist";
import type { Song } from "../types/Song";

const PlaylistDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  // Search and recommendation states
  const [searchSongQuery, setSearchSongQuery] = useState("");
  const [filterPlaylistQuery, setFilterPlaylistQuery] = useState("");

  const { playSong, isPlaying, currentSong, pauseSong, resumeSong, getSongFullImageUrl } = useAudio();

  useEffect(() => {
    loadPlaylistAndSongs();
  }, [id]);

  const loadPlaylistAndSongs = async () => {
    if (!id) return;
    try {
      setLoading(true);
      
      const [allPlaylists, songsData] = await Promise.all([
        getPlaylists(),
        getSongs()
      ]);
      
      const foundPlaylist = allPlaylists.find(p => p._id === id);
      if (!foundPlaylist) {
        showFeedback("danger", "Playlist not found.");
        navigate("/playlists");
        return;
      }

      setPlaylist(foundPlaylist);
      setAllSongs(songsData);
    } catch (err) {
      console.error("Error loading playlist detail:", err);
      showFeedback("danger", "Failed to retrieve playlist details.");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: "success" | "danger", message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const handlePlayPlaylist = () => {
    if (!playlist || !playlist.songs || playlist.songs.length === 0) return;
    
    // Play first song and load playlist's songs as queue
    playSong(playlist.songs[0], playlist.songs);
  };

  const handlePlaySong = (song: Song) => {
    if (!playlist) return;
    
    if (currentSong && currentSong._id === song._id) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      // Play selected song and set playlist songs as queue
      playSong(song, playlist.songs);
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (!playlist) return;
    try {
      await removeSongFromPlaylist(playlist._id, songId);
      showFeedback("success", "Song removed from playlist.");
      loadPlaylistAndSongs();
    } catch (err: any) {
      console.error(err);
      showFeedback("danger", err.response?.data?.message || "Failed to remove song.");
    }
  };

  const handleAddSong = async (songId: string) => {
    if (!playlist) return;
    try {
      await addSongToPlaylist(playlist._id, songId);
      showFeedback("success", "Song added to playlist.");
      setSearchSongQuery(""); // Reset search on addition
      loadPlaylistAndSongs();
    } catch (err: any) {
      console.error(err);
      showFeedback("danger", err.response?.data?.message || "Failed to add song.");
    }
  };

  const handleToggleShuffle = async () => {
    if (!playlist) return;
    try {
      const res = await toggleShuffle(playlist._id);
      setPlaylist(prev => prev ? { ...prev, shuffle: res.shuffle } : null);
      showFeedback("success", `Shuffle mode ${res.shuffle ? "enabled" : "disabled"}.`);
    } catch (err) {
      console.error(err);
      showFeedback("danger", "Failed to toggle shuffle.");
    }
  };

  const handleToggleRepeat = async () => {
    if (!playlist) return;
    try {
      const res = await toggleRepeat(playlist._id);
      setPlaylist(prev => prev ? { ...prev, repeat: res.repeat } : null);
      showFeedback("success", `Repeat mode ${res.repeat ? "enabled" : "disabled"}.`);
    } catch (err) {
      console.error(err);
      showFeedback("danger", "Failed to toggle repeat.");
    }
  };

  // Compute songs available to add (exclude songs already in playlist)
  const playlistSongIds = playlist?.songs ? playlist.songs.map(s => s._id) : [];
  const addableSongs = allSongs.filter(
    song => !playlistSongIds.includes(song._id) && song.isVisible !== false
  );

  // Search recommendation filter
  const filteredAddableSongs = addableSongs.filter(
    song =>
      song.songName.toLowerCase().includes(searchSongQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchSongQuery.toLowerCase()) ||
      song.albumName.toLowerCase().includes(searchSongQuery.toLowerCase())
  );

  // Search tracks inside playlist
  const filteredPlaylistSongs = playlist?.songs ? playlist.songs.filter(
    song =>
      song.songName.toLowerCase().includes(filterPlaylistQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(filterPlaylistQuery.toLowerCase()) ||
      song.albumName.toLowerCase().includes(filterPlaylistQuery.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <AppLayout>
        <Loader />
      </AppLayout>
    );
  }

  if (!playlist) {
    return (
      <AppLayout>
        <div className="text-center py-5">
          <h4 className="text-white">Playlist not found.</h4>
          <Link to="/playlists" className="btn btn-spotify mt-3">Back to Playlists</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container-fluid px-0">
        {/* Alerts */}
        {alert && (
          <div
            className={`alert alert-${alert.type} alert-dismissible fade show fixed-top m-3 mx-auto`}
            style={{ maxWidth: "500px", zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}
            role="alert"
          >
            {alert.type === "success" ? (
              <i className="bi bi-check-circle-fill me-2"></i>
            ) : (
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
            )}
            {alert.message}
            <button type="button" className="btn-close" onClick={() => setAlert(null)} aria-label="Close"></button>
          </div>
        )}

        <div className="mb-4">
          <Link to="/playlists" className="text-success text-decoration-none fw-bold" style={{ fontSize: "0.9rem" }}>
            <i className="bi bi-arrow-left me-1"></i> Back to Playlists
          </Link>
        </div>

        {/* Playlist Header block */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end gap-4 mb-4 pb-3 border-bottom border-secondary">
          <div
            className="d-flex justify-content-center align-items-center rounded bg-gradient"
            style={{
              width: "192px",
              height: "192px",
              background: "linear-gradient(135deg, #1db954, #191414)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              fontSize: "4.5rem",
            }}
          >
            🎵
          </div>

          <div className="text-start">
            <span className="text-uppercase fw-bold text-white" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
              PLAYLIST
            </span>
            <h1 className="text-white my-1 fw-extrabold display-4" style={{ fontFamily: "var(--font-heading)" }}>
              {playlist.playlistName}
            </h1>
            <p className="text-light-gray mb-2" style={{ fontSize: "0.95rem" }}>
              {playlist.description || "No description."}
            </p>
            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
              <span className="text-white fw-semibold">SpotiMERN</span> • {playlist.songs ? playlist.songs.length : 0}{" "}
              {playlist.songs?.length === 1 ? "song" : "songs"}
            </div>
          </div>
        </div>

        {/* Playback Controls & Search within playlist */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div className="d-flex align-items-center gap-3">
            {playlist.songs && playlist.songs.length > 0 && (
              <button
                onClick={handlePlayPlaylist}
                className="btn btn-spotify rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: "56px", height: "56px" }}
                title="Play Playlist"
              >
                <i className="bi bi-play-fill text-black" style={{ fontSize: "2rem", marginLeft: "2px" }}></i>
              </button>
            )}

            {/* Shuffle Toggle */}
            <button
              onClick={handleToggleShuffle}
              className={`btn btn-outline-secondary btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center ${playlist.shuffle ? "border-success text-success" : ""}`}
              style={{ width: "38px", height: "38px", fontSize: "1.1rem" }}
              title="Toggle Shuffle"
            >
              <i className="bi bi-shuffle"></i>
            </button>

            {/* Repeat Toggle */}
            <button
              onClick={handleToggleRepeat}
              className={`btn btn-outline-secondary btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center ${playlist.repeat ? "border-success text-success" : ""}`}
              style={{ width: "38px", height: "38px", fontSize: "1.1rem" }}
              title="Toggle Repeat"
            >
              <i className="bi bi-repeat"></i>
            </button>
          </div>

          {/* Search bar inside playlist */}
          {playlist.songs && playlist.songs.length > 0 && (
            <div style={{ width: "220px" }}>
              <input
                type="text"
                className="form-control spotify-input py-1.5"
                placeholder="Filter playlist tracks..."
                value={filterPlaylistQuery}
                onChange={(e) => setFilterPlaylistQuery(e.target.value)}
                style={{ fontSize: "0.8rem" }}
              />
            </div>
          )}
        </div>

        {/* Songs List Table */}
        <div className="mb-5">
          {playlist.songs && playlist.songs.length === 0 ? (
            <div className="spotify-card py-5 text-center my-4">
              <span style={{ fontSize: "2.5rem" }}>🎧</span>
              <h5 className="text-white mt-2">This playlist is empty</h5>
              <p className="text-muted mb-0">Use the recommended panel below to add tracks.</p>
            </div>
          ) : filteredPlaylistSongs.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No tracks match "{filterPlaylistQuery}" in this playlist.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle border-0" style={{ backgroundColor: "transparent" }}>
                <thead>
                  <tr className="text-muted border-secondary" style={{ fontSize: "0.8rem" }}>
                    <th scope="col" style={{ width: "5%" }} className="text-center">#</th>
                    <th scope="col" style={{ width: "40%" }}>TITLE</th>
                    <th scope="col" style={{ width: "25%" }}>ALBUM</th>
                    <th scope="col" style={{ width: "15%" }} className="text-center"><i className="bi bi-clock"></i></th>
                    <th scope="col" style={{ width: "15%" }} className="text-end">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlaylistSongs.map((song, index) => {
                    const isCurrent = currentSong && currentSong._id === song._id;
                    return (
                      <tr 
                        key={song._id} 
                        className="border-secondary align-middle" 
                        style={{ 
                          fontSize: "0.85rem",
                          backgroundColor: isCurrent ? "rgba(29, 185, 84, 0.05)" : "transparent",
                          userSelect: "none",
                          cursor: "pointer"
                        }}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          handlePlaySong(song);
                        }}
                      >
                        {/* Index */}
                        <td className="text-center text-muted fw-bold">
                          {isCurrent && isPlaying ? (
                            <div className="spinner-grow spinner-grow-sm text-success" role="status"></div>
                          ) : (
                            index + 1
                          )}
                        </td>
                        
                        {/* Title & Artist */}
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={getSongFullImageUrl(song)}
                              alt={song.songName}
                              className="rounded"
                              draggable="false"
                              style={{ width: "40px", height: "40px", objectFit: "cover" }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=300&auto=format&fit=crop";
                              }}
                            />
                            <div className="text-truncate" style={{ maxWidth: "250px" }}>
                              <div className={`text-truncate ${isCurrent ? "text-success fw-bold" : "text-white"}`}>
                                {song.songName}
                              </div>
                              <div className="text-muted text-truncate" style={{ fontSize: "0.75rem" }}>
                                {song.artist}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Album */}
                        <td className="text-light-gray text-truncate" style={{ maxWidth: "150px" }}>
                          {song.albumName}
                        </td>

                        {/* Duration */}
                        <td className="text-center text-muted">
                          {song.duration}
                        </td>

                        {/* Actions */}
                        <td className="text-end">
                          <div className="d-inline-flex gap-2">
                            <button
                              onClick={() => handlePlaySong(song)}
                              className="btn btn-spotify btn-sm p-1 rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "32px", height: "32px" }}
                              title={isCurrent && isPlaying ? "Pause" : "Play"}
                            >
                              {isCurrent && isPlaying ? (
                                <i className="bi bi-pause-fill text-black" style={{ fontSize: "0.9rem" }}></i>
                              ) : (
                                <i className="bi bi-play-fill text-black" style={{ fontSize: "0.9rem" }}></i>
                              )}
                            </button>
                            <button
                              onClick={() => handleRemoveSong(song._id)}
                              className="btn btn-outline-danger btn-sm p-1 rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "32px", height: "32px" }}
                              title="Remove From Playlist"
                            >
                              <i className="bi bi-x" style={{ fontSize: "1.1rem" }}></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Songs Portal drawer */}
        <div className="card border border-secondary p-4 text-start" style={{ backgroundColor: "var(--spotify-dark-gray)" }}>
          <h4 className="text-white mb-2">Let's add some songs to your playlist</h4>
          <p className="text-light-gray mb-4" style={{ fontSize: "0.85rem" }}>
            Search from SpotiMERN's full catalogue to extend this playlist.
          </p>

          {/* Search bar inside recommender */}
          <div className="mb-4" style={{ maxWidth: "400px" }}>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-light-gray">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control spotify-input"
                placeholder="Search songs by artist, name, or album..."
                value={searchSongQuery}
                onChange={(e) => setSearchSongQuery(e.target.value)}
              />
            </div>
          </div>

          {/* List of addable songs */}
          {searchSongQuery.trim() === "" ? (
            <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
              Type in the search box to find songs to add.
            </p>
          ) : filteredAddableSongs.length === 0 ? (
            <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
              No matches found or all matching songs are already in this playlist.
            </p>
          ) : (
            <div className="d-flex flex-column gap-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {filteredAddableSongs.map((song) => (
                <div
                  key={song._id}
                  className="d-flex align-items-center justify-content-between p-2 rounded hover-light-bg"
                  style={{
                    backgroundColor: "var(--spotify-black)",
                    border: "1px solid var(--border-gray)",
                  }}
                >
                  <div className="d-flex align-items-center gap-3 text-truncate" style={{ maxWidth: "80%" }}>
                    <img
                      src={getSongFullImageUrl(song)}
                      alt={song.songName}
                      className="rounded"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=300&auto=format&fit=crop";
                      }}
                    />
                    <div className="text-truncate">
                      <h6 className="mb-0 text-white text-truncate" style={{ fontSize: "0.85rem" }}>
                        {song.songName}
                      </h6>
                      <span className="text-muted text-truncate" style={{ fontSize: "0.75rem" }}>
                        {song.artist} • {song.albumName}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddSong(song._id)}
                    className="btn btn-spotify-outline btn-sm py-1 px-3 text-uppercase font-heading fw-bold"
                    style={{ fontSize: "0.7rem" }}
                  >
                    ADD
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default PlaylistDetailsPage;
