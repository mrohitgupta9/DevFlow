import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

// =========================================================
// AUTH
// =========================================================

import AuthInitializer from "./AuthInitializer";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// =========================================================
// LAYOUT
// =========================================================

import AppLayout from "../components/layout/app/AppLayout";

// =========================================================
// PUBLIC PAGES
// =========================================================

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// =========================================================
// DASHBOARD
// =========================================================

import Dashboard from "../pages/dashboard/Dashboard";

// =========================================================
// ORGANIZATIONS
// =========================================================

import Organizations from "../pages/organizations/Organizations";
import OrganizationOverview from "../pages/organizations/OrganizationOverview";
import OrganizationSettings from "../pages/organizations/OrganizationSettings";
import Members from "../pages/organizations/Members";

// =========================================================
// PROJECTS
// =========================================================

import Projects from "../pages/projects/Projects";
import ProjectOverview from "../pages/projects/ProjectOverview";
import ProjectSettings from "../pages/projects/ProjectSettings";

// =========================================================
// SERVICES
// =========================================================

import Services from "../pages/services/Services";
import ServiceOverview from "../pages/services/ServiceOverview";
import ServiceSettings from "../pages/services/ServiceSettings";

// =========================================================
// PROTECTED APP LAYOUT
// =========================================================

const ProtectedAppLayout = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  );
};

// =========================================================
// APP ROUTER
// =========================================================

const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* ===================================================
          AUTH INITIALIZATION
      ==================================================== */}

      <AuthInitializer />

      <Routes>

        {/* =================================================
            PUBLIC
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =================================================
            AUTH
        ================================================= */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* =================================================
            PROTECTED APPLICATION
        ================================================= */}

        <Route element={<ProtectedAppLayout />}>

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* =================================================
              ORGANIZATIONS
          ================================================= */}

          <Route
            path="/organizations"
            element={<Organizations />}
          />

          <Route
            path="/organizations/:id"
            element={<OrganizationOverview />}
          />

          <Route
            path="/organizations/:id/members"
            element={<Members />}
          />

          <Route
            path="/organizations/:id/settings"
            element={<OrganizationSettings />}
          />

          {/* =================================================
              PROJECTS
          ================================================= */}

          <Route
            path="/organizations/:id/projects"
            element={<Projects />}
          />

          <Route
            path="/organizations/:id/projects/:projectId"
            element={<ProjectOverview />}
          />

          <Route
            path="/organizations/:id/projects/:projectId/settings"
            element={<ProjectSettings />}
          />

          {/* =================================================
              SERVICES
          ================================================= */}

          <Route
            path="/organizations/:id/projects/:projectId/services"
            element={<Services />}
          />

          <Route
            path="/organizations/:id/projects/:projectId/services/:serviceId"
            element={<ServiceOverview />}
          />

          <Route
            path="/organizations/:id/projects/:projectId/services/:serviceId/settings"
            element={<ServiceSettings />}
          />

        </Route>

        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;