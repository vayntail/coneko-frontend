import axios from "axios";

// TEMPORARY: Flag to toggle API bypass
// Set to false when backend API issues are resolved
const BYPASS_API = false;

// Create an axios instance with default config
const api = axios.create({
  baseURL: "https://coneko-api.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // timeout 120 seconds
});

// Add API key to requests via interceptor instead of in the initial config
// This helps avoid formatting issues and allows for better debugging
api.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey) {
      config.headers["x-api-key"] = apiKey;

      console.log("Request Config:", config);

      console.log("API Key is available (length):", apiKey.length);
    } else {
      console.warn("API Key is missing! API requests will fail.");
    }

    // Remove any problematic headers that browsers block
    delete config.headers["Origin"];

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// console.log(api); Don't want others to see our API key
//This is my branch only
//Main has something similiar but alot less console logs
//Don't stress too much i'll try a few more things b4 my walk, contact the backEnd team to add more info for 403 error response and go from there.

// TEMPORARY: Mock data for use when bypassing API
const mockApiData = [
  {
    _id: "mock_123",
    gameTitle: "Mock Overwatch Session",
    requestDescription: "Looking for players to join competitive match",
    gameGenre: "fps",
    gameRegion: "na",
    platform: "pc",
    playersNeeded: 5,
    status: "ongoing",
    user: "MockUser1",
    customTags: "competitive",
    createdAt: new Date().toISOString(),
    inviteCode: "MOCK-123",
  },
  {
    _id: "mock_456",
    gameTitle: "Mock Minecraft Build",
    requestDescription: "Building a new world together",
    gameGenre: "adventure",
    gameRegion: "eu",
    platform: "pc",
    playersNeeded: 10,
    status: "ongoing",
    user: "MockUser2",
    customTags: "casual",
    createdAt: new Date().toISOString(),
    inviteCode: "MOCK-456",
  },
];

/**
 * Maps frontend session data to backend API format
 * Converts our multi-select arrays to single values for the current API
 * ...cause you know after 2 weeks the options are still not arrays
 */
const mapSessionToApiFormat = (sessionData) => {
  // The current API version expects single values
  const apiData = {
    gameTitle: sessionData.gameTitle,
    requestDescription: sessionData.description || "",
    // Take the first element for fields that will become arrays in the future
    gameGenre: sessionData.genres?.length > 0 ? sessionData.genres[0] : "",
    gameRegion: sessionData.regions?.length > 0 ? sessionData.regions[0] : "",
    platform: sessionData.platforms?.length > 0 ? sessionData.platforms[0] : "",
    playersNeeded: sessionData.playersNeeded || 1,
    status: sessionData.status || "ongoing",
    inviteCode: sessionData.inviteCode || "",
    // Store one custom tag in the current API format
    customTags:
      sessionData.customTags?.length > 0 ? sessionData.customTags[0] : "casual",
    user: sessionData.user || "Anonymous", // Until user authentication is implemented
  };

  // Only include scheduledTime if it exists
  if (sessionData.scheduledTime) {
    apiData.scheduledTime = sessionData.scheduledTime;
  }

  // Add any image URL if provided
  if (sessionData.gameImage) {
    apiData.gameImage = sessionData.gameImage;
  }

  return apiData;
};

/**
 * Maps API response back to frontend format
 * This function handles the transformation of backend data to frontend expected format
 */
const mapApiResponseToFrontend = (apiData) => {
  // Convert the data from API format to frontend format
  const frontendData = {
    id: apiData._id || apiData.id,
    gameTitle: apiData.gameTitle,
    title: apiData.gameTitle, // For backwards compatibility
    description: apiData.requestDescription,
    // Create arrays from single values for frontend components that expect arrays
    platforms: [apiData.platform],
    genres: [apiData.gameGenre],
    regions: [apiData.gameRegion],
    customTags: [apiData.customTags],
    // Keep backward compatibility with existing fields
    platform: apiData.platform,
    gameGenre: apiData.gameGenre,
    gameRegion: apiData.gameRegion,
    playersNeeded: apiData.playersNeeded,
    maxPlayers: apiData.playersNeeded, // For compatibility with existing UI
    currentPlayers: 1, // Hardcoded for now
    inviteCode: apiData.inviteCode,
    status: apiData.status,
    user: apiData.user,
    createdAt: apiData.createdAt || new Date().toISOString(),
    // Convert backend fields to frontend expected names
    scheduledTime: apiData.scheduledTime,
    gameImage: apiData.gameImage,
  };

  return frontendData;
};

