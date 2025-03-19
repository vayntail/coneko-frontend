import { createContext, useContext, useState, useEffect } from "react";
import { gameSessionsAPI } from "../utils/api";

// Filter options data
import {
  platformOptions,
  genreOptions,
  regionOptions,
  groupSizeOptions,
  customTagOptions,
} from "../assets/mockData/filterOptions";

// Context for components to access the filter state without prop drilling
const FilterContext = createContext();

// Custom hook to make using the filter context easier in components
export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  // Filter state variables
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const [regions, setRegions] = useState([]);
  const [groupSize, setGroupSize] = useState("");
  const [customTags, setCustomTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Session data state
  const [allSessions, setAllSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local storage sessions state (for fallback and offline support)
  const [localSessions, setLocalSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("localSessions")) || [];
    } catch (e) {
      console.error("Error loading local sessions:", e);
      return [];
    }
  });

  // Fetch game sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to get sessions from API
        const apiSessions = await gameSessionsAPI.getAllSessions();
        console.log("API Sessions loaded:", apiSessions.length);

        // Combine API sessions with local sessions
        // Mark local sessions so we can show a visual indicator
        const combinedSessions = [
          ...apiSessions,
          ...localSessions.map((session) => ({
            ...session,
            isLocalOnly: true,
          })),
        ];

        setAllSessions(combinedSessions);
        setFilteredSessions(combinedSessions);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch sessions from API:", error);

        // Show local sessions and error message if API fails
        if (localSessions.length > 0) {
          console.log("Using local sessions:", localSessions.length);
          setAllSessions(localSessions);
          setFilteredSessions(localSessions);
          setError("API unavailable. Showing locally stored sessions only.");
        } else {
          setError("Failed to load game sessions. Please try again later.");
        }

        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [localSessions]); // Re-fetch if local sessions change

  // Apply filters whenever any filter criteria changes
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

  // Function to apply all filters to the sessions
  const applyFilters = () => {
    if (allSessions.length === 0) return;

    let results = [...allSessions];

    // Filter by platforms
    if (platforms.length > 0) {
      results = results.filter((session) => {
        // Check if platform exists in platforms array or as a single value
        if (Array.isArray(session.platforms)) {
          return session.platforms.some((platform) =>
            platforms.includes(platform)
          );
        }
        return platforms.includes(session.platform);
      });
    }

    // Filter by genres
    if (genres.length > 0) {
      results = results.filter((session) => {
        // Check if genres exist in genres array or as a single value
        if (Array.isArray(session.genres)) {
          return session.genres.some((genre) => genres.includes(genre));
        }
        return genres.includes(session.gameGenre);
      });
    }

    // Filter by regions
    if (regions.length > 0) {
      results = results.filter((session) => {
        // Check if regions exist in regions array or as a single value
        if (Array.isArray(session.regions)) {
          return session.regions.some((region) => regions.includes(region));
        }
        return regions.includes(session.gameRegion);
      });
    }

    // Filter by custom tags
    if (customTags.length > 0) {
      results = results.filter((session) => {
        // Check if customTags exist in customTags array or as a single value
        if (Array.isArray(session.customTags)) {
          return session.customTags.some((tag) => customTags.includes(tag));
        }
        return customTags.includes(session.customTags);
      });
    }

    // Filter by group size
    if (groupSize) {
      results = results.filter((session) => {
        // Use playersNeeded or maxPlayers depending on what's available
        const maxCapacity = session.playersNeeded || session.maxPlayers;

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
      results = results.filter((session) => {
        // Check all possible title and description field names
        const title = session.gameTitle || session.title || "";
        const description =
          session.requestDescription || session.description || "";

        return (
          title.toLowerCase().includes(term) ||
          description.toLowerCase().includes(term)
        );
      });
    }

    setFilteredSessions(results);
  };

  // Function to reset all filters
  const resetFilters = () => {
    setPlatforms([]);
    setGenres([]);
    setRegions([]);
    setGroupSize("");
    setCustomTags([]);
    setSearchTerm("");
  };

  // Function to refresh sessions from API
  const refreshSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiSessions = await gameSessionsAPI.getAllSessions();

      // Combine with local sessions
      const combinedSessions = [
        ...apiSessions,
        ...localSessions.map((session) => ({
          ...session,
          isLocalOnly: true,
        })),
      ];

      setAllSessions(combinedSessions);
      setFilteredSessions(combinedSessions);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to refresh sessions:", error);
      setError("Failed to refresh game sessions. Please try again later.");
      setIsLoading(false);
    }
  };

  // Function to create session (tries API first, falls back to local storage)
  const createSession = async (sessionData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to create session via API
      const newSession = await gameSessionsAPI.createSession(sessionData);

      // Update all sessions with the new one
      setAllSessions((prev) => [...prev, newSession]);
      setFilteredSessions((prev) => [...prev, newSession]);

      setIsLoading(false);
      return newSession;
    } catch (error) {
      console.error("Failed to create session via API:", error);
      setError("API unavailable. Session stored locally only.");

      // Fall back to local storage
      const newLocalSession = createLocalSession(sessionData);
      setIsLoading(false);
      return newLocalSession;
    }
  };

  // Function to create local session
  const createLocalSession = (sessionData) => {
    // Create a new session with local ID
    const newSession = {
      ...sessionData,
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isLocalOnly: true,
    };

    // Update local sessions state and localStorage
    const updatedSessions = [...localSessions, newSession];
    setLocalSessions(updatedSessions);
    localStorage.setItem("localSessions", JSON.stringify(updatedSessions));

    return newSession;
  };

  // The value object provided to context consumers
  const contextValue = {
    // Filter states and setters
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

    // Filter options
    platformOptions,
    genreOptions,
    regionOptions,
    groupSizeOptions,
    customTagOptions,

    // Session data
    allSessions,
    filteredSessions,
    isLoading,
    error,

    // Actions
    resetFilters,
    refreshSessions,
    createSession,
    createLocalSession,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
