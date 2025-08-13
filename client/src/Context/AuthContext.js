import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleApiError = (error) => {
    if (error.response?.data) {
      const { message, code } = error.response.data;
      return { message, code };
    }
    return { message: "Network error or server did not respond." };
  };

  const clearError = () => setAuthError(null);

  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      await axios.post(
        "http://localhost:8080/api/auth/register",
        { name, email, password },
        { withCredentials: true },
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

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        const user = response.data.data.user;
        setUser(user);
      }

      return { success: true };
    } catch (error) {
      const errorObj = handleApiError(error);
      setAuthError(errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
      localStorage.removeItem("user");
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

      return { success: true };
    } catch (error) {
      console.error("Logout failed:", error);
      return { success: false, error: handleApiError(error) };
    } finally {
      setUser(null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
