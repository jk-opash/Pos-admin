import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("admin_auth");
      if (authData) {
        try {
          const { token } = JSON.parse(authData);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          console.error("Failed to parse auth token", e);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

import { toast } from "react-toastify";

// Add a response interceptor to handle 401 Unauthorized globally and toasts
api.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toUpperCase();
    if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      toast.success(response.data?.message || "Operation successful");
    }
    return response;
  },
  (error) => {
    const method = error.config?.method?.toUpperCase();
    if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Operation failed";
      toast.error(errorMsg);
    }
    
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // Clear local storage auth data
        localStorage.removeItem("admin_auth");
        // Redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
