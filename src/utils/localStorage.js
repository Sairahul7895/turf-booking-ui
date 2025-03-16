// src/utils/localStorage.js
import { jwtDecode } from "jwt-decode";
export const setToken = (response) => {
    localStorage.setItem('token', response.token);
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };

  export const getUserDetails = () => {
    const token = getToken();
    if (!token) return null;

  try {
    return jwtDecode(token); // Decodes { id, role, name }
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
  };
  
  export const clearAuthData = () => {
    localStorage.removeItem('token');
  };