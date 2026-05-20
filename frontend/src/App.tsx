import RightSidePanel from "./components/RightSidePanel/RightSidePanel";
import "./App.css";
import SignIn from "./components/authorization/SignIn";
import SignUp from "./components/authorization/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SidePanel from "./components/SidePanel/SidePanel";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import { useEffect, useState } from "react";
import ArtistsList from "./components/ArtistsList/ArtistsList";
import { getArtists, type Artist } from "./api/artists";
import { getTracks, type Track } from "./api/tracks";
import TracksList from "./components/TracksList/TracksList";
import { ApiError } from "./api/http";

function App() {
  const [query, setQuery] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setArtists([]);
      setTracks([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const [artistsResult, tracksResult] = await Promise.allSettled([
          getArtists(trimmed, controller.signal),
          getTracks(trimmed, controller.signal),
        ]);

        if (artistsResult.status === "fulfilled") setArtists(artistsResult.value);
        else setArtists([]);

        if (tracksResult.status === "fulfilled") setTracks(tracksResult.value);
        else setTracks([]);

        if (
          artistsResult.status === "rejected" ||
          tracksResult.status === "rejected"
        ) {
          const err =
            (artistsResult.status === "rejected" ? artistsResult.reason : null) ??
            (tracksResult.status === "rejected" ? tracksResult.reason : null);

          if (err instanceof ApiError) setError(`API error ${err.status}`);
          else if (err instanceof Error) setError(err.message);
          else setError("Search failed");
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          if (err instanceof ApiError) {
            setError(`API error ${err.status}`);
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Unknown error");
          }
          setArtists([]);
          setTracks([]);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  return (
    <div className="wrapper">
      <BrowserRouter>
        {/* <Header /> */}
        <SidePanel />
        <RightSidePanel />
        <main className="Main">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            foundCount={artists.length + tracks.length}
            loading={loading}
          />
          {error ? <p style={{ marginTop: 10 }}>{error}</p> : null}
          <TracksList tracks={tracks} query={query} />
          <ArtistsList artists={artists} query={query} />
        </main>
        <Routes>
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
