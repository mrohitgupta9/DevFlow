import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";

import useAuthStore from "../../stores/authStore";

const Register = () => {
  const navigate = useNavigate();

  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name) {
      return "Please enter your full name.";
    }

    if (name.length < 2) {
      return "Name must be at least 2 characters.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    if (!password) {
      return "Please enter a password.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      return "Please confirm your password.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setValidationError("");

    const validationMessage = validateForm();

    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch {
      // API error is already handled by authStore.
    }
  };

  const displayError = validationError || error;

  return (
    <main className="flex min-h-screen bg-slate-950">
      {/* =====================================================
          LEFT BRANDING SECTION
      ====================================================== */}

      <section className="relative hidden flex-1 overflow-hidden border-r border-slate-800 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(37,99,235,0.18),_transparent_35%)]" />

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
              Build. Deploy. Operate.
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Your engineering
              <br />
              workspace starts here.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Create your DevFlow account and organize your
              engineering workflows, teams, projects and
              services.
            </p>

            {/* Feature list */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <FiCheck size={14} />
                </span>

                Centralize engineering projects
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <FiCheck size={14} />
                </span>

                Manage services and engineering teams
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <FiCheck size={14} />
                </span>

                Track incidents and engineering activity
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
          REGISTER SECTION
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
              Create your account
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Start building your engineering workspace.
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
                NAME
            ================================================== */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full name
              </label>

              <div className="relative">
                <FiUser
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="h-11 w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

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
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <div className="relative">
                <FiLock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  minLength={8}
                  className="h-11 w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
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

              <p className="mt-2 text-xs text-slate-600">
                Use at least 8 characters.
              </p>
            </div>

            {/* =================================================
                CONFIRM PASSWORD
            ================================================== */}

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Confirm password
              </label>

              <div className="relative">
                <FiLock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  minLength={8}
                  className="h-11 w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={isLoading}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300 disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? (
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

                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* =================================================
              LOGIN
          ================================================== */}

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>

          {/* Footer */}
          <p className="mt-8 text-center text-xs leading-5 text-slate-600">
            By creating an account, you agree to the DevFlow
            terms and privacy policy.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;