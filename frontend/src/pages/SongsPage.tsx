import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import Loader from "../components/Loader";
import SongCard from "../components/SongCard";
import { getSongs } from "../services/songService";
import { getPlaylists, addSongToPlaylist } from "../services/playlistService";
import type { Song } from "../types/Song";
import type { Playlist } from "../types/Playlist";

const SongsPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [genres, setGenres] = useState<string[]>([]);
  
  // Alert/notification feedback states
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [songsData, playlistsData] = await Promise.all([
          getSongs(),
          getPlaylists()
        ]);
        
        setSongs(songsData);
        setPlaylists(playlistsData);

        // Dynamically get unique genres from songs list
        const uniqueGenres = ["All", ...Array.from(new Set(songsData.map(s => s.genre || "Bollywood")))];
        setGenres(uniqueGenres);
      } catch (err) {
        console.error("Error loading songs page details:", err);
        showFeedback("danger", "Failed to retrieve song catalogue.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const showFeedback = (type: "success" | "danger", message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  const handleAddToPlaylist = async (playlistId: string, songId: string) => {
    try {
      const playlist = playlists.find(p => p._id === playlistId);
      const playlistName = playlist ? playlist.playlistName : "playlist";

      await addSongToPlaylist(playlistId, songId);
      showFeedback("success", `Song added successfully to "${playlistName}"!`);
      
      // Refresh playlists to sync song count/contents
      const updatedPlaylists = await getPlaylists();
      setPlaylists(updatedPlaylists);
    } catch (err: any) {
      console.error("Failed to add song to playlist:", err);
      showFeedback(
        "danger",
        err.response?.data?.message || "Song could not be added (it might already exist in the playlist)."
      );
    }
  };

  // Filter and search computation
  const filteredSongs = songs.filter((song) => {
    const matchesGenre = selectedGenre === "All" || song.genre === selectedGenre;
    
    const term = searchQuery.toLowerCase();
    const matchesQuery = 
      song.songName.toLowerCase().includes(term) ||
      song.artist.toLowerCase().includes(term) ||
      song.albumName.toLowerCase().includes(term) ||
      song.genre.toLowerCase().includes(term);

    return matchesGenre && matchesQuery;
  });

  return (
    <AppLayout onSearchChange={setSearchQuery} searchVal={searchQuery}>
      <div className="container-fluid px-0">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
          <div>
            <h1 className="h2 text-white mb-1">Music Catalogue</h1>
            <p className="text-light-gray">Discover and play tracks from our library.</p>
          </div>
          
          {/* Genre Filter dropdown */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-light-gray" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Genre:</span>
            <select
              className="form-select bg-dark border-secondary text-white"
              style={{ width: "160px", fontSize: "0.85rem" }}
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Alert Notification Banner */}
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
            {filteredSongs.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
                <span className="mb-3" style={{ fontSize: "3rem" }}>📭</span>
                <h4 className="text-white">No Tracks Found</h4>
                <p className="text-light-gray">Try adjusting your filters or search criteria.</p>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {filteredSongs.map((song) => (
                  <div key={song._id} className="col">
                    <SongCard
                      song={song}
                      playlists={playlists}
                      onAddToPlaylist={handleAddToPlaylist}
                      currentQueue={filteredSongs}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default SongsPage;
