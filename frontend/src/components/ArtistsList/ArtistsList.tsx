import type { Artist } from "../../api/artists";
import "./ArtistsList.css";

type Props = {
  artists: Artist[];
  query: string;
};

export default function ArtistsList({ artists, query }: Props) {
  if (!query.trim()) {
    return (
      <div className="ArtistsList-empty">
        Type something to search artists.
      </div>
    );
  }

  if (artists.length === 0) {
    return <div className="ArtistsList-empty">No artists found.</div>;
  }

  return (
    <div className="ArtistsList">
      {artists.map((artist) => (
        <article key={artist.id} className="ArtistCard">
          <img className="ArtistCard-img" src={artist.image} alt={artist.name} />
          <div className="ArtistCard-body">
            <div className="ArtistCard-titleRow">
              <a
                className="ArtistCard-name"
                href={artist.link}
                target="_blank"
                rel="noreferrer"
              >
                {artist.name}
              </a>
              <span className="ArtistCard-popularity">{artist.popularity}</span>
            </div>

            {artist.bestTrack ? (
              <div className="ArtistCard-track">
                <span className="ArtistCard-trackLabel">Top track:</span>{" "}
                <span className="ArtistCard-trackTitle">
                  {artist.bestTrack.title}
                </span>
                {artist.bestTrack.preview ? (
                  <audio
                    className="ArtistCard-audio"
                    controls
                    preload="none"
                    src={artist.bestTrack.preview}
                  />
                ) : null}
              </div>
            ) : (
              <div className="ArtistCard-track ArtistCard-trackMuted">
                No top track preview.
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

