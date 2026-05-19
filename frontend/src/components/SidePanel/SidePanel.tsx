import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { HiArrowsPointingIn, HiArrowsPointingOut } from "react-icons/hi2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import "./SidePanel.css";

export default function SidePanel() {
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

  const [isSidepanelExpanded, setIsSidepanelExpanded] = useState(false);
  const expandSidePanel = () => {
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
  return (
    <div className={`Sidepanel ${isSidepanelExpanded ? "expanded" : ""}`}>
      <div className="Sidepanel-Header">
        <div className="Sidepanel-Header-Right">
          <h2>You</h2>
        </div>
        <div className="Sidepanel-Header-Left">
          <button type="button" className="plusButton">
            <HiPlus className="plusIcon" />
          </button>

          <button
            type="button"
            className="expandButton"
            onClick={expandSidePanel}
          >
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
          <button
            type="button"
            className="clearFiltersButton"
            onClick={clearFilters}
          >
            <RxCross2 className="clearIcon" />
          </button>
        )}

        {showBackButton && (
          <button
            type="button"
            className="arrowButtonBack"
            onClick={scrollFiltersBack}
          >
            <IoIosArrowBack />
          </button>
        )}

        <div className="filterList">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`filterButton ${activeFilter === f.key ? "active" : ""}`}
              type="button"
              onClick={() => handleFilterChange(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="arrowButtonForward"
          onClick={scrollFiltersForward}
        >
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
}
