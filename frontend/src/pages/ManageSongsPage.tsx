import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import Loader from "../components/Loader";
import {
  getSongs,
  createSong,
  updateSong,
  deleteSong,
  toggleSongVisibility,
} from "../services/songService";
import type { Song } from "../types/Song";

const ManageSongsPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  // Form states
  const [songName, setSongName] = useState("");
  const [artist, setArtist] = useState("");
  const [musicDirector, setMusicDirector] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [duration, setDuration] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);
      // Fetch all songs including hidden ones
      const data = await getSongs(true);
      setSongs(data);
    } catch (err) {
      console.error("Error loading catalogue:", err);
      showFeedback("danger", "Failed to load song catalogue.");
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

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedSongId(null);
    setModalError(null);
    setModalSuccess(null);
    // Reset form fields
    setSongName("");
    setArtist("");
    setMusicDirector("");
    setAlbumName("");
    setReleaseDate("");
    setDuration("");
    setImageUrl("");
    setAudioUrl("");
    setGenre("");
    setShowModal(true);
  };

  const handleOpenEditModal = (song: Song) => {
    setModalMode("edit");
    setSelectedSongId(song._id);
    setModalError(null);
    setModalSuccess(null);
    // Fill fields
    setSongName(song.songName);
    setArtist(song.artist);
    setMusicDirector(song.musicDirector || "");
    setAlbumName(song.albumName);
    // Format date to YYYY-MM-DD
    const dateFormatted = song.releaseDate ? new Date(song.releaseDate).toISOString().substring(0, 10) : "";
    setReleaseDate(dateFormatted);
    setDuration(song.duration);
    setImageUrl(song.imageUrl || "");
    setAudioUrl(song.audioUrl || "");
    setGenre(song.genre || "");
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    // Basic Validation
    if (
      !songName.trim() ||
      !artist.trim() ||
      !musicDirector.trim() ||
      !albumName.trim() ||
      !releaseDate ||
      !duration.trim()
    ) {
      setModalError("Please fill in all required fields.");
      return;
    }

    if (!/^\d+:\d{2}$/.test(duration.trim())) {
      setModalError("Duration must be in the format MM:SS (e.g. 4:28).");
      return;
    }

    const songPayload = {
      songName,
      artist,
      musicDirector,
      albumName,
      releaseDate,
      duration,
      imageUrl,
      audioUrl,
      genre: genre.trim() || "Bollywood", // Fallback to default if blank
    };

    try {
      if (modalMode === "create") {
        await createSong(songPayload);
        setModalSuccess(`"${songName}" has been successfully added to catalogue.`);
        // Reset form fields back to blank to add more
        setSongName("");
        setArtist("");
        setMusicDirector("");
        setAlbumName("");
        setReleaseDate("");
        setDuration("");
        setImageUrl("");
        setAudioUrl("");
        setGenre("");
        loadSongs();
      } else if (modalMode === "edit" && selectedSongId) {
        await updateSong(selectedSongId, songPayload);
        showFeedback("success", `"${songName}" has been updated successfully.`);
        setShowModal(false);
        loadSongs();
      }
    } catch (err: any) {
      console.error(err);
      setModalError(err.response?.data?.message || "Failed to save song. Ensure release date is valid.");
    }
  };

  const handleDeleteSong = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the catalogue?`)) {
      return;
    }

    try {
      await deleteSong(id);
      showFeedback("success", `"${name}" has been deleted.`);
      loadSongs();
    } catch (err) {
      console.error(err);
      showFeedback("danger", "Failed to delete song.");
    }
  };

  const handleToggleVisibility = async (id: string, name: string) => {
    try {
      const res = await toggleSongVisibility(id);
      showFeedback(
        "success",
        `"${name}" visibility toggled to: ${res.isVisible ? "VISIBLE" : "HIDDEN"}`
      );
      // Update local state without reloading
      setSongs(prev =>
        prev.map(s => (s._id === id ? { ...s, isVisible: res.isVisible } : s))
      );
    } catch (err) {
      console.error(err);
      showFeedback("danger", "Failed to toggle visibility status.");
    }
  };

  return (
    <AppLayout>
      <div className="container-fluid px-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 text-white mb-1">Manage Catalogue</h1>
            <p className="text-light-gray">Add, edit, or toggle track details across the library.</p>
          </div>

          <button onClick={handleOpenCreateModal} className="btn btn-spotify btn-sm py-2 px-4">
            <i className="bi bi-plus-lg me-1"></i> ADD NEW SONG
          </button>
        </div>

        {/* Action alerts */}
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

        {loading ? (
          <Loader />
        ) : (
          <div className="card border border-secondary p-3" style={{ backgroundColor: "var(--spotify-dark-gray)" }}>
            {songs.length === 0 ? (
              <div className="text-center py-5">
                <span style={{ fontSize: "2.5rem" }}>🎧</span>
                <p className="text-muted mt-2">Catalogue is empty. Click ADD NEW SONG to seed tracks.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle border-0 mb-0" style={{ backgroundColor: "transparent" }}>
                  <thead>
                    <tr className="text-muted border-secondary" style={{ fontSize: "0.8rem" }}>
                      <th scope="col" style={{ width: "25%" }}>TITLE & ARTIST</th>
                      <th scope="col" style={{ width: "20%" }}>ALBUM</th>
                      <th scope="col" style={{ width: "15%" }}>GENRE</th>
                      <th scope="col" style={{ width: "10%" }} className="text-center">DURATION</th>
                      <th scope="col" style={{ width: "10%" }} className="text-center">VISIBILITY</th>
                      <th scope="col" style={{ width: "20%" }} className="text-end">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songs.map((song) => (
                      <tr key={song._id} className="border-secondary" style={{ fontSize: "0.85rem" }}>
                        {/* Title & Artist */}
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={song.imageUrl ? (song.imageUrl.startsWith("http") ? song.imageUrl : `http://localhost:5000${song.imageUrl}`) : "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=300&auto=format&fit=crop"}
                              alt={song.songName}
                              className="rounded"
                              style={{ width: "40px", height: "40px", objectFit: "cover" }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=300&auto=format&fit=crop";
                              }}
                            />
                            <div className="text-truncate" style={{ maxWidth: "200px" }}>
                              <div className="text-white text-truncate fw-semibold">{song.songName}</div>
                              <div className="text-muted text-truncate" style={{ fontSize: "0.75rem" }}>{song.artist}</div>
                            </div>
                          </div>
                        </td>

                        {/* Album */}
                        <td className="text-light-gray text-truncate" style={{ maxWidth: "150px" }}>
                          {song.albumName}
                        </td>

                        {/* Genre */}
                        <td>
                          <span className="badge bg-secondary" style={{ fontSize: "0.7rem" }}>
                            {song.genre}
                          </span>
                        </td>

                        {/* Duration */}
                        <td className="text-center text-muted">{song.duration}</td>

                        {/* Visibility Status Toggle */}
                        <td className="text-center">
                          <button
                            onClick={() => handleToggleVisibility(song._id, song.songName)}
                            className="btn btn-sm border-0 p-0"
                            title={song.isVisible ? "Make Hidden" : "Make Visible"}
                          >
                            {song.isVisible ? (
                              <i className="bi bi-eye-fill text-success" style={{ fontSize: "1.25rem" }}></i>
                            ) : (
                              <i className="bi bi-eye-slash-fill text-muted" style={{ fontSize: "1.25rem" }}></i>
                            )}
                          </button>
                        </td>

                        {/* Edit & Delete Action Buttons */}
                        <td className="text-end">
                          <button
                            onClick={() => handleOpenEditModal(song)}
                            className="btn btn-outline-light btn-sm me-2"
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteSong(song._id, song.songName)}
                            className="btn btn-outline-danger btn-sm"
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Admin Catalogue Modal (React-state managed) */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content modal-content-dark">
                <div className="modal-header modal-header-dark justify-content-between">
                  <h5 className="modal-title text-white">
                    {modalMode === "create" ? "Add Track to Catalogue" : "Edit Track Settings"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <form onSubmit={handleModalSubmit}>
                  <div className="modal-body">
                    {modalError && <div className="alert alert-danger py-2">{modalError}</div>}
                    {modalSuccess && <div className="alert alert-success py-2">{modalSuccess}</div>}

                    <div className="row g-3">
                      {/* Name */}
                      <div className="col-md-6">
                        <label className="form-label text-light-gray" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          Song Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control spotify-input"
                          placeholder="Kesariya"
                          value={songName}
                          onChange={(e) => setSongName(e.target.value)}
                          required
                        />
                      </div>

                      {/* Artist */}
                      <div className="col-md-6">
                        <label className="form-label text-light-gray" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          Artist <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control spotify-input"
                          placeholder="Arijit Singh"
                          value={artist}
                          onChange={(e) => setArtist(e.target.value)}
                          required
                        />
                      </div>

                      {/* Music Director */}
                      <div className="col-md-6">
                        <label className="form-label text-light-gray" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          Music Director <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control spotify-input"
                          placeholder="Pritam"
                          value={musicDirector}
                          onChange={(e) => setMusicDirector(e.target.value)}
                          required
                        />
                      </div>

                      {/* Album Name */}
                      <div className="col-md-6">
                        <label className="form-label text-light-gray" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          Album Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control spotify-input"
                          placeholder="Brahmastra"
                          value={albumName}
                          onChange={(e) => setAlbumName(e.target.value)}
                          required
                        />
                      </div>

                      {/* Release Date */}
                      <div className="col-md-6">
                        <label className="form-label text-light-gray" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          Release Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control spotify-input"
                          value={releaseDate}
                          onChange={(e) => setReleaseDate(e.target.value)}
                          required
                        />
                      </div>

                      {/* Duration */}
                      <div className="col-md-6">
                        <label className="form-label text-light-gray" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          Duration (e.g. MM:SS) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control spotify-input"
                          placeholder="4:28"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          required
                        />
                      </div>

                      {/* Genre */}
                      <div className="col-md-4">
                        <label className="form-label text-light-gray" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          Genre
                        </label>
                        <input
                          type="text"
                          className="form-control spotify-input"
                          placeholder="e.g. Romantic, Pop"
                          value={genre}
                          onChange={(e) => setGenre(e.target.value)}
                        />
                      </div>

                      {/* Image URL */}
                      <div className="col-md-8">
                        <label className="form-label text-light-gray" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          Cover Image URL (e.g. /images/kesariya.jpg)
                        </label>
                        <input
                          type="text"
                          className="form-control spotify-input"
                          placeholder="/images/kesariya.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                      </div>

                      {/* Audio URL */}
                      <div className="col-12">
                        <label className="form-label text-light-gray" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          Audio Stream URL (e.g. /audio/kesariya.mp3)
                        </label>
                        <input
                          type="text"
                          className="form-control spotify-input"
                          placeholder="/audio/kesariya.mp3"
                          value={audioUrl}
                          onChange={(e) => setAudioUrl(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer modal-footer-dark">
                    <button type="button" className="btn btn-spotify-outline btn-sm" onClick={() => setShowModal(false)}>
                      CANCEL
                    </button>
                    <button type="submit" className="btn btn-spotify btn-sm">
                      {modalMode === "create" ? "ADD TO CATALOGUE" : "SAVE DETAILS"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </AppLayout>
  );
};

export default ManageSongsPage;
