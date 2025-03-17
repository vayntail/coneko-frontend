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

  // ============================== TEMPORARY LOCALSTORAGE IMPLEMENTATION ==============================
  // Add localStorage sessions state
  const [localSessions, setLocalSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("localSessions")) || [];
    } catch (e) {
      console.error("Error loading local sessions:", e);
      return [];
    }
  });
  // ==============================================================================================

  // Fetch game sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const sessions = await gameSessionsAPI.getAllSessions();
        console.log("API Response:", sessions);

        // ============================== TEMPORARY LOCALSTORAGE IMPLEMENTATION ==============================
        // Check if the response is an array
        let apiSessions = [];
        if (Array.isArray(sessions) && sessions.length > 0) {
          apiSessions = sessions;
        } else {
          console.warn(
            "API did not return valid session data. Using empty array."
          );
        }

        // Combine API sessions with localStorage sessions
        const combinedSessions = [
          ...apiSessions,
          ...localSessions.map((session) => ({
            ...session,
            isLocalOnly: true,
          })),
        ];

        setAllSessions(combinedSessions);
        setFilteredSessions(combinedSessions);
        // ==============================================================================================

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);

        // ============================== TEMPORARY LOCALSTORAGE IMPLEMENTATION ==============================
        // Use local sessions when API fails
        if (localSessions.length > 0) {
          console.log(
            "Using local sessions due to API error:",
            localSessions.length
          );
          setAllSessions(localSessions);
          setFilteredSessions(localSessions);
          setError("API unavailable. Showing locally stored sessions.");
        } else {
          // ==============================================================================================
          setError("Failed to load game sessions. Please try again later");
          // ============================== TEMPORARY LOCALSTORAGE IMPLEMENTATION ==============================
        }
        // ==============================================================================================

        setIsLoading(false);
      }
    };

    fetchSessions();
    // ============================== TEMPORARY LOCALSTORAGE IMPLEMENTATION ==============================
  }, [localSessions]); // Add localSessions as dependency
  // ==============================================================================================

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

  // ============================== TEMPORARY LOCALSTORAGE IMPLEMENTATION ==============================
  // Add function to create local sessions
  const createLocalSession = (sessionData) => {
    const newSession = {
      ...sessionData,
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isLocalOnly: true,
    };

    const updatedSessions = [...localSessions, newSession];
    setLocalSessions(updatedSessions);
    localStorage.setItem("localSessions", JSON.stringify(updatedSessions));

    // Update allSessions and filtered sessions
    setAllSessions((prev) => [...prev, newSession]);
    setFilteredSessions((prev) => [...prev, newSession]);

    return newSession;
  };
  // ==============================================================================================

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

    // ============================== TEMPORARY LOCALSTORAGE IMPLEMENTATION ==============================
    createLocalSession,
    // ==============================================================================================
  };

  // Return the Provider component with the context value
  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
