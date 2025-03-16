// src/services/authService.js
import api from "../utils/api";

const API_URL = 'http://localhost:8080/api/auth';

export const signup = async (userData) => {
  const response = await api.post(`${API_URL}/signup`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post(`${API_URL}/login`, userData);
  return response.data;
};