import {
  FiActivity,
  FiAlertTriangle,
  FiBox,
  FiGitBranch,
} from "react-icons/fi";

const stats = [
  {
    label: "Projects",
    value: "0",
    icon: FiBox,
  },
  {
    label: "Services",
    value: "0",
    icon: FiGitBranch,
  },
  {
    label: "Active Incidents",
    value: "0",
    icon: FiAlertTriangle,
  },
  {
    label: "Recent Activity",
    value: "0",
    icon: FiActivity,
  },
];

const Dashboard = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-400">
          Engineering Overview
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Monitor your engineering workspace, services,
          projects and incidents from one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-400">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 xl:col-span-2">
          <div className="mb-5">
            <h2 className="font-semibold text-white">
              Engineering Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recent activity across your workspace.
            </p>
          </div>

          <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-slate-800">
            <div className="text-center">
              <FiActivity
                size={28}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                No activity yet
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Engineering activity will appear here.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="font-semibold text-white">
            Active Incidents
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current production incidents.
          </p>

          <div className="mt-6 flex min-h-32 items-center justify-center rounded-lg border border-dashed border-slate-800">
            <div className="text-center">
              <FiAlertTriangle
                size={26}
                className="mx-auto text-slate-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                No active incidents
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;