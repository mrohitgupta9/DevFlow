import {
  FiActivity,
  FiAlertTriangle,
  FiBox,
  FiChevronDown,
  FiGitBranch,
  FiGrid,
  FiLayers,
  FiLogOut,
  FiSettings,
  FiUsers,
  FiX,
} from "react-icons/fi";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import useAuthStore from "../../../stores/authStore";
import useOrganizationStore from "../../../stores/organizationStore";
import useProjectStore from "../../../stores/projectStore";

// =========================================================
// NAVIGATION
// =========================================================

const navigation = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: FiGrid,
        type: "dashboard",
      },
      {
        label: "Activity",
        icon: FiActivity,
        type: "activity",
      },
    ],
  },
  {
    label: "Engineering",
    items: [
      {
        label: "Projects",
        icon: FiBox,
        type: "projects",
      },
      {
        label: "Services",
        icon: FiLayers,
        type: "services",
      },
      {
        label: "Teams",
        icon: FiUsers,
        type: "teams",
      },
      {
        label: "Incidents",
        icon: FiAlertTriangle,
        type: "incidents",
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        label: "Organizations",
        icon: FiGitBranch,
        type: "organizations",
      },
      {
        label: "Settings",
        icon: FiSettings,
        type: "settings",
      },
    ],
  },
];

// =========================================================
// ROUTE HELPERS
// =========================================================

const getOrganizationIdFromPath = (pathname) => {
  const match = pathname.match(
    /\/organizations\/([^/]+)/
  );

  return match?.[1] || null;
};

const getProjectIdFromPath = (pathname) => {
  const match = pathname.match(
    /\/projects\/([^/]+)/
  );

  return match?.[1] || null;
};

// =========================================================
// SIDEBAR
// =========================================================

