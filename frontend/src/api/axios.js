import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";

    const requestUrl = error.config?.url || "";

    // /auth/me returning 401 simply means
    // the user is not authenticated.
    const isUnauthenticated =
      requestUrl === "/auth/me" &&
      status === 401;

    if (!isUnauthenticated) {
      console.error("API Error:", message);
    }

    return Promise.reject(error);
  }
);

export default api;