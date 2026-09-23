import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiBox,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiGitBranch,
  FiLayers,
  FiPlus,
  FiServer,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";

import useOrganizationStore from "../../stores/organizationStore";
import useProjectStore from "../../stores/projectStore";
import useServiceStore from "../../stores/serviceStore";

const Dashboard = () => {
  // =========================================================
  // STORES
  // =========================================================

  const {
    organizations,
    currentOrganization,
    isLoading: organizationLoading,
    error: organizationError,
    fetchOrganizations,
  } = useOrganizationStore();

  const {
    projects,
    isLoading: projectLoading,
    error: projectError,
    fetchProjects,
  } = useProjectStore();

  const {
    services,
    isLoading: serviceLoading,
    error: serviceError,
    fetchServices,
  } = useServiceStore();

  // =========================================================
  // CURRENT WORKSPACE
  // =========================================================

  const organization = useMemo(() => {
    return (
      currentOrganization ||
      organizations?.[0] ||
      null
    );
  }, [currentOrganization, organizations]);

  const organizationId = organization?._id;

  // =========================================================
  // LOAD ORGANIZATIONS
  // =========================================================

  useEffect(() => {
    if (!organizations?.length) {
      fetchOrganizations();
    }
  }, [organizations?.length, fetchOrganizations]);

  // =========================================================
  // LOAD PROJECTS
  // =========================================================

  useEffect(() => {
    if (!organizationId) return;

    fetchProjects(organizationId);
  }, [organizationId, fetchProjects]);

  // =========================================================
  // LOAD SERVICES
  // =========================================================

  useEffect(() => {
    if (!organizationId || !projects?.length) return;

    const firstProject = projects[0];

    if (!firstProject?._id) return;

    fetchServices(
      organizationId,
      firstProject._id
    );
  }, [
    organizationId,
    projects,
    fetchServices,
  ]);

  // =========================================================
  // DERIVED DATA
  // =========================================================

  const projectCount = projects?.length || 0;

  const serviceCount = services?.length || 0;

  const activeProjectCount =
    projects?.filter(
      (project) => project.status === "active"
    ).length || 0;

  const activeServiceCount =
    services?.filter(
      (service) => service.status === "active"
    ).length || 0;

  const archivedProjectCount =
    projects?.filter(
      (project) => project.status === "archived"
    ).length || 0;

  const inactiveServiceCount =
    services?.filter(
      (service) => service.status !== "active"
    ).length || 0;

  const firstProject = projects?.[0] || null;

  const isLoading =
    organizationLoading ||
    projectLoading ||
    serviceLoading;

  const error =
    organizationError ||
    projectError ||
    serviceError;

  // =========================================================
  // ROUTES
  // =========================================================

  const projectsRoute = organizationId
    ? `/organizations/${organizationId}/projects`
    : "/organizations";

  const servicesRoute =
    organizationId && firstProject?._id
      ? `/organizations/${organizationId}/projects/${firstProject._id}/services`
      : projectsRoute;

  const membersRoute = organizationId
    ? `/organizations/${organizationId}/members`
    : "/organizations";

  // =========================================================
  // STATS
  // =========================================================

  const stats = [
    {
      label: "Projects",
      value: projectCount,
      description:
        projectCount === 0
          ? "No projects created yet"
          : `${activeProjectCount} active project${
              activeProjectCount === 1 ? "" : "s"
            }`,
      icon: FiBox,
      href: projectsRoute,
    },
    {
      label: "Services",
      value: serviceCount,
      description:
        serviceCount === 0
          ? "No services registered yet"
          : `${activeServiceCount} active service${
              activeServiceCount === 1 ? "" : "s"
            }`,
      icon: FiServer,
      href: servicesRoute,
    },
    {
      label: "Active Incidents",
      value: "—",
      description: "Incident monitoring not configured",
      icon: FiAlertTriangle,
      href: null,
    },
    {
      label: "Activity",
      value: "—",
      description: "Audit activity will appear here",
      icon: FiActivity,
      href: null,
    },
  ];

  // =========================================================
  // QUICK ACTIONS
  // =========================================================

  const quickActions = [
    {
      title: "Create project",
      description:
        "Start a new engineering project",
      icon: FiBox,
      href: projectsRoute,
      disabled: !organizationId,
    },
    {
      title: "Add service",
      description:
        firstProject
          ? `Register a service in ${firstProject.name}`
          : "Create a project before adding services",
      icon: FiServer,
      href: servicesRoute,
      disabled:
        !organizationId ||
        !firstProject?._id,
    },
    {
      title: "Manage team",
      description:
        "Invite and manage organization members",
      icon: FiUsers,
      href: membersRoute,
      disabled: !organizationId,
    },
    {
      title: "Manage workspace",
      description:
        "Configure your organization settings",
      icon: FiGitBranch,
      href: organizationId
        ? `/organizations/${organizationId}`
        : "/organizations",
      disabled: false,
    },
  ];

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (isLoading && !organization) {
    return (
      <div className="min-h-full bg-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error && !organization) {
    return (
      <div className="min-h-full bg-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <FiAlertTriangle size={22} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-white">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchOrganizations()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Try again
              <FiArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // NO ORGANIZATION
  // =========================================================

  if (!organization) {
    return (
      <div className="min-h-full bg-slate-950 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <FiGitBranch size={24} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              Create your first workspace
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              DevFlow uses organizations as engineering
              workspaces. Create one to start managing
              projects, services and team members.
            </p>

            <Link
              to="/organizations"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Open organizations
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN DASHBOARD
  // =========================================================

  return (
    <div className="min-h-full bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                <FiZap size={14} />

                <span>
                  Engineering Overview
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Monitor your engineering workspace,
                projects and services from one central
                control plane.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/organizations"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                <FiGitBranch size={16} />
                Workspaces
              </Link>

              <Link
                to={projectsRoute}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
              >
                <FiPlus size={16} />
                New project
              </Link>
            </div>
          </div>
        </div>

        {/* ===================================================
            WORKSPACE BANNER
        ==================================================== */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                  <FiGitBranch size={21} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Current workspace
                  </p>

                  <h2 className="mt-1 truncate text-lg font-semibold text-white">
                    {organization.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {organization.description ||
                      "Your engineering workspace"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Workspace active
                </div>

                <Link
                  to={`/organizations/${organization._id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 transition hover:text-blue-300"
                >
                  Manage workspace
                  <FiArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            STATS
        ==================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            const content = (
              <div
                className={`group h-full rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition ${
                  stat.href
                    ? "hover:border-slate-700 hover:bg-slate-900"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-400">
                      {stat.label}
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                      {stat.value}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {stat.description}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-500/10 bg-blue-500/10 p-3 text-blue-400 transition group-hover:bg-blue-500/15">
                    <Icon size={20} />
                  </div>
                </div>

                {stat.href && (
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-600 transition group-hover:text-blue-400">
                    Open
                    <FiArrowRight size={12} />
                  </div>
                )}
              </div>
            );

            return stat.href ? (
              <Link
                key={stat.label}
                to={stat.href}
              >
                {content}
              </Link>
            ) : (
              <div key={stat.label}>
                {content}
              </div>
            );
          })}
        </div>

        {/* ===================================================
            MAIN GRID
        ==================================================== */}

        <div className="mt-6 grid gap-6 xl:grid-cols-3">

          {/* -----------------------------------------------
              PROJECTS / SERVICES OVERVIEW
          ------------------------------------------------ */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 xl:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FiLayers
                    size={18}
                    className="text-blue-400"
                  />

                  <h2 className="font-semibold text-white">
                    Engineering workspace
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Projects and services currently registered
                  in this workspace.
                </p>
              </div>

              <Link
                to={projectsRoute}
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 transition hover:text-white"
              >
                View projects
                <FiArrowRight size={14} />
              </Link>
            </div>

            {projectCount === 0 ? (
              <div className="mt-6 flex min-h-56 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/30">
                <div className="max-w-sm px-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-600">
                    <FiBox size={22} />
                  </div>

                  <h3 className="mt-4 text-sm font-medium text-slate-300">
                    No projects yet
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-600">
                    Create your first project to start
                    organizing engineering services.
                  </p>

                  <Link
                    to={projectsRoute}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
                  >
                    Create project
                    <FiArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {projects.slice(0, 4).map((project) => {
                  const projectServices =
                    project._id === firstProject?._id
                      ? services
                      : [];

                  return (
                    <Link
                      key={project._id}
                      to={`/organizations/${organizationId}/projects/${project._id}`}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/30 p-4 transition hover:border-slate-700 hover:bg-slate-800/40"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-blue-400">
                          <FiBox size={18} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-slate-200">
                              {project.name}
                            </p>

                            <span
                              className={`hidden rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline-flex ${
                                project.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-amber-500/10 text-amber-400"
                              }`}
                            >
                              {project.status}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs text-slate-600">
                            {project.description ||
                              "No project description"}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        {project._id === firstProject?._id && (
                          <span className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
                            <FiServer size={13} />
                            {projectServices?.length || 0}
                          </span>
                        )}

                        <FiChevronRight
                          size={16}
                          className="text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
                        />
                      </div>
                    </Link>
                  );
                })}

                {projectCount > 4 && (
                  <Link
                    to={projectsRoute}
                    className="flex items-center justify-center rounded-xl border border-dashed border-slate-800 py-3 text-xs font-medium text-slate-500 transition hover:border-slate-700 hover:text-slate-300"
                  >
                    View all {projectCount} projects
                    <FiArrowRight
                      size={13}
                      className="ml-1.5"
                    />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* -----------------------------------------------
              INCIDENT STATUS
          ------------------------------------------------ */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-white">
                  Incident status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Production reliability overview.
                </p>
              </div>

              <div className="rounded-lg bg-slate-800 p-2 text-slate-500">
                <FiAlertTriangle size={18} />
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/30 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-500">
                  <FiActivity size={19} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Incident monitoring
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Incident management is not configured
                    yet.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/20 px-4 py-3">
              <p className="text-xs leading-5 text-slate-500">
                Once the incident system is connected,
                active incidents, severity and affected
                services will appear here.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            LOWER GRID
        ==================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* -----------------------------------------------
              QUICK ACTIONS
          ------------------------------------------------ */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="font-semibold text-white">
                Quick actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Common engineering workflows.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon;

                const card = (
                  <div
                    className={`group rounded-xl border border-slate-800 bg-slate-950/30 p-4 transition ${
                      action.disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <Icon size={17} />
                      </div>

                      <FiArrowRight
                        size={15}
                        className="text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-slate-400"
                      />
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-200">
                      {action.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {action.description}
                    </p>
                  </div>
                );

                if (action.disabled) {
                  return (
                    <div
                      key={action.title}
                      title="This action requires a workspace/project"
                    >
                      {card}
                    </div>
                  );
                }

                return (
                  <Link
                    key={action.title}
                    to={action.href}
                  >
                    {card}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* -----------------------------------------------
              SYSTEM STATUS
          ------------------------------------------------ */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-white">
                  Platform status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  DevFlow application infrastructure.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Online
              </div>
            </div>

            <div className="divide-y divide-slate-800">
              {[
                {
                  label: "Frontend",
                  status: "Operational",
                },
                {
                  label: "Backend API",
                  status: "Operational",
                },
                {
                  label: "Database",
                  status: "Connected",
                },
                {
                  label: "Redis",
                  status: "Connected",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />

                    <span className="text-sm text-slate-300">
                      {item.label}
                    </span>
                  </div>

                  <span className="text-xs text-emerald-400">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
              <FiShield
                size={16}
                className="mt-0.5 shrink-0 text-slate-500"
              />

              <p className="text-xs leading-5 text-slate-500">
                Infrastructure health will be connected
                to live monitoring and service health checks
                in the monitoring phase.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            WORKSPACE SUMMARY
        ==================================================== */}

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FiLayers size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Workspace summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current engineering resources in{" "}
                  <span className="text-slate-300">
                    {organization.name}
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <SummaryMetric
                label="Projects"
                value={projectCount}
              />

              <SummaryMetric
                label="Services"
                value={serviceCount}
              />

              <SummaryMetric
                label="Inactive"
                value={
                  archivedProjectCount +
                  inactiveServiceCount
                }
              />
            </div>
          </div>
        </div>

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <div className="mt-6 flex flex-col gap-2 border-t border-slate-800 pt-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <FiClock size={13} />

            <span>
              DevFlow workspace data is loaded from your
              backend API.
            </span>
          </div>

          <Link
            to={`/organizations/${organization._id}`}
            className="transition hover:text-slate-400"
          >
            Open workspace
          </Link>
        </div>
      </div>
    </div>
  );
};

// ===========================================================
// SUMMARY METRIC
// ===========================================================

const SummaryMetric = ({ label, value }) => {
  return (
    <div className="min-w-[90px] rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-center">
      <p className="text-lg font-bold text-white">
        {value}
      </p>

      <p className="mt-0.5 text-[11px] text-slate-600">
        {label}
      </p>
    </div>
  );
};

// ===========================================================
// DASHBOARD SKELETON
// ===========================================================

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-3 w-40 rounded bg-slate-800" />

        <div className="mt-4 h-8 w-48 rounded bg-slate-800" />

        <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-900" />
      </div>

      <div className="mb-6 h-28 rounded-2xl bg-slate-900" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 rounded-2xl bg-slate-900"
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="h-80 rounded-2xl bg-slate-900 xl:col-span-2" />
        <div className="h-80 rounded-2xl bg-slate-900" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-2xl bg-slate-900" />
        <div className="h-64 rounded-2xl bg-slate-900" />
      </div>
    </div>
  );
};

export default Dashboard;