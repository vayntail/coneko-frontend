import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: "https://coneko-api.onrender.com",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
});

//Debug to see if API Key is being sent
console.log("API Key present:", !!import.meta.env.VITE_API_KEY);

//Game sessions (request-ticket) endpoints
export const gameSessionsAPI = {
  //Seed data route
  seedDatabase: async () => {
    try {
      const response = await api.get("/request-ticket/seed");
      console.log("Seed response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error seeding database:", error);
      throw error;
    }
  },

  //  getAllSessions function (get all request-tickets)
  getAllSessions: async () => {
    try {
      console.log("Making API request...");
      const response = await api.get("/request-ticket");
      console.log("Raw API Response:", response);
      console.log("Response data type:", typeof response.data);
      console.log("Response data:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  },

  //Get a single session by ID (single request ticket)
  getSessionById: async (id) => {
    try {
      const response = await api.get(`/request-ticket/message/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching session ${id}:`, error);
      throw error;
    }
  },

  //Create a new session (request-ticket)
  createSession: async (sessionData) => {
    try {
      const response = await api.post(`/request-ticket`, sessionData);
      return response.data;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  },

  //Update a session (request-ticket)
  updateSession: async (id, sessionData) => {
    try {
      const response = await api.put(`/request-ticket/${id}`, sessionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating session ${id}:`, error);
      throw error;
    }
  },

  //Delete a session (request-ticket)
  deleteSession: async (id) => {
    try {
      const response = await api.delete(`/request-ticket/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting session ${id}:`, error);
      throw error;
    }
  },
};

export default api;
