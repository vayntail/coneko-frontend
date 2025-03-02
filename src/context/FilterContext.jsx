import { createContext, useContext, useState } from "react";

//Context for components to acces the filter state witout prop drilling
const FilterContext = createContext();

//Custom hook to make using the filter context easier in components
export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  // State variables for each type of filter

  // Platform filter - can select multiple platforms
  const [platforms, setPlatforms] = useState([]);

  // Genre filter - can select multiple genres
  const [genres, setGenres] = useState([]);

  // Region filter - can select multiple regions
  const [regions, setRegions] = useState([]);

  // Group size filter - single selection
  const [groupSize, setGroupSize] = useState("");

  // Custom tags filter - can select multiple tags
  const [customTags, setCustomTags] = useState([]);

  // Search term for text search
  const [searchTerm, setSearchTerm] = useState("");

  //Todo import mock data (will eventually swap with backEnd API's)
  const sampleOptions = {
    platformOptions: [
      { value: "pc", label: "PC" },
      { value: "ps5", label: "PlayStation 5" },
      { value: "xbox", label: "Xbox" },
    ],
    // Add similar sample options for other filters
  };

  // Function to reset all filters to their default state
  const resetFilters = () => {
    setPlatforms([]);
    setGenres([]);
    setRegions([]);
    setGroupSize("");
    setCustomTags([]);
    setSearchTerm("");
  };

  // Create the value object that will be provided to components
  const contextValue = {
    // Filter states and setter functions
    platforms,
    setPlatforms,
    genres,
    setGenres,
    regions,
    setRegions,
    groupSize,
    setGroupSize,
    customTags,
    setCustomTags,
    searchTerm,
    setSearchTerm,

    // Sample options for testing
    sampleOptions,

    // Reset function
    resetFilters,
  };

  // Return the Provider component with the context value
  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
