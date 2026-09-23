import {
  FiActivity,
  FiAlertCircle,
  FiBox,
  FiCalendar,
  FiCheckCircle,
  FiChevronRight,
  FiCode,
  FiDatabase,
  FiExternalLink,
  FiGlobe,
  FiLayers,
  FiLoader,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiServer,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import useOrganizationStore from "../../stores/organizationStore";
import useProjectStore from "../../stores/projectStore";
import useServiceStore from "../../stores/serviceStore";

// =====================================================
// CONSTANTS
// =====================================================

const INITIAL_FORM = {
  name: "",
  description: "",
  type: "api",
  environment: "development",
  repository: "",
  url: "",
  healthCheckUrl: "",
};

const SERVICE_TYPES = [
  {
    value: "api",
    label: "API",
    icon: FiServer,
  },
  {
    value: "frontend",
    label: "Frontend",
    icon: FiGlobe,
  },
  {
    value: "worker",
    label: "Worker",
    icon: FiActivity,
  },
  {
    value: "database",
    label: "Database",
    icon: FiDatabase,
  },
  {
    value: "cache",
    label: "Cache",
    icon: FiLayers,
  },
  {
    value: "queue",
    label: "Queue",
    icon: FiPackage,
  },
  {
    value: "other",
    label: "Other",
    icon: FiBox,
  },
];

const ENVIRONMENTS = [
  {
    value: "development",
    label: "Development",
  },
  {
    value: "staging",
    label: "Staging",
  },
  {
    value: "production",
    label: "Production",
  },
];

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All statuses",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
  {
    value: "deprecated",
    label: "Deprecated",
  },
];

// =====================================================
// HELPERS
// =====================================================

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusClasses = (status) => {
  switch (status) {
    case "active":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "inactive":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";

    case "deprecated":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    default:
      return "border-slate-700 bg-slate-800 text-slate-400";
  }
};

const getEnvironmentClasses = (environment) => {
  switch (environment) {
    case "production":
      return "border-purple-500/20 bg-purple-500/10 text-purple-400";

    case "staging":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";

    case "development":
      return "border-slate-700 bg-slate-800 text-slate-400";

    default:
      return "border-slate-700 bg-slate-800 text-slate-400";
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case "api":
      return FiServer;

    case "frontend":
      return FiGlobe;

    case "worker":
      return FiActivity;

    case "database":
      return FiDatabase;

    case "cache":
      return FiLayers;

    case "queue":
      return FiPackage;

    default:
      return FiBox;
  }
};

