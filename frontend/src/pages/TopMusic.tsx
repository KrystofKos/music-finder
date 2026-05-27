import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import type { Track } from "../api/tracks";
import { getDashboardTopTracksPage } from "../api/dashboard";
import { usePlayback } from "../playback/PlaybackContext";
import { useLanguage } from "../i18n/LanguageContext";
import "../components/TracksList/TracksList.css";

export default function TopMusic() {
  const navigate = useNavigate();
  const { playTrack } = usePlayback();
  const { t } = useLanguage();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const pageSize = 10;

  const trackIds = useMemo(() => new Set(tracks.map((t) => t.id)), [tracks]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getDashboardTopTracksPage(pageSize, pageIndex * pageSize, controller.signal)
      .then((next) => {
        const filtered = next.filter((t) => !trackIds.has(t.id));
        setTracks((prev) => [...prev, ...filtered]);
        setPageIndex((p) => p + 1);
        setHasMore(next.length === pageSize);
      })
      .catch(() => setError(t("topMusic.loadError")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setTracks([]);
    setHasMore(true);
    setPageIndex(0);
  }, []);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) loadMore();
      },
      { rootMargin: "600px" },
    );

    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore, pageIndex, trackIds]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>{t("dashboard.topMusic")}</h1>
        <button className="returnButton" onClick={() => navigate("/dashboard")}>
          <FaArrowLeftLong /> {t("common.back")}
        </button>
      </div>

      {loading && tracks.length === 0 ? (
        <p style={{ marginTop: 10 }}>{t("common.loading")}</p>
      ) : null}
      {error ? <p style={{ marginTop: 10 }}>{error}</p> : null}

      <div className="TracksList">
        {tracks.map((track) => (
          <article key={track.id} className="TrackCard">
            <img
              className="TrackCard-img"
              src={track.album?.cover ?? track.artist?.picture ?? ""}
              alt={track.album?.title ?? track.artist?.name ?? track.title}
            />
            <div className="TrackCard-body">
              <div className="TrackCard-titleRow">
                <a
                  className="TrackCard-title"
                  href={track.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {track.title}
                </a>
              </div>

              <div className="TrackCard-subtitle">
                {track.artist ? (
                  <a
                    className="TrackCard-artist"
                    href={track.artist.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {track.artist.name}
                  </a>
                ) : (
                  <span className="TrackCard-artist">
                    {t("common.unknownArtist")}
                  </span>
                )}
                {track.album?.title ? (
                  <span className="TrackCard-album"> • {track.album.title}</span>
                ) : null}
              </div>

              {track.preview ? (
                <button
                  type="button"
                  className="TrackCard-play"
                  onClick={() => playTrack(track)}
                >
                  <span>{t("common.playInPlayer")}</span>
                </button>
              ) : (
                <div className="TrackCard-muted">{t("common.noPreview")}</div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div ref={loaderRef} style={{ height: 1 }} />
      {loading && tracks.length > 0 ? (
        <p style={{ marginTop: 10 }}>{t("common.loadingMore")}</p>
      ) : null}
      {!hasMore && tracks.length > 0 ? (
        <p style={{ marginTop: 10, opacity: 0.7 }}>
          {t("common.noMoreTracks")}
        </p>
      ) : null}
    </div>
  );
}
