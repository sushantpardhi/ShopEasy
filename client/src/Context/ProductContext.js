import { createContext, useState } from "react";
import axios from "axios";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleApiError = (error) => {
    if (error.response?.data) {
      const { message, code } = error.response.data;
      return { message, code };
    }
    return { message: "Network error or server did not respond." };
  };

  const clearError = () => setAuthError(null);

  const addProduct = async (name, price, description, category, stock) => {
    setLoading(true);
    setAuthError(null);
    try {
      await axios.post(
        "http://localhost:8080/api/product/add",
        { name, price, description, category, stock },
        { withCredentials: true }
      );
      return { success: true };
    } catch (error) {
      const errorObj = handleApiError(error);
      setAuthError(errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  };

  const getAllProducts = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/product/getAll",
        {
          withCredentials: true,
          // Add error handling for network timeouts
          timeout: 5000,
        }
      );

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.products)
      ) {
        setProduct(response.data.data.products);
        return {
          success: true,
          products: {
            data: {
              products: response.data.data.products,
            },
          },
        };
      } else {
        console.error("Invalid product data format:", response.data);
        return {
          success: false,
          error: { message: "Invalid data format received from server" },
        };
      }
    } catch (error) {
      // Don't clear auth state for network errors or timeouts
      if (error.response?.status === 401) {
        const errorObj = handleApiError(error);
        setAuthError(errorObj);
        return { success: false, error: errorObj };
      } else {
        // For non-auth errors, just return the error without affecting auth state
        console.error("Product fetch error:", error);
        return {
          success: false,
          error: {
            message: error.message || "Failed to fetch products",
          },
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, updateData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/product/update/${productId}`,
        updateData,
        { withCredentials: true, timeout: 5000 }
      );

      if (response.data && response.data.success) {
        // Update the local product state if needed
        const updatedProducts = product.map((p) =>
          p._id === productId ? { ...p, ...updateData } : p
        );
        setProduct(updatedProducts);
        return { success: true, product: response.data.data.product };
      } else {
        return {
          success: false,
          error: { message: "Failed to update product" },
        };
      }
    } catch (error) {
      const errorObj = handleApiError(error);
      if (error.response?.status === 401) {
        setAuthError(errorObj);
      }
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/product/delete/${productId}`,
        { withCredentials: true, timeout: 5000 }
      );

      if (response.data && response.data.success) {
        // Update the local product state
        const filteredProducts = product.filter((p) => p._id !== productId);
        setProduct(filteredProducts);
        return { success: true };
      } else {
        return {
          success: false,
          error: { message: "Failed to delete product" },
        };
      }
    } catch (error) {
      const errorObj = handleApiError(error);
      if (error.response?.status === 401) {
        setAuthError(errorObj);
      }
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        addProduct,
        getAllProducts,
        updateProduct,
        deleteProduct,
        loading,
        authError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
