import type { Track } from "../../api/tracks";
import "./TracksList.css";
import { usePlayback } from "../../playback/PlaybackContext";
import { BsPlayCircleFill } from "react-icons/bs";
import { useLanguage } from "../../i18n/LanguageContext";

type Props = {
  tracks: Track[];
  query: string;
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function TracksList({ tracks, query }: Props) {
  const { playFromQueue } = usePlayback();
  const { t } = useLanguage();

  if (!query.trim()) {
    return <div className="TracksList-empty">{t("search.typeTracks")}</div>;
  }

  if (!Array.isArray(tracks)) {
    return <div className="TracksList-empty">{t("search.unexpected")}</div>;
  }

  if (tracks.length === 0) {
    return <div className="TracksList-empty">{t("search.noTracks")}</div>;
  }

  return (
    <div className="TracksList">
      {tracks.map((track, index) => (
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
              <span className="TrackCard-duration">
                {formatDuration(track.duration ?? 0)}
              </span>
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
                onClick={() => playFromQueue(tracks, index)}
              >
                <BsPlayCircleFill />
                <span>{t("common.playInPlayer")}</span>
              </button>
            ) : (
              <div className="TrackCard-muted">{t("common.noPreview")}</div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
