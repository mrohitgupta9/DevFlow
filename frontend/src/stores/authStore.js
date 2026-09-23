import { create } from "zustand";

import {
  getCurrentUser,
  login,
  logout,
  register,
} from "../api/authApi";

const useAuthStore = create((set) => ({
  // =====================================================
  // STATE
  // =====================================================

  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // =====================================================
  // REGISTER
  // =====================================================

  register: async (data) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await register(data);

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // =====================================================
  // LOGIN
  // =====================================================

  login: async (data) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await login(data);

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // =====================================================
  // CURRENT USER
  // =====================================================

  fetchCurrentUser: async () => {
    try {
      const response = await getCurrentUser();

      // No authentication cookie.
      if (!response) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });

        return null;
      }

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response.user;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      return null;
    }
  },

  // =====================================================
  // LOGOUT
  // =====================================================

  logout: async () => {
    try {
      await logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  clearError: () => {
    set({
      error: null,
    });
  },
}));

export default useAuthStore;