//Game sessions (request-ticket) endpoints
export const gameSessionsAPI = {
  // TEMPORARY: Basic API test function
  testApiConnection: async () => {
    try {
      console.log("Testing API connection...");
      const response = await fetch(
        "https://coneko-api.onrender.com/api/request-ticket",
        {
          headers: {
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );
      console.log("API Test Status:", response.status);
      console.log(
        "API Test Headers:",
        Object.fromEntries([...response.headers])
      );
      return response;
    } catch (error) {
      console.error("API connection test failed:", error);
      return null;
    }
  },

  //Seed data route
  seedDatabase: async () => {
    // Skip if in bypass mode
    if (BYPASS_API) {
      console.log("API bypass active - skipping seed operation");
      return { message: "Seed skipped in bypass mode" };
    }

    try {
      const response = await api.get("/api/request-ticket/seed");
      console.log("Seed response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error seeding database:", handleApiError(error));
      throw error;
    }
  },

  // Get all game sessions with retry logic
  getAllSessions: async function (retries = 3) {
    // Return mock data if in bypass mode
    if (BYPASS_API) {
      console.log("API bypass active - returning mock data");
      // Return with a slight delay to simulate network time
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockApiData.map(mapApiResponseToFrontend);
    }

    try {
      console.log("Fetching all game sessions...");
      const response = await api.get("/api/request-ticket");

      // Map all sessions to frontend format
      const mappedSessions = Array.isArray(response.data)
        ? response.data.map(mapApiResponseToFrontend)
        : [];

      return mappedSessions;
    } catch (error) {
      console.error("Error fetching sessions:", handleApiError(error));

      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        // Wait 2 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Use this.getAllSessions to reference the function correctly
        return await this.getAllSessions(retries - 1);
      }

      // Return empty array to trigger localStorage fallback
      return [];
    }
  },

  //Get a single session by ID (single request ticket)
  getSessionById: async (id) => {
    // Return mock data if in bypass mode
    if (BYPASS_API) {
      const mockSession = mockApiData.find(
        (session) => session._id === id || session._id === "mock_123"
      );
      if (mockSession) {
        return mapApiResponseToFrontend(mockSession);
      }
      throw new Error("Session not found");
    }

    try {
      const response = await api.get(`/api/request-ticket/message/${id}`);
      return mapApiResponseToFrontend(response.data);
    } catch (error) {
      console.error(`Error fetching session ${id}:`, handleApiError(error));
      throw error;
    }
  },

  //Create a new session (request-ticket)
  createSession: async (sessionData) => {
    // Return mock data if in bypass mode
    if (BYPASS_API) {
      console.log("API bypass active - creating mock session");
      // Create a new mock entry with a unique ID
      const newMockSession = {
        _id: `mock_${Date.now()}`,
        gameTitle: sessionData.gameTitle,
        requestDescription: sessionData.description || "",
        gameGenre: sessionData.genres?.length > 0 ? sessionData.genres[0] : "",
        gameRegion:
          sessionData.regions?.length > 0 ? sessionData.regions[0] : "",
        platform:
          sessionData.platforms?.length > 0 ? sessionData.platforms[0] : "",
        playersNeeded: sessionData.playersNeeded || 1,
        status: sessionData.status || "ongoing",
        inviteCode: sessionData.inviteCode || "",
        customTags:
          sessionData.customTags?.length > 0
            ? sessionData.customTags[0]
            : "casual",
        user: sessionData.user || "MockUser",
        createdAt: new Date().toISOString(),
      };

      // Add the new session to our mock data
      mockApiData.push(newMockSession);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mapApiResponseToFrontend(newMockSession);
    }

    try {
      // Convert frontend data to API format
      const apiData = mapSessionToApiFormat(sessionData);
      console.log("Creating new session with data:", apiData);

      const response = await api.post(`/api/request-ticket`, apiData);

      // Return the created session in frontend format
      return mapApiResponseToFrontend(response.data);
    } catch (error) {
      console.error("Error creating session:", handleApiError(error));
      throw error;
    }
  },

  //Update a session (request-ticket)
  updateSession: async (id, sessionData) => {
    // Mock data handling if in bypass mode
    if (BYPASS_API) {
      console.log("API bypass active - updating mock session");
      const index = mockApiData.findIndex((session) => session._id === id);
      if (index === -1) {
        throw new Error("Session not found");
      }

      // Update the mock session
      const apiData = mapSessionToApiFormat(sessionData);
      mockApiData[index] = { ...mockApiData[index], ...apiData };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return mapApiResponseToFrontend(mockApiData[index]);
    }

    try {
      // Convert frontend data to API format
      const apiData = mapSessionToApiFormat(sessionData);

      const response = await api.put(`/api/request-ticket/${id}`, apiData);

      // Return the updated session in frontend format
      return mapApiResponseToFrontend(response.data);
    } catch (error) {
      console.error(`Error updating session ${id}:`, handleApiError(error));
      throw error;
    }
  },

  //Delete a session (request-ticket)
  deleteSession: async (id) => {
    // Mock data handling if in bypass mode
    if (BYPASS_API) {
      console.log("API bypass active - deleting mock session");
      const index = mockApiData.findIndex((session) => session._id === id);
      if (index === -1) {
        throw new Error("Session not found");
      }

      // Remove the session from mock data
      const deletedSession = mockApiData.splice(index, 1)[0];

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return { message: "Session deleted successfully", deletedSession };
    }

    try {
      const response = await api.delete(`/api/request-ticket/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting session ${id}:`, handleApiError(error));
      throw error;
    }
  },
};

/**
 * Helper function to extract and format error information from API errors
 */
function handleApiError(error) {
  let errorInfo = {
    message: error.message || "Unknown error occurred",
    details: null,
  };

  if (error.response) {
    // The server responded with a status code outside the 2xx range
    errorInfo.status = error.response.status;
    errorInfo.details = error.response.data;
    errorInfo.message = `Server error: ${error.response.status} ${error.response.statusText}`;
  } else if (error.request) {
    // The request was made but no response was received
    errorInfo.message = "No response received from server";
    errorInfo.details = error.request;
  }

  return errorInfo;
}

// Run a test immediately when this module loads
// This helps verify API connection without waiting for component action
gameSessionsAPI.testApiConnection();

export default api;
