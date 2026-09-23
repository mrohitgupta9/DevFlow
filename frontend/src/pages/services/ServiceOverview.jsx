import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiActivity,
  FiArrowLeft,
  FiBox,
  FiCheck,
  FiChevronRight,
  FiCode,
  FiCopy,
  FiDatabase,
  FiEdit3,
  FiExternalLink,
  FiGlobe,
  FiLayers,
  FiLink,
  FiRefreshCw,
  FiServer,
  FiSettings,
  FiShield,
  FiTrash2,
  FiUser,
  FiX,
  FiZap,
} from "react-icons/fi";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import useOrganizationStore from "../../stores/organizationStore";
import useProjectStore from "../../stores/projectStore";
import useServiceStore from "../../stores/serviceStore";

/* =========================================================
   CONSTANTS
========================================================= */

const SERVICE_TYPES = {
  api: {
    label: "API",
    icon: FiCode,
  },

  frontend: {
    label: "Frontend",
    icon: FiGlobe,
  },

  worker: {
    label: "Worker",
    icon: FiZap,
  },

  database: {
    label: "Database",
    icon: FiDatabase,
  },

  cache: {
    label: "Cache",
    icon: FiLayers,
  },

  queue: {
    label: "Queue",
    icon: FiActivity,
  },

  other: {
    label: "Other",
    icon: FiServer,
  },
};

const ENVIRONMENT_LABELS = {
  development: "Development",
  staging: "Staging",
  production: "Production",
};

const STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
  deprecated: "Deprecated",
};

/* =========================================================
   HELPERS
========================================================= */

const getServiceType = (type) => {
  return (
    SERVICE_TYPES[type] ||
    SERVICE_TYPES.other
  );
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const isValidUrl = (value) => {
  if (!value) return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }) => {
  const styles = {
    active:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    inactive:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",

    deprecated:
      "border-red-500/20 bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
        styles[status] ||
        "border-slate-700 bg-slate-800 text-slate-300"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "active"
            ? "bg-emerald-400"
            : status === "inactive"
              ? "bg-amber-400"
              : "bg-red-400"
        }`}
      />

      {STATUS_LABELS[status] || status}
    </span>
  );
};

/* =========================================================
   ENVIRONMENT BADGE
========================================================= */

const EnvironmentBadge = ({ environment }) => {
  const styles = {
    development:
      "border-violet-500/20 bg-violet-500/10 text-violet-400",

    staging:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",

    production:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        styles[environment] ||
        "border-slate-700 bg-slate-800 text-slate-300"
      }`}
    >
      {ENVIRONMENT_LABELS[environment] ||
        environment}
    </span>
  );
};

/* =========================================================
   COPY BUTTON
========================================================= */

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // Clipboard may be blocked by browser permissions.
    }
  };

  if (!value) return null;

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy"
      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
    >
      {copied ? (
        <FiCheck size={15} />
      ) : (
        <FiCopy size={15} />
      )}
    </button>
  );
};

/* =========================================================
   DETAIL ROW
========================================================= */

