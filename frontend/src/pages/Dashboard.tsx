import { BsMusicNote } from "react-icons/bs";
import { TfiHeadphone } from "react-icons/tfi";
import { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidLeftArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

import exampleImage from "../pages/dashboard-images/exampleimage.webp";
import pop from "../pages/dashboard-images/pop.jfif";
import metal from "../pages/dashboard-images/metal.webp";
import country from "../pages/dashboard-images/country.jpeg";

import rock from "../pages/dashboard-images/rock.jfif";
import jazz from "../pages/dashboard-images/jazz.jfif";
import hiphop from "../pages/dashboard-images/hiphop.jfif";
import edm from "../pages/dashboard-images/edm.jfif";

import "./Dashboard.css";

const Dashboard = () => {
  const [playingSong, setPlayingSong] = useState(null);

  const navigate = useNavigate();

  const scrollRef = useRef(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  /* PLAYLISTS */
  const playlists = [
    {
      id: 1,
      title: "Cool Ass Playlist",
      image: exampleImage,
    },
    {
      id: 2,
      title: "Metal",
      image: metal,
    },
    {
      id: 3,
      title: "Country",
      image: country,
    },
    {
      id: 4,
      title: "Pop",
      image: pop,
    },
    {
      id: 5,
      title: "Rock",
      image: rock,
    },
    {
      id: 6,
      title: "Jazz",
      image: jazz,
    },
    {
      id: 7,
      title: "Hip Hop",
      image: hiphop,
    },
    {
      id: 8,
      title: "EDM",
      image: edm,
    },
  ];

  const songs = [
    {
      id: 1,
      artist: "The Weeknd",
      song: "Blinding Lights",
      duration: "3:20",
    },
    {
      id: 2,
      artist: "MIW",
      song: "Another Life",
      duration: "3:26",
    },
    {
      id: 3,
      artist: "Post Malone",
      song: "Circles",
      duration: "3:35",
    },
  ];

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = 220;

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const maxScroll = el.scrollWidth - el.clientWidth;

    setCanLeft(scrollLeft > 5);
    setCanRight(scrollLeft < maxScroll - 5);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    el.addEventListener("scroll", checkScroll);

    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className="dashboard">
      <div className="discover-genre">
        <div className="title">
          <div className="title-left">
            <BsMusicNote className="title-icon" />
            <h2>Discover Genre</h2>
          </div>

          <div className="title-right">
            <button className="returnButton" onClick={() => navigate("/")}>
              <FaArrowLeftLong />  Back
            </button>
          </div>
        </div>

        <div className="carousel-wrapper">
          <div className="carousel-buttons">
            <button
              className="left-btn"
              onClick={() => scroll("left")}
              disabled={!canLeft}
            >
              <BiSolidLeftArrow />
            </button>

            <button
              className="right-btn"
              onClick={() => scroll("right")}
              disabled={!canRight}
            >
              <BiSolidRightArrow />
            </button>
          </div>

          <div className="discover-genre-list" ref={scrollRef}>
            {playlists.map((playlist) => (
              <div
                className="playlist-box"
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                <img
                  className="playlist-image"
                  src={playlist.image}
                  alt={playlist.title}
                />

                <h2 className="playlist-title">{playlist.title}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="top-music">
        <div className="title">
          <div className="title-left">
            <TfiHeadphone className="title-icon" />
            <h2>Top Music</h2>
          </div>

          <div className="title-right">
            <a href="./topmusic">Show More...</a>
          </div>
        </div>

        <div className="top-music-list">
          {songs.map((song, i) => (
            <div className="song-box" key={song.id}>
              <h1 className="chart-position">#{i + 1}</h1>

              <div className="artist-picture"></div>

              <p className="artist-n-song">
                {song.artist} - {song.song}
              </p>

              <p className="duration">{song.duration}</p>

              <button
                className={`pause-button ${
                  playingSong === song.id ? "playing" : ""
                }`}
                onClick={() =>
                  setPlayingSong(playingSong === song.id ? null : song.id)
                }
              >
                {playingSong === song.id ? <FaPause /> : <FaPlay />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
