import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../../../stores/authStore";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [searchValue, setSearchValue] =
    useState("");

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() ||
    "U";

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", {
        replace: true,
      });
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) return;

    console.log(
      "DevFlow search:",
      query
    );
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    const handleKeyboard = (event) => {
      const target = event.target;

      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement;

      if (
        event.key === "/" &&
        !isTyping
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (
        event.key === "Escape"
      ) {
        setProfileOpen(false);
        searchRef.current?.blur();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur-xl sm:px-6">
      {/* =====================================================
          LEFT
      ====================================================== */}

      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu */}

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <FiMenu size={20} />
        </button>

        {/* Search */}

        <form
          onSubmit={handleSearch}
          className="relative hidden md:block"
        >
          <FiSearch
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            ref={searchRef}
            type="search"
            value={searchValue}
            onChange={(event) =>
              setSearchValue(
                event.target.value
              )
            }
            placeholder="Search projects, services..."
            aria-label="Search DevFlow"
            className="h-9 w-64 rounded-lg border border-slate-800 bg-slate-900 pl-9 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/10 lg:w-72"
          />

          <span className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 lg:block">
            /
          </span>
        </form>
      </div>

      {/* =====================================================
          RIGHT
      ====================================================== */}

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Mobile search */}

        <button
          type="button"
          aria-label="Search"
          onClick={() =>
            searchRef.current?.focus()
          }
          className="rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
        >
          <FiSearch size={18} />
        </button>

        {/* Notifications */}

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <FiBell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-slate-950" />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-slate-800 sm:block" />

        {/* =================================================
            PROFILE
        ================================================== */}

        <div
          ref={profileRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                (current) => !current
              )
            }
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300">
              {userInitial}
            </div>

            <div className="hidden max-w-32 text-left sm:block">
              <p className="truncate text-xs font-medium text-white">
                {user?.name || "Developer"}
              </p>

              <p className="truncate text-[10px] capitalize text-slate-500">
                {user?.role || "developer"}
              </p>
            </div>

            <FiChevronDown
              size={14}
              className={`hidden text-slate-500 transition sm:block ${
                profileOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {/* Profile dropdown */}

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/30">
              {/* User info */}

              <div className="border-b border-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-300">
                    {userInitial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {user?.name ||
                        "Developer"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user?.email ||
                        "devflow"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium capitalize text-blue-400">
                  {user?.role ||
                    "developer"}
                </div>
              </div>

              {/* Menu */}

              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate(
                      "/settings/profile"
                    );
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <FiUser size={16} />

                  <span>
                    Profile
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate(
                      "/settings"
                    );
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <FiSettings size={16} />

                  <span>
                    Settings
                  </span>
                </button>
              </div>

              {/* Logout */}

              <div className="border-t border-slate-800 p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <FiLogOut size={16} />

                  <span>
                    Sign out
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;