const getTypeLabel = (type) => {
  const typeItem = SERVICE_TYPES.find((item) => item.value === type);

  return typeItem?.label || "Other";
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({ icon: Icon, label, value, description }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>

          {description && (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-blue-400">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SERVICE CARD
// =====================================================

const ServiceCard = ({ service, organizationId, projectId, onDelete }) => {
  const navigate = useNavigate();

  const TypeIcon = getTypeIcon(service.type);

  const handleOpen = () => {
    navigate(
      `/organizations/${organizationId}/projects/${projectId}/services/${service._id}`,
    );
  };

  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-slate-700 hover:bg-slate-900">
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={handleOpen}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <TypeIcon size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white transition group-hover:text-blue-400">
              {service.name}
            </h3>

            <p className="mt-1 truncate text-xs text-slate-500">
              {service.slug}
            </p>
          </div>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleOpen}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
            title="Open service"
          >
            <FiChevronRight size={17} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(service)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
            title="Delete service"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>

      {/* Description */}

      <p className="mt-4 min-h-[42px] text-sm leading-6 text-slate-400">
        {service.description ||
          "No description has been added for this service."}
      </p>

      {/* Badges */}

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusClasses(
            service.status,
          )}`}
        >
          {service.status}
        </span>

        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getEnvironmentClasses(
            service.environment,
          )}`}
        >
          {service.environment}
        </span>

        <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-400">
          {getTypeLabel(service.type)}
        </span>
      </div>

      {/* Metadata */}

      <div className="mt-5 space-y-3 border-t border-slate-800 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FiUser size={13} />

          <span className="truncate">
            {service.owner?.name || service.owner?.email || "Unknown owner"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FiCalendar size={13} />

          <span>Updated {formatDate(service.updatedAt)}</span>
        </div>

        {service.repository && (
          <a
            href={service.repository}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="flex items-center gap-2 truncate text-xs text-blue-400 transition hover:text-blue-300"
          >
            <FiCode size={13} />

            <span className="truncate">{service.repository}</span>

            <FiExternalLink size={12} className="shrink-0" />
          </a>
        )}
      </div>

      {/* Open */}

      <button
        type="button"
        onClick={handleOpen}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
      >
        View service
        <FiChevronRight size={15} />
      </button>
    </div>
  );
};

// =====================================================
// CREATE SERVICE MODAL
// =====================================================

const CreateServiceModal = ({
  open,
  onClose,
  organizationId,
  projectId,
  onCreated,
}) => {
  const createService = useServiceStore((state) => state.createService);

  const storeError = useServiceStore((state) => state.error);

  const isLoading = useServiceStore((state) => state.isLoading);

  const clearError = useServiceStore((state) => state.clearError);

  const [form, setForm] = useState(INITIAL_FORM);

  const [formError, setFormError] = useState("");

  // Reset form when modal opens

  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setFormError("");
      clearError();
    }
  }, [open, clearError]);

  // ESC close

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  // Body scroll lock

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }

    if (storeError) {
      clearError();
    }
  };

  const validate = () => {
    if (!form.name.trim()) {
      return "Service name is required.";
    }

    if (form.name.trim().length < 2) {
      return "Service name must be at least 2 characters.";
    }

    if (form.name.trim().length > 100) {
      return "Service name cannot exceed 100 characters.";
    }

    if (
      form.repository.trim() &&
      !/^https?:\/\/.+/i.test(form.repository.trim())
    ) {
      return "Repository URL must start with http:// or https://.";
    }

    if (form.url.trim() && !/^https?:\/\/.+/i.test(form.url.trim())) {
      return "Service URL must start with http:// or https://.";
    }

    if (
      form.healthCheckUrl.trim() &&
      !/^https?:\/\/.+/i.test(form.healthCheckUrl.trim())
    ) {
      return "Health check URL must start with http:// or https://.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const createdService = await createService(organizationId, projectId, {
        name: form.name.trim(),
        description: form.description.trim(),
        type: form.type,
        environment: form.environment,
        repository: form.repository.trim(),
        url: form.url.trim(),
        healthCheckUrl: form.healthCheckUrl.trim(),
      });

      if (createdService) {
        onCreated(createdService);
      }

      onClose();
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Modal Header */}

        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Add service</h2>

            <p className="mt-1 text-xs text-slate-500">
              Register a new service inside this project.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Body */}

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="space-y-5 p-5">
            {/* Error */}

            {(formError || storeError) && (
              <div className="flex gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <FiAlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-400"
                />

                <p className="text-sm leading-6 text-red-300">
                  {formError || storeError}
                </p>
              </div>
            )}

            {/* Name */}

            <div>
              <label
                htmlFor="service-name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Service name <span className="text-red-400">*</span>
              </label>

              <input
                id="service-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. payments-api"
                maxLength={100}
                autoFocus
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Description */}

            <div>
              <label
                htmlFor="service-description"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Description
              </label>

              <textarea
                id="service-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What does this service do?"
                rows={3}
                maxLength={500}
                disabled={isLoading}
                className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="mt-1 text-right text-xs text-slate-600">
                {form.description.length}/500
              </div>
            </div>

            {/* Type + Environment */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="service-type"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Service type
                </label>

                <select
                  id="service-type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {SERVICE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="service-environment"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Environment
                </label>

                <select
                  id="service-environment"
                  name="environment"
                  value={form.environment}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {ENVIRONMENTS.map((environment) => (
                    <option key={environment.value} value={environment.value}>
                      {environment.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Repository */}

            <div>
              <label
                htmlFor="service-repository"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Repository URL
              </label>

              <div className="relative">
                <FiCode
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  id="service-repository"
                  name="repository"
                  type="url"
                  value={form.repository}
                  onChange={handleChange}
                  placeholder="https://github.com/org/repository"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Service URL */}

            <div>
              <label
                htmlFor="service-url"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Service URL
              </label>

              <div className="relative">
                <FiGlobe
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  id="service-url"
                  name="url"
                  type="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="https://api.example.com"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Health Check */}

            <div>
              <label
                htmlFor="service-health-check"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Health check URL
              </label>

              <div className="relative">
                <FiActivity
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                />

                <input
                  id="service-health-check"
                  name="healthCheckUrl"
                  type="url"
                  value={form.healthCheckUrl}
                  onChange={handleChange}
                  placeholder="https://api.example.com/health"
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-800 bg-slate-950/50 px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !form.name.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <FiLoader size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FiPlus size={16} />
                  Create service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =====================================================
// SERVICES PAGE
// =====================================================

const Services = () => {
  const { id: organizationId, projectId } = useParams();

  const navigate = useNavigate();

  // ===================================================
  // STORES
  // ===================================================

  const organization = useOrganizationStore(
    (state) => state.currentOrganization,
  );

  const fetchOrganization = useOrganizationStore(
    (state) => state.fetchOrganization,
  );

  const project = useProjectStore((state) => state.currentProject);

  const fetchProject = useProjectStore((state) => state.fetchProject);

  const services = useServiceStore((state) => state.services);

  const isLoading = useServiceStore((state) => state.isLoading);

  const error = useServiceStore((state) => state.error);

  const fetchServices = useServiceStore((state) => state.fetchServices);

  const deleteService = useServiceStore((state) => state.deleteService);

  // ===================================================
  // LOCAL STATE
  // ===================================================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [typeFilter, setTypeFilter] = useState("all");

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // ===================================================
  // FETCH DATA
  // ===================================================

  // ===================================================
  // FETCH DATA
  // ===================================================

  const loadedKeyRef = useRef(null);
  const loadingKeyRef = useRef(null);

  useEffect(() => {
    if (!organizationId || !projectId) {
      return;
    }

    const loadKey = `${organizationId}:${projectId}`;

    // Same organization/project already loaded
    if (loadedKeyRef.current === loadKey) {
      return;
    }

    // Prevent duplicate requests while loading
    if (loadingKeyRef.current === loadKey) {
      return;
    }

    loadingKeyRef.current = loadKey;

    const loadData = async () => {
      try {
        await Promise.all([
          fetchOrganization(organizationId),

          fetchProject(organizationId, projectId),

          fetchServices(organizationId, projectId),
        ]);

        loadedKeyRef.current = loadKey;
      } catch (error) {
        console.error("Failed to load services page:", error);
      } finally {
        loadingKeyRef.current = null;
      }
    };

    loadData();

    // Prevent Zustand action references from
    // causing duplicate API requests.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, projectId]);

  // ===================================================
  // FILTER SERVICES
  // ===================================================

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !normalizedSearch ||
        service.name?.toLowerCase().includes(normalizedSearch) ||
        service.slug?.toLowerCase().includes(normalizedSearch) ||
        service.description?.toLowerCase().includes(normalizedSearch) ||
        service.type?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || service.status === statusFilter;

      const matchesType = typeFilter === "all" || service.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [services, search, statusFilter, typeFilter]);

  // ===================================================
  // STATS
  // ===================================================

  const totalServices = services.length;

  const activeServices = services.filter(
    (service) => service.status === "active",
  ).length;

  const inactiveServices = services.filter(
    (service) => service.status === "inactive",
  ).length;

  const productionServices = services.filter(
    (service) => service.environment === "production",
  ).length;

  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = async () => {
    if (!organizationId || !projectId) {
      return;
    }

    try {
      await fetchServices(organizationId, projectId);
    } catch (error) {
      console.error("Failed to refresh services:", error);
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteService(organizationId, projectId, deleteTarget._id);

      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // ===================================================
  // INVALID ROUTE
  // ===================================================

  if (!organizationId || !projectId) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
          <FiAlertCircle size={28} className="mx-auto text-red-400" />

          <h2 className="mt-4 text-lg font-semibold text-white">
            Invalid service workspace
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Organization or project information is missing.
          </p>

          <button
            type="button"
            onClick={() => navigate("/organizations")}
            className="mt-6 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Back to organizations
          </button>
        </div>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <Link
            to="/organizations"
            className="text-slate-500 transition hover:text-slate-300"
          >
            Organizations
          </Link>

          <span className="text-slate-700">/</span>

          <Link
            to={`/organizations/${organizationId}`}
            className="max-w-[180px] truncate text-slate-500 transition hover:text-slate-300"
          >
            {organization?.name || "Organization"}
          </Link>

          <span className="text-slate-700">/</span>

          <Link
            to={`/organizations/${organizationId}/projects`}
            className="text-slate-500 transition hover:text-slate-300"
          >
            Projects
          </Link>

          <span className="text-slate-700">/</span>

          <Link
            to={`/organizations/${organizationId}/projects/${projectId}`}
            className="max-w-[180px] truncate text-slate-500 transition hover:text-slate-300"
          >
            {project?.name || "Project"}
          </Link>

          <span className="text-slate-700">/</span>

          <span className="text-slate-300">Services</span>
        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <FiLayers size={21} />
              </div>

              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Services
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {project?.name || "Project"} service inventory
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              Manage APIs, frontends, workers, databases, queues, and other
              engineering services connected to this project.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              <FiPlus size={17} />
              Add service
            </button>
          </div>
        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FiLayers}
            label="Total services"
            value={totalServices}
            description="Registered in this project"
          />

          <StatCard
            icon={FiCheckCircle}
            label="Active"
            value={activeServices}
            description="Currently active"
          />

          <StatCard
            icon={FiAlertCircle}
            label="Inactive"
            value={inactiveServices}
            description="Currently inactive"
          />

          <StatCard
            icon={FiGlobe}
            label="Production"
            value={productionServices}
            description="Running in production"
          />
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <FiSearch
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Type */}

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50"
            >
              <option value="all">All types</option>

              {SERVICE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
            <FiAlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />

            <div className="flex-1">
              <p className="text-sm font-medium text-red-300">
                Unable to load services
              </p>

              <p className="mt-1 text-sm text-red-400/80">{error}</p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              className="text-xs font-medium text-red-300 hover:text-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* =================================================
            SERVICES
        ================================================= */}

        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Service inventory
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredServices.length}{" "}
                {filteredServices.length === 1 ? "service" : "services"} shown
              </p>
            </div>

            {(search || statusFilter !== "all" || typeFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                className="text-xs font-medium text-blue-400 hover:text-blue-300"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Loading */}

          {isLoading && services.length === 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
                />
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  organizationId={organizationId}
                  projectId={projectId}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          ) : (
            /* Empty */

            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-500">
                {search || statusFilter !== "all" || typeFilter !== "all" ? (
                  <FiSearch size={23} />
                ) : (
                  <FiLayers size={23} />
                )}
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-200">
                {search || statusFilter !== "all" || typeFilter !== "all"
                  ? "No matching services"
                  : "No services yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try changing your search or filters to find the service you are looking for."
                  : "Add your first service to start tracking APIs, frontends, workers, databases, and other engineering components."}
              </p>

              {search || statusFilter !== "all" || typeFilter !== "all" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Clear filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  <FiPlus size={16} />
                  Add your first service
                </button>
              )}
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mt-8 border-t border-slate-800 py-6">
          <div className="flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>DevFlow Engineering Platform</p>

            <p>{project?.name || "Project"} · Service inventory</p>
          </div>
        </div>
      </div>

      {/* =================================================
          CREATE MODAL
      ================================================= */}

      <CreateServiceModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        organizationId={organizationId}
        projectId={projectId}
        onCreated={() => {
          // Service store already adds the
          // newly created service to the list.
        }}
      />

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              if (!isDeleting) {
                setDeleteTarget(null);
              }
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <FiTrash2 size={20} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-white">
              Delete service?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              You are about to permanently delete{" "}
              <span className="font-medium text-slate-200">
                {deleteTarget.name}
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <FiLoader size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    Delete service
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Services;
