import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import useAuthStore from "../stores/authStore";

const AuthInitializer = () => {
  const location = useLocation();

  const fetchCurrentUser = useAuthStore(
    (state) => state.fetchCurrentUser
  );

  useEffect(() => {
    const pathname = location.pathname;

    // =================================================
    // PUBLIC HOME
    // =================================================

    if (pathname === "/") {
      useAuthStore.setState({
        isLoading: false,
      });

      return;
    }

    // =================================================
    // PUBLIC PASSWORD ROUTES
    // =================================================

    if (
      pathname === "/forgot-password" ||
      pathname.startsWith("/reset-password/")
    ) {
      useAuthStore.setState({
        isLoading: false,
      });

      return;
    }

    // =================================================
    // AUTHENTICATION CHECK
    // =================================================

    fetchCurrentUser();
  }, [location.pathname, fetchCurrentUser]);

  return null;
};

export default AuthInitializer;