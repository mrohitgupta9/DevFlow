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

const navigation = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: FiGrid,
        path: "/dashboard",
      },
      {
        label: "Activity",
        icon: FiActivity,
        path: "/activity",
      },
    ],
  },
  {
    label: "Engineering",
    items: [
      {
        label: "Projects",
        icon: FiBox,
        path: "/projects",
      },
      {
        label: "Services",
        icon: FiLayers,
        path: "/services",
      },
      {
        label: "Teams",
        icon: FiUsers,
        path: "/teams",
      },
      {
        label: "Incidents",
        icon: FiAlertTriangle,
        path: "/incidents",
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        label: "Organizations",
        icon: FiGitBranch,
        path: "/organizations",
      },
      {
        label: "Settings",
        icon: FiSettings,
        path: "/settings",
      },
    ],
  },
];

const Sidebar = ({ mobile = false, onClose }) => {
  const currentPath = window.location.pathname;

  return (
    <aside
      className={`flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950 ${
        mobile ? "" : "hidden lg:flex"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            D
          </div>

          <div>
            <h1 className="text-sm font-bold tracking-wide text-white">
              DevFlow
            </h1>

            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Engineering
            </p>
          </div>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Workspace */}
      <div className="border-b border-slate-800 p-4">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-left transition hover:border-slate-700 hover:bg-slate-800"
        >
          <div className="min-w-0">
            <p className="truncate text-xs text-slate-500">
              Workspace
            </p>

            <p className="truncate text-sm font-medium text-white">
              My Organization
            </p>
          </div>

          <FiChevronDown className="shrink-0 text-slate-500" size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((section) => (
          <div key={section.label} className="mb-6">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {section.label}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active =
                  currentPath === item.path ||
                  currentPath.startsWith(`${item.path}/`);

                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={mobile ? onClose : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-blue-600/10 text-blue-400"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <Icon size={17} />

                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-red-400"
        >
          <FiLogOut size={17} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;