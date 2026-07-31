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

// Add a response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
