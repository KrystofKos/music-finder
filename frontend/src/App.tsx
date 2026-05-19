import { useEffect, useState } from "react";
import { getArtists, type Artist } from "./api/artists";
import { HiPlus } from "react-icons/hi";
import { HiArrowsPointingOut } from "react-icons/hi2";
import { HiArrowsPointingIn } from "react-icons/hi2";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import "./App.css";
import SignIn from "./components/authorization/SignIn";
import SignUp from "./components/authorization/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";

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

  const OpenSignInTab = () => {};

  const OpenSignUpTab = () => {};

  const [showBackButton, setShowBackButton] = useState(false);

  const scrollFiltersBack = () => {
    const filterList = document.querySelector(".filterList");

    if (filterList) {
      filterList.scrollBy({
        left: -120,
        behavior: "smooth",
      });

      if (filterList.scrollLeft <= 120) {
        setShowBackButton(false);
      }
    }
  };

  const scrollFiltersForward = () => {
    const filterList = document.querySelector(".filterList");

    if (filterList) {
      filterList.scrollBy({
        left: 120,
        behavior: "smooth",
      });

      setShowBackButton(true);
    }
  };

  const header = (
    <div className="Header">
      <div className="header-left">
        <a href="./App.tsx">
          <img src="images/logo.png" alt="Logo" className="Header-logo" />
        </a>
        <h1 className="Header-title">Music Finder</h1>
      </div>

      <div className="header-right">
        <button className="signinButton" onClick={() => OpenSignInTab()}>
          Sign In
        </button>
        <button className="signupButton" onClick={() => OpenSignUpTab()}>
          Sign Up
        </button>
      </div>
    </div>
  );

  const [isSidepanelExpanded, setIsSidepanelExpanded] = useState(false);
  const ExpandSidePanel = () => {
    setIsSidepanelExpanded((prev) => !prev);
  };
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = [
    { key: "playlists", label: "Playlists" },
    { key: "artists", label: "Fav Artists" },
    { key: "albums", label: "Fav Album" },
    { key: "songs", label: "Fav Songs" },
  ];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const clearFilters = () => {
    setActiveFilter(null);
  };

  const sidepanel = (
    <div className={`Sidepanel ${isSidepanelExpanded ? "expanded" : ""}`}>
      <div className="Sidepanel-Header">
        <div className="Sidepanel-Header-Right">
          <h2>You</h2>
        </div>
        <div className="Sidepanel-Header-Left">
          <button className="plusButton" onClick={() => AddObject()}>
            <HiPlus className="plusIcon" />
          </button>

          <button className="expandButton" onClick={() => ExpandSidePanel()}>
            {isSidepanelExpanded ? (
              <HiArrowsPointingIn className="expandIcon" />
            ) : (
              <HiArrowsPointingOut className="expandIcon" />
            )}
          </button>
        </div>
      </div>

      <div className="filterWrapper">
        {activeFilter && (
          <button className="clearFiltersButton" onClick={clearFilters}>
            <RxCross2 className="clearIcon" />
          </button>
        )}

        {showBackButton && (
          <button className="arrowButtonBack" onClick={scrollFiltersBack}>
            <IoIosArrowBack />
          </button>
        )}

        <div className="filterList">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`filterButton ${activeFilter === f.key ? "active" : ""}`}
              onClick={() => handleFilterChange(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button className="arrowButtonForward" onClick={scrollFiltersForward}>
          <IoIosArrowForward />
        </button>
      </div>

      <div className="Sidepanel-Searchbar">
        <input
          
          placeholder="Search your content..."
          className="Sidepanel-Searchbar-input"
        />
      </div>

      <div className="Sidepanel-List"></div>
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
      <p className="ArtistCount">
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
      <BrowserRouter>
        {header}
        {searchbar}
        {results}
        <Routes>
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
