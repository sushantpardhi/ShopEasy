import React, { createContext, useState, useEffect, useCallback } from "react";
import { categoryApi } from "../api/categoryApi";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [rootCategories, setRootCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch all categories
  const fetchCategories = useCallback(async (includeChildren = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryApi.getAllCategories(includeChildren);
      if (response && response.data) {
        setCategories(response.data.categories);
        return response.data;
      } else {
        setError("Invalid response format");
        return null;
      }
    } catch (err) {
      console.error("Error fetching categories:", err); // Debug log
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch root categories
  const fetchRootCategories = useCallback(async (includeChildren = true) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryApi.getRootCategories(includeChildren);
      if (response.success) {
        setRootCategories(response.data.categories);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get category by ID
  const getCategoryById = useCallback(async (id, includeChildren = true) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryApi.getCategoryById(id, includeChildren);
      if (response.success) {
        setSelectedCategory(response.data.category);
        return response.data.category;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get category ancestors
  const getCategoryAncestors = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryApi.getCategoryAncestors(id);
      if (response.success) {
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get category children
  const getCategoryChildren = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoryApi.getCategoryChildren(id);
      if (response.success) {
        return response.data.categories;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create category (admin only)
  const createCategory = useCallback(
    async (categoryData) => {
      try {
        setLoading(true);
        setError(null);
        const response = await categoryApi.createCategory(categoryData);
        if (response.success) {
          await fetchCategories(true); // Refresh categories after creation
          return response.data.category;
        } else {
          setError(response.message);
          return null;
        }
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories]
  );

  // Update category (admin only)
  const updateCategory = useCallback(
    async (id, categoryData) => {
      try {
        setLoading(true);
        setError(null);
        const response = await categoryApi.updateCategory(id, categoryData);
        if (response.success) {
          await fetchCategories(true); // Refresh categories after update
          return response.data.category;
        } else {
          setError(response.message);
          return null;
        }
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories]
  );

  // Delete category (admin only)
  const deleteCategory = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        const response = await categoryApi.deleteCategory(id);
        if (response.success) {
          await fetchCategories(true); // Refresh categories after deletion
          return true;
        } else {
          setError(response.message);
          return false;
        }
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories]
  );

  // Load initial data
  useEffect(() => {
    fetchRootCategories();
  }, [fetchRootCategories]);

  const value = {
    categories,
    rootCategories,
    selectedCategory,
    loading,
    error,
    fetchCategories,
    fetchRootCategories,
    getCategoryById,
    getCategoryAncestors,
    getCategoryChildren,
    createCategory,
    updateCategory,
    deleteCategory,
    setSelectedCategory,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