const DetailRow = ({
  icon: Icon,
  label,
  children,
}) => {
  return (
    <div className="flex items-start gap-4 border-b border-slate-800/80 py-4 last:border-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <div className="mt-1 text-sm text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   URL ROW
========================================================= */

const UrlRow = ({
  icon: Icon,
  label,
  value,
}) => {
  if (!value) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-3">
        <Icon
          size={16}
          className="text-slate-600"
        />

        <div>
          <p className="text-xs font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-0.5 text-xs text-slate-600">
            Not configured
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-blue-400">
        <Icon size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p
          className="mt-0.5 truncate text-sm text-slate-300"
          title={value}
        >
          {value}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <CopyButton value={value} />

        {isValidUrl(value) && (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-blue-400"
            title={`Open ${label}`}
          >
            <FiExternalLink size={15} />
          </a>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   EDIT MODAL
========================================================= */

const EditServiceModal = ({
  service,
  onClose,
  onSave,
  isSaving,
}) => {
  const [form, setForm] = useState({
    name: service?.name || "",
    description: service?.description || "",
    type: service?.type || "api",
    status: service?.status || "active",
    environment:
      service?.environment || "development",
    repository: service?.repository || "",
    url: service?.url || "",
    healthCheckUrl:
      service?.healthCheckUrl || "",
  });

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) return;

    await onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      type: form.type,
      status: form.status,
      environment: form.environment,
      repository: form.repository.trim(),
      url: form.url.trim(),
      healthCheckUrl:
        form.healthCheckUrl.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Modal header */}

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Edit service
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update service configuration and metadata.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
          >
            <FiX size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            {/* Name */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Service name
              </label>

              <input
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                placeholder="e.g. Payments API"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* Description */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>

              <textarea
                rows={3}
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Describe what this service does..."
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* Type / Status */}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Service type
                </label>

                <select
                  value={form.type}
                  onChange={(event) =>
                    updateField(
                      "type",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  {Object.entries(
                    SERVICE_TYPES
                  ).map(([value, config]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                  <option value="deprecated">
                    Deprecated
                  </option>
                </select>
              </div>
            </div>

            {/* Environment */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Environment
              </label>

              <select
                value={form.environment}
                onChange={(event) =>
                  updateField(
                    "environment",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="development">
                  Development
                </option>

                <option value="staging">
                  Staging
                </option>

                <option value="production">
                  Production
                </option>
              </select>
            </div>

            {/* URLs */}

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Repository URL
                </label>

                <input
                  value={form.repository}
                  onChange={(event) =>
                    updateField(
                      "repository",
                      event.target.value
                    )
                  }
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Service URL
                </label>

                <input
                  value={form.url}
                  onChange={(event) =>
                    updateField(
                      "url",
                      event.target.value
                    )
                  }
                  placeholder="https://api.example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Health check URL
                </label>

                <input
                  value={form.healthCheckUrl}
                  onChange={(event) =>
                    updateField(
                      "healthCheckUrl",
                      event.target.value
                    )
                  }
                  placeholder="https://api.example.com/health"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSaving ||
                !form.name.trim()
              }
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving && (
                <FiRefreshCw
                  size={15}
                  className="animate-spin"
                />
              )}

              {isSaving
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN PAGE
========================================================= */

const ServiceOverview = () => {
  const { id, projectId, serviceId } =
    useParams();

  const navigate = useNavigate();

  const currentOrganization =
    useOrganizationStore(
      (state) => state.currentOrganization
    );

  const fetchOrganization =
    useOrganizationStore(
      (state) => state.fetchOrganization
    );

  const currentProject =
    useProjectStore(
      (state) => state.currentProject
    );

  const fetchProject =
    useProjectStore(
      (state) => state.fetchProject
    );

  const currentService =
    useServiceStore(
      (state) => state.currentService
    );

  const isServiceLoading =
    useServiceStore(
      (state) => state.isServiceLoading
    );

  const serviceError =
    useServiceStore(
      (state) => state.error
    );

  const fetchService =
    useServiceStore(
      (state) => state.fetchService
    );

  const updateService =
    useServiceStore(
      (state) => state.updateService
    );

  const deleteService =
    useServiceStore(
      (state) => state.deleteService
    );

  const clearCurrentService =
    useServiceStore(
      (state) => state.clearCurrentService
    );

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  /* =====================================================
     FETCH DATA
  ===================================================== */

  const loadData = async () => {
    try {
      await Promise.all([
        fetchOrganization(id),
        fetchProject(id, projectId),
        fetchService(
          id,
          projectId,
          serviceId
        ),
      ]);
    } catch {
      // Store handles the error state.
    }
  };

  useEffect(() => {
    loadData();

    return () => {
      clearCurrentService();
    };
  }, [
    id,
    projectId,
    serviceId,
  ]);

  /* =====================================================
     DERIVED DATA
  ===================================================== */

  const service = currentService;

  const serviceType = useMemo(() => {
    return getServiceType(service?.type);
  }, [service?.type]);

  const TypeIcon = serviceType.icon;

  const ownerName =
    service?.owner?.name ||
    "Not assigned";

  const projectName =
    service?.project?.name ||
    currentProject?.name ||
    "Project";

  const organizationName =
    currentOrganization?.name ||
    "Organization";

  const isConfigured =
    Boolean(service?.healthCheckUrl);

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await fetchService(
        id,
        projectId,
        serviceId
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  /* =====================================================
     UPDATE
  ===================================================== */

  const handleUpdate = async (data) => {
    setIsSaving(true);

    try {
      await updateService(
        id,
        projectId,
        serviceId,
        data
      );

      setIsEditOpen(false);
    } catch {
      // Store keeps error.
    } finally {
      setIsSaving(false);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        `Delete "${service?.name}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteService(
        id,
        projectId,
        serviceId
      );

      navigate(
        `/organizations/${id}/projects/${projectId}/services`
      );
    } catch {
      setIsDeleting(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (isServiceLoading && !service) {
    return (
      <div className="min-h-full bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-4 w-72 animate-pulse rounded bg-slate-800" />

          <div className="mt-6 h-40 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <div className="h-72 animate-pulse rounded-2xl border border-slate-800 bg-slate-900 lg:col-span-2" />

            <div className="h-72 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (!service) {
    return (
      <div className="min-h-full bg-slate-950">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-6">
          <div className="w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <FiServer size={22} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              Service could not be loaded
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {serviceError ||
                "The requested service was not found or you do not have access to it."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/organizations/${id}/projects/${projectId}/services`
                )
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
            >
              <FiArrowLeft size={15} />
              Back to services
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-full bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <nav className="mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm">
          <Link
            to={`/organizations/${id}`}
            className="text-slate-500 transition hover:text-slate-300"
          >
            {organizationName}
          </Link>

          <FiChevronRight
            size={14}
            className="shrink-0 text-slate-700"
          />

          <Link
            to={`/organizations/${id}/projects`}
            className="text-slate-500 transition hover:text-slate-300"
          >
            Projects
          </Link>

          <FiChevronRight
            size={14}
            className="shrink-0 text-slate-700"
          />

          <Link
            to={`/organizations/${id}/projects/${projectId}`}
            className="text-slate-500 transition hover:text-slate-300"
          >
            {projectName}
          </Link>

          <FiChevronRight
            size={14}
            className="shrink-0 text-slate-700"
          />

          <span className="font-medium text-slate-300">
            {service.name}
          </span>
        </nav>

        {/* =================================================
            SERVICE HEADER
        ================================================= */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm">

          <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex min-w-0 items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <TypeIcon size={25} />
              </div>

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="truncate text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {service.name}
                  </h1>

                  <StatusBadge
                    status={service.status}
                  />

                  <EnvironmentBadge
                    environment={
                      service.environment
                    }
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                  <span>
                    {service.slug}
                  </span>

                  <span className="text-slate-700">
                    •
                  </span>

                  <span>
                    {serviceType.label}
                  </span>

                  <span className="text-slate-700">
                    •
                  </span>

                  <span>
                    {projectName}
                  </span>
                </div>

                {service.description && (
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                    {service.description}
                  </p>
                )}
              </div>
            </div>

            {/* Header actions */}

            <div className="flex shrink-0 flex-wrap items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/organizations/${id}/projects/${projectId}/services`
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                <FiArrowLeft size={16} />
                <span className="hidden sm:inline">
                  Services
                </span>
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <FiRefreshCw
                  size={16}
                  className={
                    isRefreshing
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsEditOpen(true)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                <FiEdit3 size={16} />
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
              >
                <FiTrash2 size={16} />

                {isDeleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>

          {/* Header metadata */}

          <div className="grid border-t border-slate-800 sm:grid-cols-3">

            <div className="border-b border-slate-800 px-5 py-4 sm:border-b-0 sm:border-r">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Service type
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-200">
                <TypeIcon
                  size={14}
                  className="text-blue-400"
                />

                {serviceType.label}
              </div>
            </div>

            <div className="border-b border-slate-800 px-5 py-4 sm:border-b-0 sm:border-r">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Owner
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-200">
                <FiUser
                  size={14}
                  className="text-slate-500"
                />

                {ownerName}
              </div>
            </div>

            <div className="px-5 py-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Created
              </p>

              <p className="mt-1 text-sm font-medium text-slate-200">
                {formatDate(service.createdAt)}
              </p>
            </div>
          </div>
        </section>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">

            {/* Configuration */}

            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">

              <div className="border-b border-slate-800 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <FiSettings size={17} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Configuration
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Service metadata and runtime configuration
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-x-8 px-5 sm:grid-cols-2 sm:px-6">

                <DetailRow
                  icon={FiBox}
                  label="Service type"
                >
                  {serviceType.label}
                </DetailRow>

                <DetailRow
                  icon={FiActivity}
                  label="Status"
                >
                  <StatusBadge
                    status={service.status}
                  />
                </DetailRow>

                <DetailRow
                  icon={FiGlobe}
                  label="Environment"
                >
                  <EnvironmentBadge
                    environment={
                      service.environment
                    }
                  />
                </DetailRow>

                <DetailRow
                  icon={FiUser}
                  label="Owner"
                >
                  {ownerName}
                </DetailRow>

                <DetailRow
                  icon={FiBox}
                  label="Project"
                >
                  <Link
                    to={`/organizations/${id}/projects/${projectId}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {projectName}
                  </Link>
                </DetailRow>

                <DetailRow
                  icon={FiRefreshCw}
                  label="Last updated"
                >
                  {formatDate(service.updatedAt)}
                </DetailRow>

              </div>
            </section>

            {/* Endpoints */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <FiLink size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Service endpoints
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    External URLs and source repository
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">

                <UrlRow
                  icon={FiGlobe}
                  label="Service URL"
                  value={service.url}
                />

                <UrlRow
                  icon={FiShield}
                  label="Health check"
                  value={
                    service.healthCheckUrl
                  }
                />

                <UrlRow
                  icon={FiCode}
                  label="Repository"
                  value={service.repository}
                />

              </div>
            </section>

            {/* Activity */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/60">

              <div className="border-b border-slate-800 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <FiActivity size={17} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Recent activity
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Service changes and engineering events
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-12 text-center">

                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-slate-500">
                  <FiActivity size={19} />
                </div>

                <h3 className="mt-4 text-sm font-medium text-slate-300">
                  No activity yet
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-600">
                  Deployment, incident, and configuration events will appear here as DevFlow integrations are connected.
                </p>

              </div>
            </section>
          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="space-y-6">

            {/* Health */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/60">

              <div className="border-b border-slate-800 px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <FiShield size={17} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Service health
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Current service health configuration
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4">

                {/* Registered status */}

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <FiCheck size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          Registered status
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Current service state
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-emerald-400">
                      {STATUS_LABELS[
                        service.status
                      ] || service.status}
                    </span>
                  </div>
                </div>

                {/* Health check */}

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                        <FiActivity size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          Health checks
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Automated monitoring
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 text-xs font-medium ${
                        isConfigured
                          ? "text-emerald-400"
                          : "text-slate-500"
                      }`}
                    >
                      {isConfigured
                        ? "Configured"
                        : "Not configured"}
                    </span>
                  </div>
                </div>

                {/* Monitoring */}

                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                        <FiActivity size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          Monitoring
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Uptime and latency
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-xs font-medium text-slate-600">
                      Coming soon
                    </span>
                  </div>
                </div>

              </div>

              {/* Health action */}

              {service.healthCheckUrl && (
                <div className="border-t border-slate-800 p-4">
                  <a
                    href={service.healthCheckUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    <FiExternalLink size={15} />
                    Open health endpoint
                  </a>
                </div>
              )}
            </section>

            {/* Quick actions */}

            <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <FiZap size={17} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Quick actions
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Common service operations
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">

                <button
                  type="button"
                  onClick={() =>
                    setIsEditOpen(true)
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-left transition hover:border-slate-700 hover:bg-slate-800"
                >
                  <span className="flex items-center gap-3">
                    <FiEdit3
                      size={16}
                      className="text-slate-500"
                    />

                    <span className="text-sm font-medium text-slate-300">
                      Edit configuration
                    </span>
                  </span>

                  <FiChevronRight
                    size={16}
                    className="text-slate-600"
                  />
                </button>

                <button
                  type="button"
                  onClick={handleRefresh}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-left transition hover:border-slate-700 hover:bg-slate-800"
                >
                  <span className="flex items-center gap-3">
                    <FiRefreshCw
                      size={16}
                      className="text-slate-500"
                    />

                    <span className="text-sm font-medium text-slate-300">
                      Refresh service
                    </span>
                  </span>

                  <FiChevronRight
                    size={16}
                    className="text-slate-600"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/organizations/${id}/projects/${projectId}/services`
                    )
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-left transition hover:border-slate-700 hover:bg-slate-800"
                >
                  <span className="flex items-center gap-3">
                    <FiLayers
                      size={16}
                      className="text-slate-500"
                    />

                    <span className="text-sm font-medium text-slate-300">
                      View all services
                    </span>
                  </span>

                  <FiChevronRight
                    size={16}
                    className="text-slate-600"
                  />
                </button>

              </div>
            </section>

            {/* Danger zone */}

            <section className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <FiTrash2 size={16} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-slate-200">
                    Danger zone
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Deleting a service permanently removes its registered configuration.
                  </p>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <FiTrash2 size={14} />
                    {isDeleting
                      ? "Deleting..."
                      : "Delete service"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-800/80 py-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            DevFlow Engineering Platform
          </p>

          <p>
            Service ID: {service._id}
          </p>
        </div>
      </div>

      {/* ===================================================
          EDIT MODAL
      =================================================== */}

      {isEditOpen && (
        <EditServiceModal
          service={service}
          onClose={() =>
            !isSaving &&
            setIsEditOpen(false)
          }
          onSave={handleUpdate}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default ServiceOverview;