import React, { createContext, useState, useEffect } from "react";
import { getToken, setToken, clearAuthData } from "../utils/localStorage";


// Create Context
export const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(getToken());

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthToken(getToken());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Function to handle login
  const login = (response) => {
    setToken(response);
    setAuthToken(response.token); // Update state immediately
  };

  // Function to handle logout
  const logout = () => {
    console.log('logout called');
    clearAuthData();
    setAuthToken(null); // Update state immediately
    window.location.href = '/login';
  };


  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
