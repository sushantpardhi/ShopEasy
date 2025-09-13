import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

// User management API endpoints
const USER_API = {
  CREATE: "http://localhost:8080/api/auth/register",
  GET_ALL: "http://localhost:8080/api/user/getAll",
  UPDATE: (id) => `http://localhost:8080/api/user/update/${id}`,
  DELETE: (id) => `http://localhost:8080/api/user/delete/${id}`,
};

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify authentication status on mount and after any auth state changes
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      setLoading(true);
      try {
        // Try to get user from sessionStorage first
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (isMounted) {
            setUser(parsedUser);
          }
        }

        const response = await axios.get(
          "http://localhost:8080/api/auth/verify",
          {
            withCredentials: true,
            timeout: 5000, // Add timeout to prevent hanging
          }
        );

        // Only update state if the component is still mounted
        if (isMounted) {
          if (response.data.success) {
            setUser(response.data.data.user);
            sessionStorage.setItem(
              "user",
              JSON.stringify(response.data.data.user)
            );
          } else {
            throw new Error("Verification failed");
          }
        }
      } catch (error) {
        if (!isMounted) return;

        const storedUser = sessionStorage.getItem("user");

        // Only clear auth state for 401 responses or verification failures
        if (
          error.response?.status === 401 ||
          error.message === "Verification failed"
        ) {
          setUser(null);
          sessionStorage.removeItem("user");
        } else if (storedUser) {
          // For network/timeout errors, keep using stored user data
          setUser(JSON.parse(storedUser));
        }
        console.error("Auth verification error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifyAuth();

    // Cleanup function to prevent memory leaks and state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  const handleApiError = (error) => {
    if (error.response?.data) {
      const { message, code } = error.response.data;
      return { message, code };
    }
    return { message: "Network error or server did not respond." };
  };

  const clearError = () => setAuthError(null);

  const getAllUsers = useCallback(async () => {
    try {
      setAuthError(null);
      const response = await axios.get(USER_API.GET_ALL, {
        withCredentials: true,
      });

      if (response.data.success) {
        return { success: true, users: response.data.data.users };
      } else {
        throw new Error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      const errorObj = handleApiError(error);
      console.error("Error fetching users:", errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  });

  const createUser = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post(USER_API.CREATE, userData, {
        withCredentials: true,
      });

      if (response.data.success) {
        return { success: true, user: response.data.data.user };
      } else {
        throw new Error(response.data.message || "Failed to create user");
      }
    } catch (error) {
      const errorObj = handleApiError(error);
      console.error("Error creating user:", errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, userData) => {
    setLoading(true);
    try {
      const response = await axios.put(USER_API.UPDATE(userId), userData, {
        withCredentials: true,
      });

      if (response.data.success) {
        return { success: true, user: response.data.data.user };
      } else {
        throw new Error(response.data.message || "Failed to update user");
      }
    } catch (error) {
      const errorObj = handleApiError(error);
      console.error("Error updating user:", errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.delete(USER_API.DELETE(userId), {
        withCredentials: true,
      });

      if (response.data.success) {
        return { success: true };
      } else {
        throw new Error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      const errorObj = handleApiError(error);
      console.error("Error deleting user:", errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      await axios.post(
        "http://localhost:8080/api/auth/register",
        { name, email, password },
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

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setAuthError(null);

    // Validate input
    if (!email || !password) {
      setAuthError({ message: "Email and password are required" });
      setLoading(false);
      return {
        success: false,
        error: { message: "Email and password are required" },
      };
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          timeout: 5000, // 5 second timeout
        }
      );

      if (response.data.success) {
        const user = response.data.data.user;
        setUser(user);
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("user", JSON.stringify(user));
        }
        return { success: true, user };
      }

      // If we get here, something unexpected happened
      throw new Error("Login response was not successful");
    } catch (error) {
      const errorObj = handleApiError(error);
      setAuthError(errorObj);
      setUser(null);
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8080/api/auth/logout",
        {},
        { withCredentials: true }
      );

      setUser(null);
      sessionStorage.removeItem("user");
      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
      return { success: false, error: handleApiError(error) };
    } finally {
      setAuthError(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        register,
        login,
        logout,
        clearError,
        getAllUsers,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
