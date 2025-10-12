import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const timeout = import.meta.env.VITE_API_TIMEOUT || 30000;

const api = axios.create({
  baseURL,
  timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//  Interceptor for request (add token if any)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for response (general error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error);

    // If you get 401, log out or redirect.
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
