import axios from "axios";
import { getToken, clearAuthData } from "../utils/localStorage";

const api = axios.create({
    // baseURL: "http://localhost:8080/api", // Your API base URL
    baseURL: "https://turf-booking-api.onrender.com/api"
});

api.interceptors.request.use(
    (config) => {
        const token = getToken();
        console.log('token : ', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('sdbsjadbjs')
            alert("Session expired. Please log in again.");
            clearAuthData();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;