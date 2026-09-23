import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";

import useAuthStore from "../../stores/authStore";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [validationError, setValidationError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (validationError) {
      setValidationError("");
    }

    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setValidationError("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setValidationError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      await login({
        email,
        password,
      });

      const redirectPath =
        location.state?.from?.pathname || "/dashboard";

      navigate(redirectPath, {
        replace: true,
      });
    } catch {
      // Error is already stored inside authStore.
    }
  };

  const displayError = validationError || error;

  return (
    <main className="flex min-h-screen bg-slate-950">
      {/* =====================================================
          LEFT BRANDING SECTION
      ====================================================== */}

      <section className="relative hidden flex-1 overflow-hidden border-r border-slate-800 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_35%)]" />

        <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
                D
              </div>

              <div>
                <p className="font-bold text-white">
                  DevFlow
                </p>

                <p className="text-xs text-slate-500">
                  Engineering Platform
                </p>
              </div>
            </div>
          </div>

          {/* Main message */}
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-blue-400">
              Engineering Workflow
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Ship better software.
              <br />
              Operate with confidence.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              DevFlow brings projects, services, teams, incidents
              and engineering activity into one centralized
              workspace.
            </p>

            {/* Feature indicators */}
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <p className="text-sm font-semibold text-white">
                  Projects
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Centralized
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <p className="text-sm font-semibold text-white">
                  Services
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Connected
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <p className="text-sm font-semibold text-white">
                  Incidents
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Observable
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-600">
            DevFlow Engineering Platform
          </p>
        </div>
      </section>

      {/* =====================================================
          LOGIN SECTION
      ====================================================== */}

      <section className="flex w-full items-center justify-center px-5 py-10 lg:w-[480px] xl:w-[520px]">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              D
            </div>

            <div>
              <p className="font-bold text-white">
                DevFlow
              </p>

              <p className="text-xs text-slate-500">
                Engineering Platform
              </p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Sign in to your DevFlow workspace.
            </p>
          </div>

          {/* Error */}
          {displayError && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-400"
            >
              {displayError}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* =================================================
                EMAIL
            ================================================== */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>

              <div className="relative">
                <FiMail
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="h-11 w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* =================================================
                PASSWORD
            ================================================== */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <FiLock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="h-11 w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  disabled={isLoading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <FiEyeOff size={17} />
                  ) : (
                    <FiEye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 active:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* =================================================
              REGISTER
          ================================================== */}

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Create one
            </Link>
          </p>

          {/* Footer */}
          <p className="mt-8 text-center text-xs leading-5 text-slate-600">
            By continuing, you agree to the DevFlow terms and
            privacy policy.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;