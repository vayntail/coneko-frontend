import { createContext, useContext, useState, useEffect } from "react";
import { gameSessionsAPI } from "../utils/api";

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

  //State for Errors
  const [error, setError] = useState(null);

  //#region  (Old Locol storage data )
  /*
  //Load game session data from 
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
*/
  //#endregion

  // Fetch game sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const sessions = await gameSessionsAPI.getAllSessions();
        console.log("API Response:", sessions);

        // Check if the response is an array
        if (Array.isArray(sessions) && sessions.length > 0) {
          setAllSessions(sessions);
          setFilteredSessions(sessions);
        } else {
          console.warn(
            "API did not return valid session data. Using empty array."
          );
          setAllSessions([]);
          setFilteredSessions([]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        setError("Failed to load game sessions. Please try again later");
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  /**
   * Function to apply all filters to the sessions
   * This runs whenever any filter criteria changes (Another option is chosen or removed)
   */

  //applyFilters function
  const applyFilters = () => {
    if (allSessions.length === 0) return;

    let results = [...allSessions];

    // Filter by platforms
    if (platforms.length > 0) {
      results = results.filter((session) =>
        platforms.includes(session.platform)
      );
    }

    // Filter by genres
    if (genres.length > 0) {
      results = results.filter((session) => genres.includes(session.gameGenre));
    }

    // Filter by regions
    if (regions.length > 0) {
      results = results.filter((session) =>
        regions.includes(session.gameRegion)
      );
    }

    // Filter by custom tags
    if (customTags.length > 0) {
      results = results.filter((session) =>
        customTags.includes(session.customTags)
      );
    }

    // Filter by group size
    if (groupSize) {
      results = results.filter((session) => {
        const maxCapacity = session.playersNeeded;

        switch (groupSize) {
          case "any":
            return true;
          case "small":
            return maxCapacity <= 2;
          case "medium":
            return maxCapacity > 2 && maxCapacity <= 5;
          case "large":
            return maxCapacity > 5;
          default:
            return true;
        }
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(
        (session) =>
          (session.gameTitle &&
            session.gameTitle.toLowerCase().includes(term)) ||
          (session.requestDescription &&
            session.requestDescription.toLowerCase().includes(term))
      );
    }

    setFilteredSessions(results);
  };

  //Apply filters whenever any filter changes
  useEffect(() => {
    if (allSessions.length > 0) {
      applyFilters();
    }
  }, [
    platforms,
    genres,
    regions,
    groupSize,
    customTags,
    searchTerm,
    allSessions,
  ]);

  // Function to reset all filters to their default state
  const resetFilters = () => {
    setPlatforms([]);
    setGenres([]);
    setRegions([]);
    setGroupSize("");
    setCustomTags([]);
    setSearchTerm("");
  };

  //Refreshes data from the API
  const refreshSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const sessions = await gameSessionsAPI.getAllSessions();
      setAllSessions(sessions);

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to refresh sessions:", error);
      setError("Failed to refresh game sessions. Please try again later.");
      setIsLoading(false);
    }
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
    error,

    // Reset function
    resetFilters,
    refreshSessions,
  };

  // Return the Provider component with the context value
  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
