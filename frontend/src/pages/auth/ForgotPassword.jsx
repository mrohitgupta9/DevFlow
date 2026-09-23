import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";

const ForgotPassword = () => {
  const handleSubmit = (event) => {
    event.preventDefault();

    // Password reset API will be connected later.
    console.log("Forgot password submitted");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
            D
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Enter your email address and we'll send you a
              password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  required
                  className="h-11 w-full rounded-lg border border-slate-800 bg-slate-950 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-500 active:bg-blue-700"
            >
              Send reset link
            </button>
          </form>

          <Link
            to="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <FiArrowLeft size={16} />
            Back to login
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          DevFlow Engineering Platform
        </p>
      </div>
    </main>
  );
};

export default ForgotPassword;