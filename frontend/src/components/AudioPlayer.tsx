import React from "react";
import { useAudio } from "../context/AudioContext";
import { useAuth } from "../context/AuthContext";

const AudioPlayer: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const {
    currentSong,
    isPlaying,
    pauseSong,
    resumeSong,
    nextSong,
    prevSong,
    repeat,
    setRepeat,
    shuffle,
    setShuffle,
    volume,
    setVolume,
    currentTime,
    duration,
    seek,
    getSongFullImageUrl,
  } = useAudio();

  if (!isLoggedIn) return null;

  const prevVolumeRef = React.useRef<number>(volume || 0.5);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (val > 0) {
      prevVolumeRef.current = val;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  const handleMuteToggle = () => {
    if (!currentSong) return;
    if (volume > 0) {
      prevVolumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(prevVolumeRef.current || 0.5);
    }
  };

  return (
    <div className="spotify-player">
      {/* Left side: Now Playing Section */}
      <div className="d-flex align-items-center gap-3 player-now-playing">
        {currentSong ? (
          <div className="d-flex align-items-center gap-3 w-100">
            {/* Album Art with pulse on play */}
            <div className="position-relative" style={{ width: "56px", height: "56px", minWidth: "56px" }}>
              <img
                src={getSongFullImageUrl(currentSong)}
                alt={currentSong.songName}
                className={`rounded shadow ${isPlaying ? "playing-album-art" : ""}`}
                draggable="false"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=300&auto=format&fit=crop";
                }}
              />
            </div>
            
            <div className="text-truncate" style={{ flexGrow: 1 }}>
              {/* Playback Status & Equalizer Wave */}
              <div className="d-flex align-items-center gap-2 mb-1">
                <span 
                  className={`badge ${isPlaying ? "bg-success text-black" : "bg-secondary text-white"}`} 
                  style={{ fontSize: "0.65rem", padding: "3px 6px", fontWeight: 700 }}
                >
                  {isPlaying ? "NOW PLAYING" : "PAUSED"}
                </span>
                {isPlaying && (
                  <div className="playing-equalizer ms-1">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>
                )}
              </div>

              {/* Song Title */}
              <div className="text-white fw-bold text-truncate" style={{ fontSize: "0.9rem" }} title={currentSong.songName}>
                {currentSong.songName}
              </div>
              
              {/* Artist & Album */}
              <div className="text-light-gray text-truncate" style={{ fontSize: "0.75rem" }}>
                <span className="fw-semibold text-white">{currentSong.artist}</span>
                {currentSong.albumName && (
                  <span className="text-muted"> • Album: {currentSong.albumName}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-light-gray d-flex align-items-center gap-2" style={{ fontSize: "0.85rem" }}>
            <span style={{ fontSize: "1.2rem" }}>🎵</span>
            <span>No song selected</span>
          </div>
        )}
      </div>

      {/* Center: Playback Controls */}
      <div className="d-flex flex-column align-items-center player-controls">
        {/* Buttons */}
        <div className="d-flex align-items-center gap-4 mb-2">
          <button
            onClick={() => setShuffle(!shuffle)}
            className="btn btn-link p-0 border-0 text-light-gray hover-white btn-shuffle"
            style={{
              color: shuffle ? "var(--spotify-green) !important" : "var(--text-light-gray)",
            }}
            disabled={!currentSong}
          >
            <i className={`bi bi-shuffle ${shuffle ? "text-success" : ""}`} style={{ fontSize: "1.2rem" }}></i>
          </button>

          <button
            onClick={prevSong}
            className="btn btn-link p-0 border-0 text-light-gray hover-white btn-prev"
            disabled={!currentSong}
          >
            <i className="bi bi-skip-backward-fill" style={{ fontSize: "1.4rem" }}></i>
          </button>

          <button
            onClick={togglePlay}
            className="btn btn-link p-0 border-0 text-white hover-scale btn-play-pause"
            style={{ fontSize: "2.2rem" }}
            disabled={!currentSong}
          >
            {isPlaying ? (
              <i className="bi bi-pause-circle-fill text-success"></i>
            ) : (
              <i className="bi bi-play-circle-fill"></i>
            )}
          </button>

          <button
            onClick={nextSong}
            className="btn btn-link p-0 border-0 text-light-gray hover-white btn-next"
            disabled={!currentSong}
          >
            <i className="bi bi-skip-forward-fill" style={{ fontSize: "1.4rem" }}></i>
          </button>

          <button
            onClick={() => setRepeat(!repeat)}
            className="btn btn-link p-0 border-0 text-light-gray hover-white btn-repeat"
            style={{
              color: repeat ? "var(--spotify-green) !important" : "var(--text-light-gray)",
            }}
            disabled={!currentSong}
          >
            <i className={`bi bi-repeat ${repeat ? "text-success" : ""}`} style={{ fontSize: "1.2rem" }}></i>
          </button>
        </div>

        {/* Seek timeline */}
        <div className="d-flex align-items-center gap-2 w-100">
          <span className="text-light-gray" style={{ fontSize: "0.75rem", minWidth: "30px", textAlign: "right" }}>
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeekChange}
            className="spotify-slider"
            disabled={!currentSong}
            style={{
              background: `linear-gradient(to right, var(--spotify-green) 0%, var(--spotify-green) ${
                duration > 0 ? (currentTime / duration) * 100 : 0
              }%, #5e5e5e ${duration > 0 ? (currentTime / duration) * 100 : 0}%, #5e5e5e 100%)`
            }}
          />
          <span className="text-light-gray" style={{ fontSize: "0.75rem", minWidth: "30px" }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right side: Volume controls */}
      <div className="d-flex align-items-center justify-content-end gap-3 player-volume">
        <button
          onClick={handleMuteToggle}
          className="btn btn-link p-0 border-0 text-light-gray hover-white"
          style={{ textDecoration: "none" }}
          disabled={!currentSong}
          title={volume === 0 ? "Unmute" : "Mute"}
        >
          <i
            className={`bi ${volume === 0 ? "bi-volume-mute-fill text-danger" : volume < 0.5 ? "bi-volume-down-fill" : "bi-volume-up-fill"} text-light-gray`}
            style={{ fontSize: "1.2rem" }}
          ></i>
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="spotify-slider"
          style={{
            width: "100px",
            background: `linear-gradient(to right, var(--spotify-green) 0%, var(--spotify-green) ${
              volume * 100
            }%, #5e5e5e ${volume * 100}%, #5e5e5e 100%)`
          }}
          disabled={!currentSong}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
