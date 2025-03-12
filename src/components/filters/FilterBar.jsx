import { useFilters } from "../../context/FilterContext";
import "./FilterBar.scss";

// Individual filter components
import PlatformFilter from "./PlatformFilter";
import GenreFilter from "./GenreFilter";
import RegionFilter from "./RegionFilter";
import GroupSizeFilter from "./GroupSizeFilter";
import CustomTagFilter from "./CustomTagFilter";
import SearchBar from "./SearchBar";

//(What is this?)
//Main container for all filter components
//Combines all the individual filters into a complete filter bar

const FilterBar = () => {
  //Get the reset function from context
  const { resetFilters } = useFilters();

  return (
    <div className="filterBar">
      <div className="filtersContainer">
        {/* Individual filter components */}
        <PlatformFilter />
        <GenreFilter />
        <RegionFilter />
        <GroupSizeFilter />
        <CustomTagFilter />
        <SearchBar />

        {/* Reset button to clear all filters */}
        <button
          className="resetFiltersBtn"
          onClick={resetFilters}
          aria-label="Reset all filters"
        >
          🔃
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
