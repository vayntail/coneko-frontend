import { createContext, useContext, useState, useEffect } from "react";

// Mock Data, replace when backEnd API is running
import {
  platformOptions,
  genreOptions,
  regionOptions,
  groupSizeOptions,
  customTagOptions,
} from "../assets/mockData/filterOptions";

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

  //State for all sessions and filtered sessions
  const [allSessions, setAllSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);

  //State for loading status
  const [isLoading, setIsLoading] = useState(true);

  //Load game session data
  useEffect(() => {
    // (Todo replace with backend API)
    const loadData = async () => {
      try {
        setIsLoading(true);

        // First try to load from localStorage
        let sessions = [];
        try {
          const localSessions = localStorage.getItem("gameSessions");
          if (localSessions) {
            sessions = JSON.parse(localSessions);
            console.log("Loaded sessions from localStorage:", sessions.length);
          }
        } catch (error) {
          console.error("Error loading from localStorage:", error);
        }

        // If no localStorage data or empty array, fall back to mock data
        if (sessions.length === 0) {
          console.log("No localStorage data, loading mock data");
          const module = await import("../assets/mockData/gameSessions");
          sessions = module.default;
        }

        setAllSessions(sessions);
        setFilteredSessions(sessions); //Start with all sessions

        setIsLoading(false);
      } catch (error) {
        console.error(`Failed to load session data`, error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array ensures this runs once on mount

  //Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [
    platforms,
    genres,
    regions,
    groupSize,
    customTags,
    searchTerm,
    allSessions,
  ]);

  /**
   * Function to apply all filters to the sessions
   * This runs whenever any filter criteria changes (Another option is chosen or removed)
   */

  const applyFilters = () => {
    //If no data loaded yet, do nothing
    if (allSessions.length === 0) return;

    //Start with all sessions
    let results = [...allSessions];

    //Filter by platforms - if any platforms are selected
    if (platforms.length > 0) {
      results = results.filter((session) =>
        platforms.includes(session.platform)
      );
    }

    // Filter by genres - if any genres are selected
    // A session matches if it has ANY of the selected genres
    if (genres.length > 0) {
      results = results.filter(
        (session) =>
          // Check if any of the selected genres are in the session's genres array
          session.genres &&
          genres.some((genre) => session.genres.includes(genre))
      );
    }

    // Filter by regions - if any regions are selected
    if (regions.length > 0) {
      results = results.filter((session) => regions.includes(session.region));
    }

    // Filter by custom tags - if any custom tags are selected
    // A session matches if it has ANY of the selected custom tags
    if (customTags.length > 0) {
      results = results.filter(
        (session) =>
          session.customTags &&
          customTags.some((tag) => session.customTags.includes(tag))
      );
    }

    // Filter by group size - if a group size is selected
    if (groupSize) {
      results = results.filter((session) => {
        // Get the maximum player capacity
        const maxCapacity = session.maxPlayers;

        // Apply different filters based on group size selection
        switch (groupSize) {
          case "any":
            return true; // Match everything
          case "small":
            return maxCapacity <= 2; // For small groups (1-2 players)
          case "medium":
            return maxCapacity > 2 && maxCapacity <= 5; // For medium groups (2-5 players)
          case "large":
            return maxCapacity > 5; // For large groups (5+ players)
          default:
            return true;
        }
      });
    }

    // Filter by search term - if a search term is entered
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(
        (session) =>
          // Search in title and description
          (session.title && session.title.toLowerCase().includes(term)) ||
          (session.description &&
            session.description.toLowerCase().includes(term))
      );
    }

    // Update the filtered sessions state
    setFilteredSessions(results);
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

    // Sample options for testing (mock data)
    platformOptions,
    genreOptions,
    regionOptions,
    groupSizeOptions,
    customTagOptions,

    //Session data
    allSessions,
    filteredSessions,
    isLoading,

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
