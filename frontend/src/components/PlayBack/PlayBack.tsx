import { useState } from "react";
import "./PlayBack.css";
import {
  IoPlaySkipBackOutline,
  IoPlaySkipForwardOutline,
  IoVolumeMediumOutline,
} from "react-icons/io5";

import {
  BsFastForwardFill,
  BsRewindFill,
  BsPauseCircleFill,
  BsPlayCircleFill,
  BsShuffle,
  BsRepeat,
  BsHeart,
  BsHeartFill,
  BsShare,
} from "react-icons/bs";

export default function PlayBack() {
  const [trackProgress, setTrackProgress] = useState(65);
  const [volumeProgress, setVolumeProgress] = useState(40);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const totalSeconds = 210;
  const currentSeconds = Math.floor((trackProgress * totalSeconds) / 100);
  const currentMinutes = Math.floor(currentSeconds / 60);
  const currentRemainingSeconds = currentSeconds % 60;
  const formattedCurrentTime = `${currentMinutes}:${String(currentRemainingSeconds).padStart(2, "0")}`;

  const remainingSeconds = totalSeconds - currentSeconds;
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingRemainingSeconds = remainingSeconds % 60;
  const formattedRemainingTime = `${remainingMinutes}:${String(remainingRemainingSeconds).padStart(2, "0")}`;

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleShare = () => {
    alert("Odkaz na písničku byl zkopírován do schránky!");
  };

  return (
    <div className="audio-player">
      <div className="player-track-info">
        <div className="track-cover-wrapper">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop"
            alt="Cover"
            className="track-cover"
          />
        </div>
        <div className="track-text">
          <h4 className="track-title">Memories</h4>
          <p className="track-artist">Maroon 5</p>
        </div>
      </div>

      <div className="player-controls-wrapper">
        <div className="player-buttons">
          <button className="btn-icon">
            <BsRewindFill />
          </button>

          <button className="btn-icon">
            <IoPlaySkipBackOutline />
          </button>

          <button className="btn-play-pause" onClick={togglePlayPause}>
            {isPlaying ? <BsPauseCircleFill /> : <BsPlayCircleFill />}
          </button>

          <button className="btn-icon">
            <IoPlaySkipForwardOutline />
          </button>

          <button className="btn-icon">
            <BsFastForwardFill />
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
              onChange={(e) => setTrackProgress(Number(e.target.value))}
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
          onClick={() => setIsShuffle(!isShuffle)}
        >
          <BsShuffle />
        </button>

        <button
          className={isRepeat ? "btn-icon-active" : "btn-icon"}
          onClick={() => setIsRepeat(!isRepeat)}
        >
          <BsRepeat />
        </button>

        <button
          className={isLiked ? "btn-icon-active" : "btn-icon"}
          onClick={() => setIsLiked(!isLiked)}
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
