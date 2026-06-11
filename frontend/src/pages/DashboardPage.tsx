import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import Loader from "../components/Loader";
import { getSongs } from "../services/songService";
import { getPlaylists } from "../services/playlistService";
import { getNotifications } from "../services/notificationService";
import type { Song } from "../types/Song";
import type { Playlist } from "../types/Playlist";
import { useAudio } from "../context/AudioContext";
import { Link } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalPlaylists: 0,
    totalNotifications: 0,
  });
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [recentPlaylists, setRecentPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { playSong, isPlaying, currentSong, pauseSong, resumeSong, getSongFullImageUrl } = useAudio();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all APIs in parallel
        const [songs, playlists, notifications] = await Promise.all([
          getSongs(),
          getPlaylists(),
          getNotifications(),
        ]);

        // Compute metrics
        setStats({
          totalSongs: songs.length,
          totalPlaylists: playlists.length,
          totalNotifications: notifications.length,
        });

        // Set recent items (e.g. sorted by createdAt desc if available, or just latest slice)
        // Songs
        const sortedSongs = [...songs].sort((a, b) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        setRecentSongs(sortedSongs.slice(0, 4));

        // Playlists
        const sortedPlaylists = [...playlists].sort((a, b) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        setRecentPlaylists(sortedPlaylists.slice(0, 4));

      } catch (err: any) {
        console.error("Dashboard loading error:", err);
        setError("Failed to load dashboard statistics. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handlePlaySong = (song: Song) => {
    if (currentSong && currentSong._id === song._id) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      // Play this song and set context queue to recent songs
      playSong(song, recentSongs);
    }
  };

  return (
    <AppLayout>
      <div className="container-fluid px-0">
        <div className="mb-4">
          <h1 className="h2 text-white mb-1">Welcome to SpotiMERN</h1>
          <p className="text-light-gray">Here is what is happening in your library today.</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Stat Counters Row */}
            <div className="row g-4 mb-5">
              {/* Songs Stats */}
              <div className="col-md-4">
                <div className="metric-card">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="text-light-gray m-0 fw-bold">TOTAL SONGS</h5>
                    <i className="bi bi-music-note-beamed text-success" style={{ fontSize: "1.5rem" }}></i>
                  </div>
                  <div className="metric-val">{stats.totalSongs}</div>
                  <Link to="/songs" className="text-success text-decoration-none fw-semibold mt-2 d-inline-block" style={{ fontSize: "0.85rem" }}>
                    Explore Music Library <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>

              {/* Playlists Stats */}
              <div className="col-md-4">
                <div className="metric-card">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="text-light-gray m-0 fw-bold">PLAYLISTS</h5>
                    <i className="bi bi-music-note-list text-success" style={{ fontSize: "1.5rem" }}></i>
                  </div>
                  <div className="metric-val">{stats.totalPlaylists}</div>
                  <Link to="/playlists" className="text-success text-decoration-none fw-semibold mt-2 d-inline-block" style={{ fontSize: "0.85rem" }}>
                    Manage Playlists <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>

              {/* Notifications Stats */}
              <div className="col-md-4">
                <div className="metric-card">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="text-light-gray m-0 fw-bold">NOTIFICATIONS</h5>
                    <i className="bi bi-bell-fill text-success" style={{ fontSize: "1.5rem" }}></i>
                  </div>
                  <div className="metric-val">{stats.totalNotifications}</div>
                  <Link to="/notifications" className="text-success text-decoration-none fw-semibold mt-2 d-inline-block" style={{ fontSize: "0.85rem" }}>
                    View System Alerts <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recents Row */}
            <div className="row g-5">
              {/* Recent Songs */}
              <div className="col-lg-6">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h4 text-white m-0">Recent Songs</h3>
                  <Link to="/songs" className="text-success text-decoration-none fw-bold" style={{ fontSize: "0.85rem" }}>
                    See All
                  </Link>
                </div>

                {recentSongs.length === 0 ? (
                  <div className="spotify-card py-4 text-center">
                    <p className="text-muted mb-0">No songs found. Add some from the Admin Panel.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {recentSongs.map((song) => {
                      const isCurrent = currentSong && currentSong._id === song._id;
                      return (
                        <div
                          key={song._id}
                          className="d-flex align-items-center justify-content-between p-2 rounded hover-light-bg"
                          style={{
                            backgroundColor: isCurrent ? "rgba(29, 185, 84, 0.05)" : "var(--spotify-dark-gray)",
                            border: isCurrent ? "1px solid var(--spotify-green)" : "1px solid var(--border-gray)",
                            transition: "all 0.2s",
                            userSelect: "none",
                            cursor: "pointer"
                          }}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            handlePlaySong(song);
                          }}
                        >
                          <div className="d-flex align-items-center gap-3 text-truncate" style={{ maxWidth: "70%" }}>
                            <img
                              src={getSongFullImageUrl(song)}
                              alt={song.songName}
                              className="rounded"
                              draggable="false"
                              style={{ width: "48px", height: "48px", objectFit: "cover" }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=300&auto=format&fit=crop";
                              }}
                            />
                            <div className="text-truncate">
                              <h6 className={`mb-0 text-truncate text-white ${isCurrent ? "text-success fw-bold" : ""}`}>
                                {song.songName}
                              </h6>
                              <span className="text-muted text-truncate" style={{ fontSize: "0.75rem" }}>
                                {song.artist} • {song.albumName}
                              </span>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-3">
                            <span className="text-muted small d-none d-sm-inline">
                              {song.duration}
                            </span>
                            <button
                              onClick={() => handlePlaySong(song)}
                              className="btn btn-spotify rounded-circle p-0 d-flex align-items-center justify-content-center"
                              style={{ width: "36px", height: "36px", minWidth: "36px" }}
                            >
                              {isCurrent && isPlaying ? (
                                <i className="bi bi-pause-fill text-black" style={{ fontSize: "1.1rem" }}></i>
                              ) : (
                                <i className="bi bi-play-fill text-black" style={{ fontSize: "1.1rem" }}></i>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Playlists */}
              <div className="col-lg-6">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h4 text-white m-0">Recent Playlists</h3>
                  <Link to="/playlists" className="text-success text-decoration-none fw-bold" style={{ fontSize: "0.85rem" }}>
                    See All
                  </Link>
                </div>

                {recentPlaylists.length === 0 ? (
                  <div className="spotify-card py-4 text-center">
                    <p className="text-muted mb-0">No playlists created yet.</p>
                    <Link to="/playlists" className="btn btn-spotify btn-sm mt-3">
                      Create First Playlist
                    </Link>
                  </div>
                ) : (
                  <div className="row g-3">
                    {recentPlaylists.map((pl) => {
                      const count = pl.songs ? pl.songs.length : 0;
                      return (
                        <div key={pl._id} className="col-sm-6">
                          <Link to={`/playlists/${pl._id}`} style={{ textDecoration: "none" }}>
                            <div className="spotify-card h-100 p-3 text-start">
                              <h5 className="text-white text-truncate mb-1">{pl.playlistName}</h5>
                              <p className="text-muted text-truncate mb-2" style={{ fontSize: "0.8rem" }}>
                                {pl.description || "No description"}
                              </p>
                              <span className="badge bg-success" style={{ fontSize: "0.7rem" }}>
                                {count} {count === 1 ? "track" : "tracks"}
                              </span>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
