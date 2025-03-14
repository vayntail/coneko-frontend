import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: "https://coneko-api.onrender.com",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": import.meta.env.VITE_API_KEY,
  },
});

//Debug to see if API Key is being sent
console.log("API Key present:", !!import.meta.env.VITE_API_KEY);

//Game sessions (request-ticket) endpoints
export const gameSessionsAPI = {
  //Get all game sessions
  getAllSessions: async () => {
    try {
      console.log("Making API request with headers:", {
        ...api.defaults.headers,
        "x-api-key": "[PRESENT]", // Don't log the actual key
      });

      const response = await api.get("/api/request-ticket");
      return response.data;
    } catch (error) {
      console.error("Error fetching sessions:", error);

      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }

      throw error;
    }
  },

  //Get a single session by ID (single request ticket)
  getSessionById: async (id) => {
    try {
      const response = await api.get(`/api/request-ticket/message/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching session ${id}:`, error);
      throw error;
    }
  },

  //Create a new session (request-ticket)
  createSession: async (sessionData) => {
    try {
      const response = await api.post(`/api/request-ticket`, sessionData);
      return response.data;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  },

  //Update a session (request-ticket)
  updateSession: async (id, sessionData) => {
    try {
      const response = await api.put(`/api/request-ticket/${id}`, sessionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating session ${id}:`, error);
      throw error;
    }
  },

  //Delete a session (request-ticket)
  deleteSession: async (id) => {
    try {
      const response = await api.delete(`/api/request-ticket/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting session ${id}:`, error);
      throw error;
    }
  },
};

export default api;
