import React, { useState } from 'react';
// Import doplňkových ikon a tvé požadované vnitřní obrysové šipky
import { 
  IoPlaySkipBackOutline, 
  IoPlaySkipForwardOutline, 
  IoVolumeMediumOutline 
} from "react-icons/io5";
// Import krajních šipek a stavů přehrávání
import { 
  BsFastForwardFill, 
  BsRewindFill, 
  BsPauseCircleFill, 
  BsPlayCircleFill, 
  BsShuffle, 
  BsRepeat, 
  BsHeart, 
  BsShare 
} from "react-icons/bs";

export default function PlayBack() {
  const [trackProgress, setTrackProgress] = useState(65);
  const [volumeProgress, setVolumeProgress] = useState(40);
  
  // Stav pro hlídání přehrávání (přepínání tlačítek)
  const [isPlaying, setIsPlaying] = useState(false);

  const totalSeconds = 210;
  const currentSeconds = Math.floor((trackProgress * totalSeconds) / 100);
  const currentMinutes = Math.floor(currentSeconds / 60);
  const currentRemainingSeconds = currentSeconds % 60;
  const formattedCurrentTime = `${currentMinutes}:${String(currentRemainingSeconds).padStart(2, '0')}`;
  
  const remainingSeconds = totalSeconds - currentSeconds;
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingRemainingSeconds = remainingSeconds % 60;
  const formattedRemainingTime = `${remainingMinutes}:${String(remainingRemainingSeconds).padStart(2, '0')}`;   
     
  // Funkce, která mění stav po kliknutí na středové tlačítko
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="audio-player">
      
      {/* LEVÁ ČÁST: Info o písničce */}
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

      {/* PROSTŘEDNÍ ČÁST: Ovládání a plně dynamická časová osa */}
      <div className="player-controls-wrapper">
        <div className="player-buttons">
          {/* Krajní přetáčení zpět (Plné) */}
          <button className="btn-icon"><BsRewindFill /></button>
          
          {/* Vnitřní šipka vlevo u spouštění - PŘESNĚ TA, KTEROU JSI CHTĚL */}
          <button className="btn-icon" onClick={() => console.log("Předchozí skladba")}>
            <IoPlaySkipBackOutline />
          </button>
          
          {/* Středové Play / Pause tlačítko reagující na kliknutí */}
          <button className="btn-play-pause" onClick={togglePlayPause}>
            {isPlaying ? <BsPauseCircleFill /> : <BsPlayCircleFill />}
          </button>
          
          {/* Vnitřní šipka vpravo u spouštění */}
          <button className="btn-icon" onClick={() => console.log("Další skladba")}>
            <IoPlaySkipForwardOutline />
          </button>
          
          {/* Krajní přetáčení vpřed (Plné) */}
          <button className="btn-icon"><BsFastForwardFill /></button>
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
            <div className="slider-progress" style={{ width: `${trackProgress}%` }}></div>
          </div>
          <span className="time">{formattedRemainingTime}</span>
        </div>
      </div>

      {/* PRAVÁ ČÁST: Hlasitost a doplňky */}
      <div className="player-options">
        <button className="btn-icon"><IoVolumeMediumOutline /></button>
        
        <div className="volume-slider-wrapper">
          <input 
            type="range" 
            className="volume-slider" 
            min="0" 
            max="100" 
            value={volumeProgress} 
            onChange={(e) => setVolumeProgress(Number(e.target.value))}
          />
          <div className="volume-progress" style={{ width: `${volumeProgress}%` }}></div>
        </div>
        
        <button className="btn-icon"><BsShuffle /></button>
        <button className="btn-icon-active"><BsRepeat /></button>
        <button className="btn-icon"><BsHeart /></button>
        <button className="btn-icon"><BsShare /></button>
      </div>

    </div>
  );
}