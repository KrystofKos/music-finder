import { BsHeartFill, BsPlayCircleFill, BsTrash3 } from "react-icons/bs";
import { usePlayback } from "../playback/PlaybackContext";
import "./Favorite.css";
import "../components/TracksList/TracksList.css";
import { getUser } from "../auth/session";
import { Link } from "react-router-dom";

export default function Favorite() {
  const user = getUser();
  const { favorites, playFromQueue, removeFavorite } = usePlayback();

  if (!user) {
    return (
      <div className="Favorite">
        <h1 className="Favorite-title">Favorite</h1>
        <div className="TracksList-empty">
          Sign in to see your favorites. <Link to="/signin">Sign In</Link>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="Favorite">
        <h1 className="Favorite-title">Favorite</h1>
        <div className="TracksList-empty">No favorite tracks yet.</div>
      </div>
    );
  }

  return (
    <div className="Favorite">
      <div className="Favorite-header">
        <h1 className="Favorite-title">Favorite</h1>
        <div className="Favorite-count">
          <BsHeartFill />
          <span>{favorites.length}</span>
        </div>
      </div>

      <div className="TracksList">
        {favorites.map((track, index) => (
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
                  <span className="TrackCard-artist">{`Unknown artist`}</span>
                )}
                {track.album?.title ? (
                  <span className="TrackCard-album"> • {track.album.title}</span>
                ) : null}
              </div>

              <div className="Favorite-actions">
                <button
                  type="button"
                  className="TrackCard-play"
                  onClick={() => playFromQueue(favorites, index)}
                  disabled={!track.preview}
                >
                  <BsPlayCircleFill />
                  <span>Play in player</span>
                </button>
                <button
                  type="button"
                  className="Favorite-remove"
                  onClick={() => removeFavorite(track.id)}
                  aria-label="Remove from favorites"
                  title="Remove from favorites"
                >
                  <BsTrash3 />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
