import {
  FiActivity,
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiBox,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCode,
  FiDatabase,
  FiEdit3,
  FiExternalLink,
  FiGitBranch,
  FiLayers,
  FiPlus,
  FiServer,
  FiSettings,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
} from "react";

import useOrganizationStore from "../../stores/organizationStore";
import useProjectStore from "../../stores/projectStore";
import useServiceStore from "../../stores/serviceStore";

// =====================================================
// HELPERS
// =====================================================

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const getInitial = (name = "") => {
  return (
    name.trim().charAt(0).toUpperCase() ||
    "P"
  );
};

// =====================================================
// STATUS BADGE
// =====================================================

const StatusBadge = ({ status }) => {
  const config = {
    active: {
      label: "Active",
      className:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      dot: "bg-emerald-400",
    },

    archived: {
      label: "Archived",
      className:
        "border-slate-700 bg-slate-800 text-slate-400",
      dot: "bg-slate-500",
    },
  };

  const current =
    config[status] || config.active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${current.className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${current.dot}`}
      />

      {current.label}
    </span>
  );
};

// =====================================================
// ENVIRONMENT BADGE
// =====================================================

const EnvironmentBadge = ({
  environment,
}) => {
  const config = {
    development:
      "border-slate-700 bg-slate-800 text-slate-400",

    staging:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",

    production:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
        config[environment] ||
        config.development
      }`}
    >
      {environment ||
        "development"}
    </span>
  );
};

// =====================================================
// HEALTH ITEM
// =====================================================

