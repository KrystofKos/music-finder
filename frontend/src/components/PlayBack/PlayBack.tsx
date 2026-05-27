import { useEffect, useMemo, useRef, useState } from "react";
import "./PlayBack.css";
import {
  IoPlaySkipBackOutline,
  IoPlaySkipForwardOutline,
  IoVolumeMediumOutline,
} from "react-icons/io5";
import {
  BsPauseCircleFill,
  BsPlayCircleFill,
  BsShuffle,
  BsRepeat,
  BsHeart,
  BsHeartFill,
  BsShare,
} from "react-icons/bs";
import { usePlayback } from "../../playback/PlaybackContext";
import { useLanguage } from "../../i18n/LanguageContext";

export default function PlayBack() {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    isShuffle,
    isRepeat,
    toggleShuffle,
    toggleRepeat,
    next,
    prev,
    isFavorite,
    toggleFavorite,
  } = usePlayback();

  const [trackProgress, setTrackProgress] = useState(0);
  const [volumeProgress, setVolumeProgress] = useState(70);
  const [durationSeconds, setDurationSeconds] = useState(0);

  const isLiked = currentTrack ? isFavorite(currentTrack.id) : false;

  const formattedCurrentTime = useMemo(() => {
    const currentSeconds = Math.floor((trackProgress * durationSeconds) / 100);
    const currentMinutes = Math.floor(currentSeconds / 60);
    const currentRemainingSeconds = currentSeconds % 60;
    return `${currentMinutes}:${String(currentRemainingSeconds).padStart(2, "0")}`;
  }, [durationSeconds, trackProgress]);

  const formattedRemainingTime = useMemo(() => {
    const currentSeconds = Math.floor((trackProgress * durationSeconds) / 100);
    const remainingSeconds = Math.max(0, durationSeconds - currentSeconds);
    const remainingMinutes = Math.floor(remainingSeconds / 60);
    const remainingRemainingSeconds = remainingSeconds % 60;
    return `${remainingMinutes}:${String(remainingRemainingSeconds).padStart(2, "0")}`;
  }, [durationSeconds, trackProgress]);

  const togglePlayPause = () => {
    if (!currentTrack?.preview) return;
    setIsPlaying(!isPlaying);
  };

  const handleShare = () => {
    alert(t("playback.shareCopied"));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, volumeProgress / 100));
  }, [volumeProgress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack?.preview) {
      audio.removeAttribute("src");
      audio.load();
      setDurationSeconds(0);
      setTrackProgress(0);
      setIsPlaying(false);
      return;
    }

    if (audio.src !== currentTrack.preview) {
      audio.src = currentTrack.preview;
      audio.load();
      setTrackProgress(0);
    }

    if (isPlaying) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentTrack?.preview, isPlaying, setIsPlaying, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      setDurationSeconds(
        Number.isFinite(audio.duration) ? Math.floor(audio.duration) : 0,
      );
    };
    const onTimeUpdate = () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) {
        setTrackProgress(0);
        return;
      }
      setDurationSeconds(Math.floor(audio.duration));
      setTrackProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnded = () => {
      next();
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [next]);

  const onSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0)
      return;
    const nextTime = (value / 100) * audio.duration;
    audio.currentTime = nextTime;
    setTrackProgress(value);
  };

  const onPrevClick = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    prev();
  };

  const onNextClick = () => next();

  const coverSrc =
    currentTrack?.album?.cover ??
    currentTrack?.artist?.picture ??
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop";

  const title = currentTrack?.title ?? t("playback.noTrack");
  const artist = currentTrack?.artist?.name ?? "—";

  return (
    <div className="audio-player">
      <audio ref={audioRef} preload="metadata" />

      <div className="player-track-info">
        <div className="track-cover-wrapper">
          <img src={coverSrc} alt={t("playback.cover")} className="track-cover" />
        </div>
        <div className="track-text">
          <h4 className="track-title">{title}</h4>
          <p className="track-artist">{artist}</p>
        </div>
      </div>

      <div className="player-controls-wrapper">
        <div className="player-buttons">
          <button
            className="btn-icon btn-skip"
            onClick={onPrevClick}
            disabled={!currentTrack?.preview}
          >
            <IoPlaySkipBackOutline />
          </button>

          <button
            className="btn-play-pause"
            onClick={togglePlayPause}
            disabled={!currentTrack?.preview}
          >
            {isPlaying ? <BsPauseCircleFill /> : <BsPlayCircleFill />}
          </button>

          <button
            className="btn-icon btn-skip"
            onClick={onNextClick}
            disabled={!currentTrack?.preview}
          >
            <IoPlaySkipForwardOutline />
          </button>
        </div>

        <div className="player-slider-container">
          <span className="time">{formattedCurrentTime}</span>
          <div className="slider-wrapper">
            <input
              type="range"
              className="player-slider"
              min="0"
              max="100"
              value={trackProgress}
              onChange={(e) => onSeek(Number(e.target.value))}
              disabled={!currentTrack?.preview}
            />
            <div
              className="slider-progress"
              style={{ width: `${trackProgress}%` }}
            ></div>
          </div>
          <span className="time">{formattedRemainingTime}</span>
        </div>
      </div>

      <div className="player-options">
        <button className="btn-icon">
          <IoVolumeMediumOutline />
        </button>

        <div className="volume-slider-wrapper">
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="100"
            value={volumeProgress}
            onChange={(e) => setVolumeProgress(Number(e.target.value))}
          />
          <div
            className="volume-progress"
            style={{ width: `${volumeProgress}%` }}
          ></div>
        </div>

        <button
          className={isShuffle ? "btn-icon-active" : "btn-icon"}
          onClick={toggleShuffle}
        >
          <BsShuffle />
        </button>

        <button
          className={isRepeat ? "btn-icon-active" : "btn-icon"}
          onClick={toggleRepeat}
        >
          <BsRepeat />
        </button>

        <button
          className={isLiked ? "btn-icon-active" : "btn-icon"}
          onClick={() => (currentTrack ? toggleFavorite(currentTrack) : null)}
          disabled={!currentTrack}
        >
          {isLiked ? <BsHeartFill /> : <BsHeart />}
        </button>

        <button className="btn-icon" onClick={handleShare}>
          <BsShare />
        </button>
      </div>
    </div>
  );
}
