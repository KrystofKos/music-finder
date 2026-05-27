import PlayBack from "./components/PlayBack/PlayBack";
import RightSidePanel from "./components/RightSidePanel/RightSidePanel";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import SignIn from "./components/authorization/SignIn";
import SignUp from "./components/authorization/SignUp";
import SidePanel from "./components/SidePanel/SidePanel";
import SearchBar from "./components/SearchBar/SearchBar";
import Dashboard from "./pages/Dashboard";
import Favorite from "./pages/Favorite";
import Friends from "./pages/Friends";
import LiveChat from "./pages/LiveChat";
import MobileApp from "./pages/MobileApp";
import ArtistsList from "./components/ArtistsList/ArtistsList";
import TracksList from "./components/TracksList/TracksList";
import UserProfile from "./pages/UserProfile";
import { getArtists, type Artist } from "./api/artists";
import { getTracks, type Track } from "./api/tracks";
import { ApiError } from "./api/http";
import Settings from "./pages/Settings";
import FaQs from "./pages/FaQs";
import { PlaybackProvider } from "./playback/PlaybackContext";
import Playlist from "./pages/Playlist";
import TopMusic from "./pages/TopMusic";
import { ThemeProvider } from "./theme/ThemeContext";
import { LanguageProvider } from "./i18n/LanguageContext";

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

        if (artistsResult.status === "fulfilled") {
          setArtists(artistsResult.value);
        } else {
          setArtists([]);
        }

        if (tracksResult.status === "fulfilled") {
          setTracks(tracksResult.value);
        } else {
          setTracks([]);
        }

        if (
          artistsResult.status === "rejected" ||
          tracksResult.status === "rejected"
        ) {
          const err =
            (artistsResult.status === "rejected"
              ? artistsResult.reason
              : null) ??
            (tracksResult.status === "rejected" ? tracksResult.reason : null);

          if (err instanceof ApiError) {
            setError(`API error ${err.status}`);
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Search failed");
          }
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
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <PlaybackProvider>
            <div className="wrapper">
              <PlayBack />
              <SidePanel />
              <main className="Main">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <SearchBar
                          query={query}
                          onQueryChange={setQuery}
                          foundCount={artists.length + tracks.length}
                          loading={loading}
                        />

                        {error ? <p style={{ marginTop: 10 }}>{error}</p> : null}

                        <TracksList tracks={tracks} query={query} />

                        <ArtistsList artists={artists} query={query} />
                      </>
                    }
                  />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/favorite" element={<Favorite />} />
                  <Route path="/friends" element={<Friends />} />
                  <Route path="/livechat" element={<LiveChat />} />
                  <Route path="/mobileapp" element={<MobileApp />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/faqs" element={<FaQs />} />
                  <Route path="/playlist/:id" element={<Playlist />} />
                  <Route path="/topmusic" element={<TopMusic />} />
                </Routes>
              </main>
              <RightSidePanel />
            </div>
          </PlaybackProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
