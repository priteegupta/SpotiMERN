import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import type { Song } from "../types/Song";
import { useAuth } from "./AuthContext";

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playSong: (song: Song, newQueue?: Song[]) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  queue: Song[];
  setQueue: (queue: Song[]) => void;
  repeat: boolean;
  setRepeat: (repeat: boolean) => void;
  shuffle: boolean;
  setShuffle: (shuffle: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
  getSongFullImageUrl: (song: Song) => string;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const getFullAudioUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `http://localhost:5000${url}`;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  const [currentSong, setCurrentSong] = useState<Song | null>(() => {
    try {
      const saved = localStorage.getItem("player_currentSong");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [queue, setQueueState] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem("player_queue");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [repeat, setRepeat] = useState<boolean>(() => {
    return localStorage.getItem("player_repeat") === "true";
  });
  const [shuffle, setShuffle] = useState<boolean>(() => {
    return localStorage.getItem("player_shuffle") === "true";
  });
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem("player_volume");
    return saved ? parseFloat(saved) : 0.5;
  });
  const [currentTime, setCurrentTime] = useState<number>(() => {
    const saved = localStorage.getItem("player_currentTime");
    return saved ? parseFloat(saved) : 0;
  });
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Keep refs of active state to avoid stale closures in event listeners
  const queueRef = useRef<Song[]>(queue);
  const currentSongRef = useRef<Song | null>(currentSong);
  const shuffleRef = useRef<boolean>(shuffle);
  const repeatRef = useRef<boolean>(repeat);
  const userPlayTriggered = useRef<boolean>(false);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  // Synchronize configurations to localStorage when changed
  useEffect(() => {
    if (currentSong) {
      localStorage.setItem("player_currentSong", JSON.stringify(currentSong));
    } else {
      localStorage.removeItem("player_currentSong");
      localStorage.removeItem("player_currentTime");
    }
  }, [currentSong]);

  useEffect(() => {
    localStorage.setItem("player_queue", JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem("player_repeat", repeat.toString());
  }, [repeat]);

  useEffect(() => {
    localStorage.setItem("player_shuffle", shuffle.toString());
  }, [shuffle]);

  useEffect(() => {
    localStorage.setItem("player_volume", volume.toString());
  }, [volume]);

  // Stop audio and clear states on user logout
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      setIsPlaying(false);
      setCurrentSong(null);
      setQueueState([]);
      setCurrentTime(0);
      setDuration(0);
      setRepeat(false);
      setShuffle(false);
      setVolume(0.5);

      // Clean up localStorage keys
      localStorage.removeItem("player_currentSong");
      localStorage.removeItem("player_queue");
      localStorage.removeItem("player_currentTime");
      localStorage.removeItem("player_repeat");
      localStorage.removeItem("player_shuffle");
      localStorage.removeItem("player_volume");
    }
  }, [isLoggedIn, loading]);

  // Utility to parse MM:SS string into numeric seconds
  const parseDurationToSeconds = (durationStr: string): number => {
    if (!durationStr) return 0;
    const parts = durationStr.split(":");
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10);
      const secs = parseInt(parts[1], 10);
      if (!isNaN(mins) && !isNaN(secs)) {
        return mins * 60 + secs;
      }
    }
    return 0;
  };

  // Initialize Audio object exactly once on mount
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    // Restore source and position if there is a restored song
    if (currentSongRef.current) {
      audio.src = getFullAudioUrl(currentSongRef.current.audioUrl);
      audio.load();
      
      const seconds = parseDurationToSeconds(currentSongRef.current.duration);
      setDuration(seconds);
      
      const savedTime = localStorage.getItem("player_currentTime");
      if (savedTime) {
        const parsedTime = parseFloat(savedTime);
        if (!isNaN(parsedTime) && parsedTime > 0) {
          audio.currentTime = parsedTime;
          setCurrentTime(parsedTime);
        }
      }
    }

    const handlePlay = () => {
      if (!userPlayTriggered.current) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const roundedTime = Math.floor(audio.currentTime);
      const savedTime = localStorage.getItem("player_currentTime");
      const parsedSavedTime = savedTime ? Math.floor(parseFloat(savedTime)) : -1;
      if (roundedTime !== parsedSavedTime) {
        localStorage.setItem("player_currentTime", audio.currentTime.toString());
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (repeatRef.current) {
        audio.currentTime = 0;
        userPlayTriggered.current = true;
        audio.play().catch(err => console.log("Audio play error:", err));
      } else {
        handleNextSong();
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []); // Run once on mount to keep Audio instance persistent


  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Keep track of next song logic in a function that uses refs to avoid stale closures
  const handleNextSong = () => {
    const activeQueue = queueRef.current;
    const activeSong = currentSongRef.current;
    const isShuffle = shuffleRef.current;
    const isRepeat = repeatRef.current;

    if (activeQueue.length === 0) return;
    const currentIndex = activeSong ? activeQueue.findIndex(s => s._id === activeSong._id) : -1;

    let nextIndex = -1;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * activeQueue.length);
    } else {
      if (currentIndex !== -1 && currentIndex < activeQueue.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (isRepeat) {
        nextIndex = 0; // Wrap around if repeat is active
      }
    }

    if (nextIndex !== -1 && activeQueue[nextIndex]) {
      playSong(activeQueue[nextIndex]);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const setQueue = (newQueue: Song[]) => {
    setQueueState(newQueue);
  };

  const playSong = (song: Song, newQueue?: Song[]) => {
    if (!audioRef.current) return;

    if (newQueue) {
      setQueueState(newQueue);
    } else if (queue.length === 0 || !queue.some(s => s._id === song._id)) {
      setQueueState([song]);
    }

    setCurrentSong(song);
    
    // Set duration from database metadata immediately as a fallback
    const seconds = parseDurationToSeconds(song.duration);
    setDuration(seconds);
    setCurrentTime(0);
    localStorage.setItem("player_currentTime", "0");

    audioRef.current.src = getFullAudioUrl(song.audioUrl);
    audioRef.current.load();
    userPlayTriggered.current = true;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(err => {
        console.error("Audio playback error:", err);
        if (currentSongRef.current?._id === song._id && audioRef.current?.paused) {
          setIsPlaying(false);
        }
      });
  };

  const pauseSong = () => {
    if (audioRef.current) {
      userPlayTriggered.current = false;
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeSong = () => {
    if (audioRef.current && currentSong) {
      userPlayTriggered.current = true;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Audio resume error:", err);
          if (audioRef.current?.paused) {
            setIsPlaying(false);
          }
        });
    }
  };

  const nextSong = () => {
    handleNextSong();
  };

  const prevSong = () => {
    const activeQueue = queueRef.current;
    const activeSong = currentSongRef.current;

    if (activeQueue.length === 0) return;
    const currentIndex = activeSong ? activeQueue.findIndex(s => s._id === activeSong._id) : -1;

    let prevIndex = -1;
    if (currentIndex !== -1 && currentIndex > 0) {
      prevIndex = currentIndex - 1;
    } else {
      prevIndex = activeQueue.length - 1; // Wrap around to end
    }

    if (prevIndex !== -1 && activeQueue[prevIndex]) {
      playSong(activeQueue[prevIndex]);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const getSongFullImageUrl = (song: Song) => {
    if (!song.imageUrl) return "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=300&auto=format&fit=crop";
    if (song.imageUrl.startsWith("http://") || song.imageUrl.startsWith("https://")) return song.imageUrl;
    return `http://localhost:5000${song.imageUrl}`;
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        pauseSong,
        resumeSong,
        nextSong,
        prevSong,
        queue,
        setQueue,
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
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
