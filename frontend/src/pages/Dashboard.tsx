import { BsMusicNote } from "react-icons/bs";
import { TfiHeadphone } from "react-icons/tfi";
import { useMemo, useRef, useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidLeftArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

import { getDashboardTopTracks } from "../api/dashboard";
import type { Track } from "../api/tracks";
import { usePlayback } from "../playback/PlaybackContext";
import { useLanguage } from "../i18n/LanguageContext";

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
  const { currentTrack, isPlaying, setIsPlaying, playTrack } = usePlayback();
  const { t } = useLanguage();
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loadingTop, setLoadingTop] = useState(false);

  const navigate = useNavigate();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  /* PLAYLISTS */
  const playlists = [
    {
      id: 1,
      title: t("dashboard.coolPlaylist"),
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

  useEffect(() => {
    const controller = new AbortController();
    setLoadingTop(true);
    getDashboardTopTracks(3, controller.signal)
      .then(setTopTracks)
      .catch(() => setTopTracks([]))
      .finally(() => setLoadingTop(false));
    return () => controller.abort();
  }, []);

  const songs = useMemo(
    () =>
      topTracks.map((track) => ({
        id: track.id,
        artist: track.artist?.name ?? t("common.unknownArtist"),
        song: track.title,
        duration: `${Math.floor((track.duration ?? 0) / 60)}:${String(
          (track.duration ?? 0) % 60,
        ).padStart(2, "0")}`,
        track,
      })),
    [topTracks, t],
  );

  const scroll = (dir: "left" | "right") => {
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
            <h2>{t("dashboard.discoverGenre")}</h2>
          </div>

          <div className="title-right">
            <button className="returnButton" onClick={() => navigate("/")}>
              <FaArrowLeftLong /> {t("common.back")}
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
            <h2>{t("dashboard.topMusic")}</h2>
          </div>

          <div className="title-right">
            <button
              type="button"
              className="returnButton"
              onClick={() => navigate("/topmusic")}
            >
              {t("common.showMore")}
            </button>
          </div>
        </div>

        <div className="top-music-list">
          {loadingTop ? <p style={{ margin: 0 }}>{t("common.loading")}</p> : null}
          {songs.map((song, i) => (
            <div className="song-box" key={song.id}>
              <h1 className="chart-position">#{i + 1}</h1>

              <div className="artist-picture"></div>

              <p className="artist-n-song">
                {song.artist} - {song.song}
              </p>

              <p className="duration">{song.duration}</p>

              <button
                className={`pause-button ${currentTrack?.id === song.id && isPlaying ? "playing" : ""}`}
                onClick={() => {
                  if (!song.track.preview) return;
                  if (currentTrack?.id === song.id) {
                    setIsPlaying(!isPlaying);
                    return;
                  }
                  playTrack(song.track);
                }}
              >
                {currentTrack?.id === song.id && isPlaying ? <FaPause /> : <FaPlay />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
