import { useEffect } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowLeft,
  FiArrowRight,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiGitBranch,
  FiLayers,
  FiPlus,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

import useOrganizationStore from "../../stores/organizationStore";

const OrganizationOverview = () => {
  const { id } = useParams();

  const {
    currentOrganization,
    isLoading,
    error,
    fetchOrganization,
    clearCurrentOrganization,
  } = useOrganizationStore();

  useEffect(() => {
    if (!id) return;

    fetchOrganization(id).catch(() => {});

    return () => {
      clearCurrentOrganization();
    };
  }, [
    id,
    fetchOrganization,
    clearCurrentOrganization,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isLoading && !currentOrganization) {
    return (
      <div className="min-h-full bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-40 rounded bg-slate-800" />

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex gap-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-800" />

                <div className="space-y-3">
                  <div className="h-6 w-56 rounded bg-slate-800" />
                  <div className="h-4 w-80 rounded bg-slate-800" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl border border-slate-800 bg-slate-900/60"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error / Not Found
  |--------------------------------------------------------------------------
  */

  if (error || !currentOrganization) {
    return (
      <div className="min-h-full bg-slate-950">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <FiAlertTriangle size={24} />
            </div>

            <h1 className="mt-5 text-lg font-semibold text-white">
              Organization unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error ||
                "The organization could not be found or you do not have access to it."}
            </p>

            <Link
              to="/organizations"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <FiArrowLeft size={16} />

              Back to organizations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const organization = currentOrganization;

  const initial =
    organization.name
      ?.charAt(0)
      ?.toUpperCase() || "D";

  const createdDate = organization.createdAt
    ? new Date(
        organization.createdAt
      ).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  |
  | These values are intentionally placeholders for now.
  | We will connect them to Projects / Services / Incidents APIs.
  |
  */

  const stats = [
    {
      label: "Projects",
      value: organization.projectCount ?? 0,
      icon: FiBox,
      iconClass:
        "bg-blue-500/10 text-blue-400",
      description: "Engineering projects",
    },
    {
      label: "Services",
      value: organization.serviceCount ?? 0,
      icon: FiLayers,
      iconClass:
        "bg-violet-500/10 text-violet-400",
      description: "Tracked services",
    },
    {
      label: "Members",
      value: organization.memberCount ?? 1,
      icon: FiUsers,
      iconClass:
        "bg-emerald-500/10 text-emerald-400",
      description: "Workspace members",
    },
    {
      label: "Incidents",
      value:
        organization.activeIncidentCount ?? 0,
      icon: FiAlertTriangle,
      iconClass:
        "bg-amber-500/10 text-amber-400",
      description: "Active incidents",
    },
  ];

  return (
    <div className="min-h-full bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =====================================================
            BREADCRUMB
        ====================================================== */}

        <div className="mb-5 flex items-center gap-2 text-xs">
          <Link
            to="/organizations"
            className="text-slate-500 transition hover:text-slate-300"
          >
            Organizations
          </Link>

          <FiArrowRight
            size={12}
            className="text-slate-700"
          />

          <span className="truncate text-slate-300">
            {organization.name}
          </span>
        </div>

        {/* =====================================================
            ORGANIZATION HEADER
        ====================================================== */}

        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          {/* Background decoration */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />

          <div className="relative p-6 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

              {/* Identity */}

              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-xl font-bold text-blue-400">
                  {initial}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
                      {organization.name}
                    </h1>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        organization.isActive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          organization.isActive
                            ? "bg-emerald-400"
                            : "bg-slate-600"
                        }`}
                      />

                      {organization.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-600">
                    /{organization.slug}
                  </p>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                    {organization.description ||
                      "Engineering workspace for managing projects, services, teams, incidents, and engineering activity."}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <FiClock size={13} />

                      Created {createdDate}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <FiGitBranch size={13} />

                      Engineering workspace
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}

              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  to="/organizations"
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-800 px-4 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <FiArrowLeft size={15} />

                  Back
                </Link>

                <Link
                  to={`/organizations/${organization._id}/settings`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-800 px-4 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <FiSettings size={15} />

                  Settings
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATS
        ====================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-white">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {stat.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="mt-6 grid gap-6 xl:grid-cols-3">

          {/* ===================================================
              QUICK ACTIONS
          ==================================================== */}

          <section className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Quick actions
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Common workspace operations
                </p>
              </div>

              <FiActivity
                size={17}
                className="text-slate-600"
              />
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2">

              {/* Project */}

              <Link
                to={`/organizations/${organization._id}/projects`}
                className="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-blue-500/30 hover:bg-slate-950"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <FiBox size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    Create project
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Start a new engineering project
                  </p>
                </div>

                <FiArrowRight
                  size={15}
                  className="text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-blue-400"
                />
              </Link>

              {/* Service */}

              <Link
                to={`/organizations/${organization._id}/services/new`}
                className="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-violet-500/30 hover:bg-slate-950"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <FiLayers size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    Add service
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Register an engineering service
                  </p>
                </div>

                <FiArrowRight
                  size={15}
                  className="text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-violet-400"
                />
              </Link>

              {/* Member */}

              <Link
                to={`/organizations/${organization._id}/members`}
                className="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-emerald-500/30 hover:bg-slate-950"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FiUsers size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    Manage members
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Invite and manage team access
                  </p>
                </div>

                <FiArrowRight
                  size={15}
                  className="text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-emerald-400"
                />
              </Link>

              {/* Incident */}

              <Link
                to={`/organizations/${organization._id}/incidents/new`}
                className="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-amber-500/30 hover:bg-slate-950"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <FiAlertTriangle size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    Create incident
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    Report an engineering incident
                  </p>
                </div>

                <FiArrowRight
                  size={15}
                  className="text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-amber-400"
                />
              </Link>
            </div>
          </section>

          {/* ===================================================
              WORKSPACE HEALTH
          ==================================================== */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="border-b border-slate-800 px-6 py-5">
              <h2 className="text-sm font-semibold text-white">
                Workspace health
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Current engineering status
              </p>
            </div>

            <div className="space-y-1 p-3">
              {[
                {
                  label: "API",
                  status: "Operational",
                },
                {
                  label: "Database",
                  status: "Operational",
                },
                {
                  label: "Redis",
                  status: "Operational",
                },
                {
                  label: "Authentication",
                  status: "Operational",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-slate-950"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                      <FiCheckCircle
                        size={14}
                        className="text-emerald-400"
                      />
                    </span>

                    <span className="text-sm text-slate-300">
                      {item.label}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-emerald-400">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* =====================================================
            ACTIVITY + MEMBERS
        ====================================================== */}

        <div className="mt-6 grid gap-6 xl:grid-cols-3">

          {/* Activity */}

          <section className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Recent activity
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Latest changes in this workspace
                </p>
              </div>

              <Link
                to={`/organizations/${organization._id}/activity`}
                className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
              >
                View all
              </Link>
            </div>

            <div className="flex min-h-52 items-center justify-center p-6">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-600">
                  <FiActivity size={20} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-300">
                  No recent activity
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  Workspace events will appear here as
                  projects, services, members, and incidents
                  change.
                </p>
              </div>
            </div>
          </section>

          {/* Members */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Team
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Workspace members
                </p>
              </div>

              <Link
                to={`/organizations/${organization._id}/members`}
                className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
              >
                Manage
              </Link>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-400">
                  O
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-300">
                    Organization owner
                  </p>

                  <p className="text-xs text-slate-600">
                    Owner
                  </p>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400">
                  Active
                </span>
              </div>

              <Link
                to={`/organizations/${organization._id}/members`}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-800 px-4 py-3 text-xs font-medium text-slate-500 transition hover:border-slate-700 hover:bg-slate-950 hover:text-slate-300"
              >
                <FiPlus size={14} />

                Invite team member
              </Link>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default OrganizationOverview;