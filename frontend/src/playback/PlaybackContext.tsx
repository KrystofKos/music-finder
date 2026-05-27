import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Track } from "../api/tracks";
import { getUser, onUserChange } from "../auth/session";

type RecentlyPlayedItem = {
  track: Track;
  playedAt: number;
};

type PlaybackState = {
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  favorites: Track[];
  recentlyPlayed: RecentlyPlayedItem[];
};

type PlaybackContextValue = PlaybackState & {
  currentTrack: Track | null;
  playFromQueue: (queue: Track[], index: number) => void;
  playTrack: (track: Track) => void;
  setIsPlaying: (value: boolean) => void;
  next: () => void;
  prev: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  isFavorite: (trackId: number) => boolean;
  toggleFavorite: (track: Track) => void;
  removeFavorite: (trackId: number) => void;
};

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

const MAX_RECENTS = 10;

function userScopedKey(userId: string, name: "favorites" | "recents") {
  return `music-finder:${userId}:${name}:v1`;
}

function getUserStorageId() {
  return getUser()?._id ?? "anon";
}

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota/security errors
  }
}

export function PlaybackProvider({ children }: PropsWithChildren) {
  const [storageUserId, setStorageUserId] = useState(() => getUserStorageId());
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);
  const [favorites, setFavorites] = useState<Track[]>(() => {
    const userId = getUserStorageId();
    return safeReadJson<Track[]>(userScopedKey(userId, "favorites"), []);
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>(() => {
    const userId = getUserStorageId();
    return safeReadJson<RecentlyPlayedItem[]>(userScopedKey(userId, "recents"), []);
  });

  const currentTrack = queue[currentIndex] ?? null;

  useEffect(() => {
    return onUserChange(() => setStorageUserId(getUserStorageId()));
  }, []);

  useEffect(() => {
    const favoritesKey = userScopedKey(storageUserId, "favorites");
    const recentsKey = userScopedKey(storageUserId, "recents");

    const nextFavorites = safeReadJson<Track[]>(favoritesKey, []);
    const nextRecents = safeReadJson<RecentlyPlayedItem[]>(recentsKey, []);

    if (storageUserId !== "anon") {
      const anonFav = safeReadJson<Track[]>(userScopedKey("anon", "favorites"), []);
      const anonRec = safeReadJson<RecentlyPlayedItem[]>(userScopedKey("anon", "recents"), []);

      const mergedFavorites = [
        ...nextFavorites,
        ...anonFav.filter((t) => !nextFavorites.some((x) => x.id === t.id)),
      ];

      const mergedRecents = [
        ...nextRecents,
        ...anonRec.filter((item) => !nextRecents.some((x) => x.track.id === item.track.id)),
      ]
        .sort((a, b) => b.playedAt - a.playedAt)
        .slice(0, MAX_RECENTS);

      if (mergedFavorites.length !== nextFavorites.length) {
        safeWriteJson(favoritesKey, mergedFavorites);
        safeWriteJson(userScopedKey("anon", "favorites"), []);
        setFavorites(mergedFavorites);
      } else {
        setFavorites(nextFavorites);
      }

      if (mergedRecents.length !== nextRecents.length) {
        safeWriteJson(recentsKey, mergedRecents);
        safeWriteJson(userScopedKey("anon", "recents"), []);
        setRecentlyPlayed(mergedRecents);
      } else {
        setRecentlyPlayed(nextRecents);
      }
    } else {
      setFavorites(nextFavorites);
      setRecentlyPlayed(nextRecents);
    }
  }, [storageUserId]);

  const playFromQueue = useCallback((nextQueue: Track[], index: number) => {
    setQueue(nextQueue);
    setCurrentIndex(Math.max(0, Math.min(index, Math.max(0, nextQueue.length - 1))));
    setIsPlaying(true);
  }, []);

  const playTrack = useCallback((track: Track) => {
    setQueue([track]);
    setCurrentIndex(0);
    setIsPlaying(true);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (queue.length === 0) return 0;
      if (queue.length === 1) return 0;

      if (isShuffle) {
        const max = queue.length - 1;
        let nextIndex = prevIndex;
        for (let attempts = 0; attempts < 5 && nextIndex === prevIndex; attempts++) {
          nextIndex = Math.floor(Math.random() * (max + 1));
        }
        return nextIndex;
      }

      const nextIndex = prevIndex + 1;
      if (nextIndex < queue.length) return nextIndex;
      return isRepeat ? 0 : prevIndex;
    });

    setIsPlaying((wasPlaying) => {
      if (queue.length === 0) return false;
      if (!wasPlaying) return false;
      if (!isRepeat && !isShuffle && currentIndex + 1 >= queue.length) return false;
      return true;
    });
  }, [queue.length, isRepeat, isShuffle, currentIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      if (queue.length === 0) return 0;
      if (queue.length === 1) return 0;
      if (isShuffle) return prevIndex;
      const nextIndex = prevIndex - 1;
      if (nextIndex >= 0) return nextIndex;
      return isRepeat ? queue.length - 1 : prevIndex;
    });
    setIsPlaying((wasPlaying) => (queue.length ? wasPlaying : false));
  }, [queue.length, isRepeat, isShuffle]);

  const toggleShuffle = useCallback(() => setIsShuffle((v) => !v), []);
  const toggleRepeat = useCallback(() => setIsRepeat((v) => !v), []);

  const isFavorite = useCallback(
    (trackId: number) => favorites.some((t) => t.id === trackId),
    [favorites],
  );

  const removeFavorite = useCallback((trackId: number) => {
    setFavorites((prev) => prev.filter((t) => t.id !== trackId));
  }, []);

  const toggleFavorite = useCallback((track: Track) => {
    setFavorites((prev) => {
      const exists = prev.some((t) => t.id === track.id);
      if (exists) return prev.filter((t) => t.id !== track.id);
      return [track, ...prev];
    });
  }, []);

  const pushRecent = useCallback((track: Track) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((item) => item.track.id !== track.id);
      const next = [{ track, playedAt: Date.now() }, ...filtered].slice(0, MAX_RECENTS);
      return next;
    });
  }, []);

  useEffect(() => {
    safeWriteJson(userScopedKey(storageUserId, "favorites"), favorites);
  }, [favorites, storageUserId]);

  useEffect(() => {
    safeWriteJson(userScopedKey(storageUserId, "recents"), recentlyPlayed);
  }, [recentlyPlayed, storageUserId]);

  useEffect(() => {
    if (!isPlaying) return;
    if (!currentTrack?.preview) return;
    pushRecent(currentTrack);
  }, [currentTrack, isPlaying, pushRecent]);

  const value = useMemo<PlaybackContextValue>(
    () => ({
      queue,
      currentIndex,
      isPlaying,
      isShuffle,
      isRepeat,
      favorites,
      recentlyPlayed,
      currentTrack,
      playFromQueue,
      playTrack,
      setIsPlaying,
      next,
      prev,
      toggleShuffle,
      toggleRepeat,
      isFavorite,
      toggleFavorite,
      removeFavorite,
    }),
    [
      queue,
      currentIndex,
      isPlaying,
      isShuffle,
      isRepeat,
      favorites,
      recentlyPlayed,
      currentTrack,
      playFromQueue,
      playTrack,
      next,
      prev,
      toggleShuffle,
      toggleRepeat,
      isFavorite,
      toggleFavorite,
      removeFavorite,
    ],
  );

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
}

export function usePlayback() {
  const ctx = useContext(PlaybackContext);
  if (!ctx) {
    throw new Error("usePlayback must be used within PlaybackProvider");
  }
  return ctx;
}
