import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const timeout = import.meta.env.VITE_API_TIMEOUT || 30000;

const api = axios.create({
  baseURL,
  timeout,
  headers: {
    Accept: "application/json", // giữ, JSON hoặc FormData Axios sẽ tự set Content-Type
  },
});

// Request interceptor: add token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Nếu gửi FormData, không override Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle general errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error);

    // Logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
