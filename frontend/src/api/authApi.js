import api from "./axios";

// =====================================================
// REGISTER
// =====================================================

export const register = async (data) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};

// =====================================================
// LOGIN
// =====================================================

export const login = async (data) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

// =====================================================
// GET CURRENT USER
// =====================================================

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");

    return response.data;
  } catch (error) {
    // 401 simply means user is not logged in.
    if (error.response?.status === 401) {
      return null;
    }

    throw error;
  }
};

// =====================================================
// LOGOUT
// =====================================================

export const logout = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};