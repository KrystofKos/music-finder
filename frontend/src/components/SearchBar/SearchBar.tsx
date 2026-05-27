import { useLanguage } from "../../i18n/LanguageContext";
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
  const { t } = useLanguage();

  return (
    <div className="Searchbar">
      <input
        placeholder={t("search.placeholder")}
        className="Searchbar-input"
        autoFocus
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <p className="ArtistCount">
        {loading
          ? t("search.searching")
          : t("search.found", { count: foundCount })}
      </p>
    </div>
  );
}
