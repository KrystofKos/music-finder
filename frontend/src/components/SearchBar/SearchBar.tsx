import "./SearchBar.css";

type Props = {
  query: string;
  onQueryChange: (next: string) => void;
  foundCount: number;
  loading?: boolean;
};

export default function SearchBar({
  query,
  onQueryChange,
  foundCount,
  loading = false,
}: Props) {
  return (
    <div className="Searchbar">
      <input
        placeholder="Search for artists or tracks..."
        className="Searchbar-input"
        autoFocus
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <p className="ArtistCount">
        {loading ? "Searching…" : `Found ${foundCount}`}
      </p>
    </div>
  );
}