const Sidebar = ({
  mobile = false,
  onClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // =======================================================
  // AUTH
  // =======================================================

  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  // =======================================================
  // ORGANIZATION
  // =======================================================

  const organizations = useOrganizationStore(
    (state) => state.organizations
  );

  const currentOrganization =
    useOrganizationStore(
      (state) => state.currentOrganization
    );

  // =======================================================
  // PROJECT
  // =======================================================

  const projects = useProjectStore(
    (state) => state.projects
  );

  const currentProject = useProjectStore(
    (state) => state.currentProject
  );

  // =======================================================
  // CURRENT ORGANIZATION
  // =======================================================

  const pathOrganizationId =
    getOrganizationIdFromPath(
      location.pathname
    );

  const displayOrganization =
    currentOrganization ||
    organizations?.find(
      (organization) =>
        organization._id === pathOrganizationId
    ) ||
    organizations?.[0] ||
    null;

  const organizationId =
    pathOrganizationId ||
    displayOrganization?._id ||
    null;

  // =======================================================
  // CURRENT PROJECT
  // =======================================================

  const pathProjectId =
    getProjectIdFromPath(
      location.pathname
    );

  const displayProject =
    currentProject ||
    projects?.find(
      (project) =>
        project._id === pathProjectId
    ) ||
    projects?.[0] ||
    null;

  const projectId =
    pathProjectId ||
    displayProject?._id ||
    null;

  // =======================================================
  // USER INITIAL
  // =======================================================

  const userInitial =
    user?.name
      ?.charAt(0)
      ?.toUpperCase() || "U";

  // =======================================================
  // MOBILE CLOSE
  // =======================================================

  const handleClose = () => {
    if (mobile) {
      onClose?.();
    }
  };

  // =======================================================
  // NAVIGATION HANDLER
  // =======================================================

  const handleNavigation = (type) => {
    handleClose();

    switch (type) {
      // ---------------------------------------------------
      // DASHBOARD
      // ---------------------------------------------------

      case "dashboard":
        navigate("/dashboard");
        break;

      // ---------------------------------------------------
      // ORGANIZATIONS
      // ---------------------------------------------------

      case "organizations":
        navigate("/organizations");
        break;

      // ---------------------------------------------------
      // PROJECTS
      // ---------------------------------------------------

      case "projects":
        if (organizationId) {
          navigate(
            `/organizations/${organizationId}/projects`
          );
        } else {
          navigate("/organizations");
        }
        break;

      // ---------------------------------------------------
      // SERVICES
      // ---------------------------------------------------

      case "services":
        if (
          organizationId &&
          projectId
        ) {
          navigate(
            `/organizations/${organizationId}/projects/${projectId}/services`
          );
        } else if (organizationId) {
          navigate(
            `/organizations/${organizationId}/projects`
          );
        } else {
          navigate("/organizations");
        }
        break;

      // ---------------------------------------------------
      // TEAMS
      // ---------------------------------------------------

      case "teams":
        if (organizationId) {
          navigate(
            `/organizations/${organizationId}/members`
          );
        } else {
          navigate("/organizations");
        }
        break;

      // ---------------------------------------------------
      // ACTIVITY
      // ---------------------------------------------------

      case "activity":
        /*
         * Activity page is not yet present in the
         * current router.
         *
         * For now open the current workspace instead
         * of navigating to a non-existing route.
         */
        if (organizationId) {
          navigate(
            `/organizations/${organizationId}`
          );
        } else {
          navigate("/dashboard");
        }
        break;

      // ---------------------------------------------------
      // INCIDENTS
      // ---------------------------------------------------

      case "incidents":
        /*
         * Incident module is not yet present in the
         * current router.
         *
         * Temporary safe destination.
         */
        if (organizationId) {
          navigate(
            `/organizations/${organizationId}`
          );
        } else {
          navigate("/dashboard");
        }
        break;

      // ---------------------------------------------------
      // SETTINGS
      // ---------------------------------------------------

      case "settings":
        /*
         * Global /settings does not currently exist.
         *
         * Organization settings does.
         */
        if (organizationId) {
          navigate(
            `/organizations/${organizationId}/settings`
          );
        } else {
          navigate("/organizations");
        }
        break;

      default:
        navigate("/dashboard");
    }
  };

  // =======================================================
  // LOGOUT
  // =======================================================

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      handleClose();

      navigate("/login", {
        replace: true,
      });
    }
  };

  // =======================================================
  // ACTIVE STATE
  // =======================================================

  const isItemActive = (type) => {
    const pathname = location.pathname;

    switch (type) {
      case "dashboard":
        return pathname === "/dashboard";

      case "organizations":
        return (
          pathname === "/organizations" ||
          pathname.startsWith(
            "/organizations/"
          ) &&
          !pathname.includes("/projects")
        );

      case "projects":
        return pathname.includes(
          "/projects"
        ) && !pathname.includes("/services");

      case "services":
        return pathname.includes(
          "/services"
        );

      case "teams":
        return pathname.includes(
          "/members"
        );

      case "settings":
        return pathname.includes(
          "/settings"
        );

      case "activity":
        return pathname === "/activity";

      case "incidents":
        return pathname.startsWith(
          "/incidents"
        );

      default:
        return false;
    }
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <aside
      className={`flex h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 ${
        mobile ? "" : "hidden lg:flex"
      }`}
    >
      {/* ===================================================
          BRAND
      ==================================================== */}

      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5">
        <button
          type="button"
          onClick={() => {
            handleClose();
            navigate("/dashboard");
          }}
          className="flex items-center gap-3 rounded-lg outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-blue-500/50"
          aria-label="Go to DevFlow dashboard"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-950/30">
            D
          </div>

          <div className="text-left">
            <h1 className="text-sm font-bold tracking-wide text-white">
              DevFlow
            </h1>

            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Engineering
            </p>
          </div>
        </button>

        {mobile && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* ===================================================
          WORKSPACE
      ==================================================== */}

      <div className="border-b border-slate-800 p-4">
        <button
          type="button"
          onClick={() => {
            handleClose();
            navigate("/organizations");
          }}
          aria-label="Open organizations"
          className="group flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-left transition hover:border-slate-700 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <FiGitBranch size={15} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Workspace
              </p>

              <p className="mt-0.5 truncate text-sm font-medium text-white">
                {displayOrganization?.name ||
                  "My Organization"}
              </p>
            </div>
          </div>

          <FiChevronDown
            size={16}
            className="shrink-0 text-slate-500 transition group-hover:text-slate-300"
          />
        </button>
      </div>

      {/* ===================================================
          NAVIGATION
      ==================================================== */}

      <nav
        aria-label="Primary navigation"
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        {navigation.map((section) => (
          <div
            key={section.label}
            className="mb-6 last:mb-0"
          >
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              {section.label}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                const isActive =
                  isItemActive(item.type);

                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() =>
                      handleNavigation(
                        item.type
                      )
                    }
                    className={[
                      "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-150",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                      isActive
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white",
                    ].join(" ")}
                  >
                    {/* Active indicator */}

                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-blue-500" />
                    )}

                    <Icon
                      size={17}
                      className={
                        isActive
                          ? "text-blue-400"
                          : "text-slate-500 transition-colors group-hover:text-slate-300"
                      }
                    />

                    <span className="flex-1 truncate">
                      {item.label}
                    </span>

                    {isActive && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400 shadow-sm shadow-blue-500/50" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ===================================================
          CURRENT CONTEXT
      ==================================================== */}

      {(displayOrganization ||
        displayProject) && (
        <div className="border-t border-slate-800 px-3 py-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Current workspace
              </span>
            </div>

            <p className="mt-2 truncate text-xs font-medium text-slate-300">
              {displayOrganization?.name ||
                "Organization"}
            </p>

            {displayProject && (
              <p className="mt-1 truncate text-[11px] text-slate-600">
                Project: {displayProject.name}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ===================================================
          USER AREA
      ==================================================== */}

      <div className="shrink-0 border-t border-slate-800 p-3">
        <button
          type="button"
          onClick={() => {
            handleClose();

            /*
             * Profile page doesn't exist yet.
             * Send user to organization settings
             * until profile settings are implemented.
             */
            if (organizationId) {
              navigate(
                `/organizations/${organizationId}/settings`
              );
            } else {
              navigate("/organizations");
            }
          }}
          className="mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-slate-900"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300">
            {userInitial}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-200">
              {user?.name || "User"}
            </p>

            <p className="truncate text-xs capitalize text-slate-600">
              {user?.role || "Developer"}
            </p>
          </div>

          <FiSettings
            size={14}
            className="text-slate-600"
          />
        </button>

        {/* Sign out */}

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30"
        >
          <FiLogOut size={17} />

          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;