import { useEffect, useState } from "react";
import { getArtists, type Artist } from "./api/artists";
import "./App.css";

function App() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [query, setQuery] = useState("");
  const [expandedArtistIds, setExpandedArtistIds] = useState<string[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getArtists(query).then(setArtists);
    }, 0);

    return () => clearTimeout(timeout);
  }, [query]);

  const toggleArtistDetails = (id: string) => {
    setExpandedArtistIds((prev) =>
      prev.includes(id)
        ? prev.filter((artistId) => artistId !== id)
        : [...prev, id],
    );
  };

  const header = (
    <div className="Header">
      <h1 className="Header-title">Music Finder</h1>
      <img src="images/logo.png" alt="Logo" className="Header-logo" />
    </div>
  );

  const searchbar = (
    <div className="Searchbar">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for artists..."
        className="Searchbar-input"
        autoFocus
      />
      <p>
        {artists.length} artist{artists.length !== 1 ? "s" : ""} found
      </p>
    </div>
  );

  const results = (
    <div className="ResultBar">
      <div className="ArtistList">
        {artists.map((artist) => (
          <div className="ArtistCard" key={artist._id}>
            <div className="ArtistCard-header">
              <h2>{artist.name}</h2>
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="ArtistCard-image"
              />
            </div>
            {expandedArtistIds.includes(artist._id) ? (
              <>
                <p>Albums: {artist.albums?.join(", ")}</p>
                <p>Similar Artists: {artist.similarArtists?.join(", ")}</p>
                <p>Genres: {artist.genres?.join(", ")}</p>
                <p>Mood: {artist.mood?.join(", ")}</p>
                <p>Era: {artist.era}</p>
              </>
            ) : null}

            <button
              type="button"
              className="ArtistCard-detail"
              onClick={() => toggleArtistDetails(artist._id)}
            >
              detail
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="Body">
      {header}
      {searchbar}
      {results}
    </div>
  );
}

export default App;