const HealthItem = ({
  icon: Icon,
  label,
  status = "operational",
}) => {
  const isOperational =
    status === "operational";

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-slate-400">
          <Icon size={15} />
        </div>

        <span className="text-xs font-medium text-slate-300">
          {label}
        </span>
      </div>

      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isOperational
              ? "bg-emerald-400"
              : "bg-amber-400"
          }`}
        />

        <span
          className={
            isOperational
              ? "text-emerald-400"
              : "text-amber-400"
          }
        >
          {isOperational
            ? "Operational"
            : "Attention"}
        </span>
      </span>
    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  label,
  value,
  icon: Icon,
  description,
  onClick,
}) => {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-blue-400">
          <Icon size={16} />
        </div>

        <FiArrowRight
          size={14}
          className="text-slate-700 transition group-hover:text-slate-400"
        />
      </div>

      <p className="mt-4 text-xs uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-600">
        {description}
      </p>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-left transition hover:border-slate-700 hover:bg-slate-900"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      {content}
    </div>
  );
};

// =====================================================
// PROJECT OVERVIEW
// =====================================================

const ProjectOverview = () => {
  const {
    id: organizationId,
    projectId,
  } = useParams();

  const navigate = useNavigate();

  // ===================================================
  // ORGANIZATION
  // ===================================================

  const organization =
    useOrganizationStore(
      (state) => state.currentOrganization
    );

  const fetchOrganization =
    useOrganizationStore(
      (state) => state.fetchOrganization
    );

  // ===================================================
  // PROJECT
  // ===================================================

  const project =
    useProjectStore(
      (state) => state.currentProject
    );

  const isProjectLoading =
    useProjectStore(
      (state) => state.isProjectLoading
    );

  const projectError =
    useProjectStore(
      (state) => state.error
    );

  const fetchProject =
    useProjectStore(
      (state) => state.fetchProject
    );

  const clearCurrentProject =
    useProjectStore(
      (state) => state.clearCurrentProject
    );

  // ===================================================
  // SERVICES
  // ===================================================

  const services =
    useServiceStore(
      (state) => state.services
    );

  const servicesLoading =
    useServiceStore(
      (state) => state.isLoading
    );

  const fetchServices =
    useServiceStore(
      (state) => state.fetchServices
    );

  const clearCurrentService =
    useServiceStore(
      (state) =>
        state.clearCurrentService
    );

  // ===================================================
  // LOAD PROJECT DATA
  // ===================================================

  useEffect(() => {
    if (
      !organizationId ||
      !projectId
    ) {
      return;
    }

    fetchOrganization(
      organizationId
    );

    fetchProject(
      organizationId,
      projectId
    );

    fetchServices(
      organizationId,
      projectId
    );

    return () => {
      clearCurrentProject();
      clearCurrentService();
    };
  }, [
    organizationId,
    projectId,
    fetchOrganization,
    fetchProject,
    fetchServices,
    clearCurrentProject,
    clearCurrentService,
  ]);

  // ===================================================
  // SERVICE STATS
  // ===================================================

  const serviceStats =
    useMemo(() => {
      return {
        total: services.length,

        active: services.filter(
          (service) =>
            service.status === "active"
        ).length,

        production:
          services.filter(
            (service) =>
              service.environment ===
              "production"
          ).length,

        inactive:
          services.filter(
            (service) =>
              service.status ===
              "inactive"
          ).length,
      };
    }, [services]);

  // ===================================================
  // PROJECT OWNER
  // ===================================================

  const ownerName =
    typeof project?.owner ===
    "object"
      ? project.owner?.name ||
        project.owner?.email ||
        "Unknown"
      : "Unknown";

  // ===================================================
  // LOADING
  // ===================================================

  if (
    isProjectLoading &&
    !project
  ) {
    return (
      <div className="min-h-full bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-64 rounded bg-slate-800" />

            <div className="h-32 rounded-2xl bg-slate-900" />

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-32 rounded-2xl bg-slate-900"
                  />
                )
              )}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="h-80 rounded-2xl bg-slate-900" />
              <div className="h-80 rounded-2xl bg-slate-900" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (
    projectError &&
    !project
  ) {
    return (
      <div className="min-h-full bg-slate-950">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <FiAlertCircle
                size={21}
              />
            </div>

            <h1 className="mt-5 text-lg font-semibold text-white">
              Unable to load project
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {projectError}
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                type="button"
                onClick={() =>
                  fetchProject(
                    organizationId,
                    projectId
                  )
                }
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Try again
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/organizations/${organizationId}/projects`
                  )
                }
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                Back to projects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="min-h-full bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Link
            to="/dashboard"
            className="transition hover:text-slate-300"
          >
            Dashboard
          </Link>

          <FiChevronRight
            size={13}
          />

          <Link
            to={`/organizations/${organizationId}`}
            className="max-w-[160px] truncate transition hover:text-slate-300"
          >
            {organization?.name ||
              "Workspace"}
          </Link>

          <FiChevronRight
            size={13}
          />

          <Link
            to={`/organizations/${organizationId}/projects`}
            className="transition hover:text-slate-300"
          >
            Projects
          </Link>

          <FiChevronRight
            size={13}
          />

          <span className="max-w-[180px] truncate text-slate-300">
            {project?.name ||
              "Project"}
          </span>
        </div>

        {/* =================================================
            PROJECT HEADER
        ================================================= */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-lg font-semibold text-blue-400">
                {getInitial(
                  project?.name
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {project?.name ||
                      "Project"}
                  </h1>

                  <StatusBadge
                    status={
                      project?.status
                    }
                  />

                  <EnvironmentBadge
                    environment={
                      project?.environment
                    }
                  />
                </div>

                <p className="mt-1 text-xs text-slate-600">
                  {project?.slug ||
                    "project"}
                </p>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  {project?.description ||
                    "No project description has been added yet."}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/organizations/${organizationId}/projects`
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                <FiArrowLeft
                  size={14}
                />
                Projects
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/organizations/${organizationId}/projects/${projectId}/settings`
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800"
              >
                <FiSettings
                  size={14}
                />
                Settings
              </button>
            </div>
          </div>

          {/* Project metadata */}

          <div className="mt-6 grid gap-4 border-t border-slate-800 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Visibility
              </p>

              <p className="mt-1 text-xs font-medium capitalize text-slate-300">
                {project?.visibility ||
                  "private"}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Owner
              </p>

              <p className="mt-1 truncate text-xs font-medium text-slate-300">
                {ownerName}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Created
              </p>

              <p className="mt-1 text-xs font-medium text-slate-300">
                {formatDate(
                  project?.createdAt
                )}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-600">
                Last updated
              </p>

              <p className="mt-1 text-xs font-medium text-slate-300">
                {formatDate(
                  project?.updatedAt
                )}
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Services"
            value={
              servicesLoading
                ? "..."
                : serviceStats.total
            }
            icon={FiLayers}
            description={`${serviceStats.active} active services`}
            onClick={() =>
              navigate(
                `/organizations/${organizationId}/projects/${projectId}/services`
              )
            }
          />

          <StatCard
            label="Deployments"
            value="0"
            icon={FiZap}
            description="No deployments tracked"
          />

          <StatCard
            label="Incidents"
            value="0"
            icon={FiAlertCircle}
            description="No active incidents"
          />

          <StatCard
            label="Activity"
            value="0"
            icon={FiActivity}
            description="No recent activity"
          />
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* =================================================
              SERVICES
          ================================================= */}

          <section className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Services
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Applications and infrastructure connected to this project.
                </p>
              </div>

              <Link
                to={`/organizations/${organizationId}/projects/${projectId}/services`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 transition hover:text-blue-300"
              >
                View all
                <FiArrowRight
                  size={13}
                />
              </Link>
            </div>

            {services.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {services
                  .slice(0, 5)
                  .map((service) => (
                    <Link
                      key={service._id}
                      to={`/organizations/${organizationId}/projects/${projectId}/services/${service._id}`}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-800/30"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-blue-400">
                          <FiServer
                            size={15}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-200">
                            {service.name}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-slate-600">
                            {service.slug}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="hidden text-[10px] capitalize text-slate-600 sm:block">
                          {service.environment}
                        </span>

                        <span className="flex items-center gap-1.5 text-[10px]">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              service.status ===
                              "active"
                                ? "bg-emerald-400"
                                : "bg-slate-500"
                            }`}
                          />

                          <span className="capitalize text-slate-500">
                            {service.status}
                          </span>
                        </span>

                        <FiChevronRight
                          size={14}
                          className="text-slate-700"
                        />
                      </div>
                    </Link>
                  ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-600">
                  <FiLayers
                    size={19}
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-300">
                  No services yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-600">
                  Add your first service to start tracking applications and infrastructure.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/organizations/${organizationId}/projects/${projectId}/services`
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
                >
                  <FiPlus
                    size={14}
                  />
                  Add service
                </button>
              </div>
            )}
          </section>

          {/* =================================================
              PROJECT HEALTH
          ================================================= */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                Project health
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Current platform health signals.
              </p>
            </div>

            <div className="space-y-2 p-4">
              <HealthItem
                icon={FiServer}
                label="API"
              />

              <HealthItem
                icon={FiDatabase}
                label="Database"
              />

              <HealthItem
                icon={FiGitBranch}
                label="CI/CD"
              />

              <HealthItem
                icon={FiShield}
                label="Authentication"
              />
            </div>
          </section>
        </div>

        {/* =================================================
            PROJECT DETAILS + QUICK ACTIONS
        ================================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* =================================================
              PROJECT DETAILS
          ================================================= */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                Project details
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-slate-500">
                    <FiUsers
                      size={14}
                    />
                  </div>

                  <span className="text-xs text-slate-500">
                    Owner
                  </span>
                </div>

                <span className="max-w-[200px] truncate text-xs font-medium text-slate-300">
                  {ownerName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-slate-500">
                    <FiCode
                      size={14}
                    />
                  </div>

                  <span className="text-xs text-slate-500">
                    Repository
                  </span>
                </div>

                {project?.repository ? (
                  <a
                    href={
                      project.repository
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex max-w-[220px] items-center gap-1.5 truncate text-xs font-medium text-blue-400 hover:text-blue-300"
                  >
                    <span className="truncate">
                      {project.repository}
                    </span>

                    <FiExternalLink
                      size={11}
                      className="shrink-0"
                    />
                  </a>
                ) : (
                  <span className="text-xs text-slate-700">
                    Not connected
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-slate-500">
                    <FiClock
                      size={14}
                    />
                  </div>

                  <span className="text-xs text-slate-500">
                    Created
                  </span>
                </div>

                <span className="text-xs font-medium text-slate-300">
                  {formatDate(
                    project?.createdAt
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-slate-500">
                    <FiBox
                      size={14}
                    />
                  </div>

                  <span className="text-xs text-slate-500">
                    Visibility
                  </span>
                </div>

                <span className="text-xs font-medium capitalize text-slate-300">
                  {project?.visibility ||
                    "private"}
                </span>
              </div>
            </div>
          </section>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-sm font-semibold text-white">
                Quick actions
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Common engineering workflows.
              </p>
            </div>

            <div className="grid gap-2 p-4 sm:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/organizations/${organizationId}/projects/${projectId}/services`
                  )
                }
                className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-left transition hover:border-blue-500/30 hover:bg-blue-500/5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <FiPlus
                    size={15}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-300 group-hover:text-white">
                    Add service
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-600">
                    Register a new service
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/organizations/${organizationId}/projects/${projectId}/services`
                  )
                }
                className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-left transition hover:border-slate-700 hover:bg-slate-800/50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                  <FiLayers
                    size={15}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-300 group-hover:text-white">
                    Manage services
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-600">
                    View service registry
                  </p>
                </div>
              </button>

              <button
                type="button"
                disabled
                className="group flex cursor-not-allowed items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-left opacity-60"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-500">
                  <FiZap
                    size={15}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Create deployment
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-700">
                    Coming in Deployments
                  </p>
                </div>
              </button>

              <button
                type="button"
                disabled
                className="group flex cursor-not-allowed items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-left opacity-60"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-500">
                  <FiAlertCircle
                    size={15}
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Report incident
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-700">
                    Coming in Incidents
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* =================================================
            RECENT ACTIVITY
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Recent activity
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                Engineering events for this project.
              </p>
            </div>

            <span className="text-[10px] uppercase tracking-wider text-slate-700">
              Activity log
            </span>
          </div>

          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-600">
              <FiActivity
                size={19}
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-300">
              No activity yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-600">
              Deployments, incidents, service changes, and other engineering events will appear here.
            </p>
          </div>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mt-6 flex flex-col gap-2 border-t border-slate-900 py-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            DevFlow Project Workspace
          </span>

          <span>
            {project?.name ||
              "Project"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;