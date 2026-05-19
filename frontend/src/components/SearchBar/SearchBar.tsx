import "./SearchBar.css";

export default function SearchBar() {
  return (
    <div className="Searchbar">
      <input
        placeholder="Search for artists..."
        className="Searchbar-input"
        autoFocus
      />
      <p className="ArtistCount">Found</p>
    </div>
  );
}
