import axios from "axios";

const BASE_URL = "http://localhost:8080/api/product";

// Create axios instance with default config
const api = axios.create({
  withCredentials: true, // Required for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export const productApi = {
  // Get search recommendations
  getSearchRecommendations: async (query) => {
    try {
      const response = await api.get(
        `${BASE_URL}/search-recommendations?query=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching search recommendations:", error);
      throw error;
    }
  },

  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get(`${BASE_URL}/getAll`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
};
