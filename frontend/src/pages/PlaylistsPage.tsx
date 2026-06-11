import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import Loader from "../components/Loader";
import PlaylistCard from "../components/PlaylistCard";
import { getPlaylists, createPlaylist, updatePlaylist, deletePlaylist } from "../services/playlistService";
import type { Playlist } from "../types/Playlist";

const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  // Modal control states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const data = await getPlaylists();
      setPlaylists(data);
    } catch (err) {
      console.error("Error loading playlists:", err);
      showFeedback("danger", "Failed to retrieve playlists.");
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
    setSelectedPlaylistId(null);
    setPlaylistName("");
    setDescription("");
    setModalError(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (pl: Playlist) => {
    setModalMode("edit");
    setSelectedPlaylistId(pl._id);
    setPlaylistName(pl.playlistName);
    setDescription(pl.description || "");
    setModalError(null);
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!playlistName.trim()) {
      setModalError("Playlist Name is required.");
      return;
    }

    try {
      if (modalMode === "create") {
        await createPlaylist(playlistName, description);
        showFeedback("success", "Playlist created successfully!");
      } else if (modalMode === "edit" && selectedPlaylistId) {
        await updatePlaylist(selectedPlaylistId, { playlistName, description });
        showFeedback("success", "Playlist updated successfully!");
      }
      setShowModal(false);
      loadPlaylists();
    } catch (err: any) {
      console.error(err);
      setModalError(err.response?.data?.message || "Failed to save playlist.");
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this playlist? This action cannot be undone.")) {
      return;
    }

    try {
      await deletePlaylist(id);
      showFeedback("success", "Playlist deleted successfully.");
      loadPlaylists();
    } catch (err) {
      console.error(err);
      showFeedback("danger", "Failed to delete playlist.");
    }
  };

  return (
    <AppLayout>
      <div className="container-fluid px-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 text-white mb-1">Your Playlists</h1>
            <p className="text-light-gray">Curate your music collection and moods.</p>
          </div>

          <button onClick={handleOpenCreateModal} className="btn btn-spotify btn-sm py-2 px-4">
            <i className="bi bi-plus-lg me-1"></i> CREATE PLAYLIST
          </button>
        </div>

        {/* Global Feedback Banner */}
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
          <>
            {playlists.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
                <span className="mb-3" style={{ fontSize: "3.5rem" }}>🎵</span>
                <h4 className="text-white">No Playlists Yet</h4>
                <p className="text-light-gray">Create a playlist and add songs from the Songs Catalogue.</p>
                <button onClick={handleOpenCreateModal} className="btn btn-spotify mt-3">
                  Create First Playlist
                </button>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {playlists.map((pl) => (
                  <div key={pl._id} className="col">
                    <div className="h-100 position-relative">
                      <PlaylistCard playlist={pl} onDelete={handleDeletePlaylist} />
                      {/* Floating Edit button inside card layout */}
                      <button
                        onClick={() => handleOpenEditModal(pl)}
                        className="btn btn-sm btn-outline-secondary border-0 text-light-gray position-absolute"
                        style={{ top: "16px", right: "48px" }}
                        title="Edit Details"
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* React-state managed Bootstrap Modal */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content modal-content-dark">
                <div className="modal-header modal-header-dark justify-content-between">
                  <h5 className="modal-title text-white">
                    {modalMode === "create" ? "Create New Playlist" : "Edit Playlist Details"}
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

                    <div className="mb-3">
                      <label className="form-label text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        Playlist Name
                      </label>
                      <input
                        type="text"
                        className="form-control spotify-input"
                        placeholder="My Awesome Beats"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        Description
                      </label>
                      <textarea
                        className="form-control spotify-input"
                        rows={3}
                        placeholder="Write a brief description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer modal-footer-dark">
                    <button type="button" className="btn btn-spotify-outline btn-sm" onClick={() => setShowModal(false)}>
                      CANCEL
                    </button>
                    <button type="submit" className="btn btn-spotify btn-sm">
                      {modalMode === "create" ? "CREATE" : "SAVE CHANGES"}
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

export default PlaylistsPage;
