import axios from "axios";

const BASE_URL = "http://localhost:8080/api/category";

// Create axios instance with default config
const api = axios.create({
  withCredentials: true, // Required for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export const categoryApi = {
  // Get all categories with optional children
  getAllCategories: async (includeChildren = false) => {
    try {
      console.log(
        "Making API request to:",
        `${BASE_URL}/getAll?includeChildren=${includeChildren}`
      );
      const response = await api.get(
        `${BASE_URL}/getAll?includeChildren=${includeChildren}`
      );
      console.log("Raw API response:", response);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response || error);
      throw error;
    }
  },

  // Get root categories
  getRootCategories: async (includeChildren = false) => {
    const response = await api.get(
      `${BASE_URL}/root?includeChildren=${includeChildren}`
    );
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id, includeChildren = false) => {
    const response = await api.get(
      `${BASE_URL}/${id}?includeChildren=${includeChildren}`
    );
    return response.data;
  },

  // Get category ancestors
  getCategoryAncestors: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}/ancestors`);
    return response.data;
  },

  // Get category children
  getCategoryChildren: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}/children`);
    return response.data;
  },

  // Create new category (admin only)
  createCategory: async (categoryData) => {
    const response = await api.post(BASE_URL, categoryData);
    return response.data;
  },

  // Update category (admin only)
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`${BASE_URL}/${id}`, categoryData);
    return response.data;
  },

  // Delete category (admin only)
  deleteCategory: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
