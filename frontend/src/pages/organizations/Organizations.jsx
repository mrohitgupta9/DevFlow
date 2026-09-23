import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiChevronRight,
  FiGitBranch,
  FiPlus,
  FiSearch,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";

import useOrganizationStore from "../../stores/organizationStore";

const Organizations = () => {
  const {
    organizations,
    isLoading,
    error,
    fetchOrganizations,
    createOrganization,
    clearError,
  } = useOrganizationStore();

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [formError, setFormError] =
    useState("");

  useEffect(() => {
    fetchOrganizations().catch(() => {});
  }, [fetchOrganizations]);

  /*
  |--------------------------------------------------------------------------
  | Filter organizations
  |--------------------------------------------------------------------------
  */

  const filteredOrganizations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return organizations.filter((organization) => {
      const matchesSearch =
        !query ||
        organization.name
          ?.toLowerCase()
          .includes(query) ||
        organization.slug
          ?.toLowerCase()
          .includes(query) ||
        organization.description
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          organization.isActive) ||
        (statusFilter === "inactive" &&
          !organization.isActive);

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    organizations,
    search,
    statusFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Form
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
    clearError();
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const description =
      form.description.trim();

    if (!name) {
      setFormError(
        "Organization name is required."
      );
      return;
    }

    if (name.length < 2) {
      setFormError(
        "Organization name must be at least 2 characters."
      );
      return;
    }

    try {
      await createOrganization({
        name,
        description,
      });

      setForm({
        name: "",
        description: "",
      });

      setFormError("");
      setShowCreateModal(false);
    } catch {
      // Store handles API error.
    }
  };

  const closeModal = () => {
    if (isLoading) return;

    setShowCreateModal(false);

    setForm({
      name: "",
      description: "",
    });

    setFormError("");
    clearError();
  };

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const getInitial = (name = "") => {
    return (
      name
        .charAt(0)
        .toUpperCase() || "D"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isLoading && organizations.length === 0) {
    return (
      <div className="min-h-full">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="space-y-3">
              <div className="h-7 w-56 rounded-lg bg-slate-800" />
              <div className="h-4 w-96 max-w-full rounded bg-slate-800" />
            </div>

            <div className="h-12 rounded-xl bg-slate-900" />

            <div className="grid gap-5 xl:grid-cols-2">
              <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900" />
              <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-full bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
              <FiBriefcase size={13} />

              <span>
                Workspace
              </span>

              <FiChevronRight
                size={13}
                className="text-slate-700"
              />

              <span className="text-slate-400">
                Organizations
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Organizations
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your engineering workspaces,
              teams, services, and projects from one
              place.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreateModal(true)
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <FiPlus size={17} />

            New organization
          </button>
        </div>

        {/* =====================================================
            OVERVIEW STATS
        ====================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Total organizations
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {organizations.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FiGitBranch size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Active workspaces
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {
                    organizations.filter(
                      (organization) =>
                        organization.isActive
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <FiCheck size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Your workspaces
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {organizations.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <FiUsers size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            TOOLBAR
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <FiSearch
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search organizations..."
              className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
            {[
              {
                label: "All",
                value: "all",
              },
              {
                label: "Active",
                value: "active",
              },
              {
                label: "Inactive",
                value: "inactive",
              },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setStatusFilter(
                    filter.value
                  )
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  statusFilter ===
                  filter.value
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* =====================================================
            API ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={clearError}
              className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-500/10"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {/* =====================================================
            ORGANIZATIONS
        ====================================================== */}

        {filteredOrganizations.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredOrganizations.map(
              (organization) => {
                const initial =
                  getInitial(
                    organization.name
                  );

                return (
                  <div
                    key={organization._id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900"
                  >
                    {/* Top accent */}

                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500/60 via-blue-400/20 to-transparent opacity-0 transition group-hover:opacity-100" />

                    <div className="p-6">

                      {/* Card header */}

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-lg font-bold text-blue-400">
                            {initial}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h2 className="truncate text-base font-semibold text-white">
                                {organization.name}
                              </h2>

                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  organization.isActive
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-slate-800 text-slate-500"
                                }`}
                              >
                                {organization.isActive
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>

                            <p className="mt-1 truncate text-xs text-slate-600">
                              /{organization.slug}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}

                      <p className="mt-5 min-h-10 text-sm leading-5 text-slate-500">
                        {organization.description ||
                          "Engineering workspace for managing projects, services, teams, and incidents."}
                      </p>

                      {/* Divider */}

                      <div className="my-5 border-t border-slate-800" />

                      {/* Metrics */}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                            Members
                          </p>

                          <div className="mt-1.5 flex items-center gap-2">
                            <FiUsers
                              size={14}
                              className="text-slate-600"
                            />

                            <span className="text-sm font-semibold text-slate-300">
                              —
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                            Created
                          </p>

                          <p className="mt-1.5 text-sm font-semibold text-slate-300">
                            {organization.createdAt
                              ? new Date(
                                  organization.createdAt
                                ).toLocaleDateString(
                                  undefined,
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}

                      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <FiBriefcase
                            size={13}
                          />

                          <span>
                            Engineering workspace
                          </span>
                        </div>

                        <Link
                          to={`/organizations/${organization._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          Open workspace

                          <FiArrowRight
                            size={14}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          /* ===================================================
             EMPTY STATE
          ==================================================== */

          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-600">
              <FiGitBranch size={24} />
            </div>

            <h3 className="mt-5 text-base font-semibold text-white">
              {search ||
              statusFilter !== "all"
                ? "No organizations found"
                : "No organizations yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search ||
              statusFilter !== "all"
                ? "Try changing your search or filter to find another workspace."
                : "Create your first engineering organization to start managing projects, services, teams, and incidents."}
            </p>

            {!search &&
              statusFilter ===
                "all" && (
                <button
                  type="button"
                  onClick={() =>
                    setShowCreateModal(
                      true
                    )
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <FiPlus size={16} />

                  Create organization
                </button>
              )}
          </div>
        )}

        {/* =====================================================
            CREATE MODAL
        ====================================================== */}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">

              {/* Modal header */}

              <div className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Create organization
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Set up a new engineering workspace.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Modal body */}

              <form
                onSubmit={handleCreate}
                className="space-y-5 p-6"
              >
                {/* Name */}

                <div>
                  <label
                    htmlFor="organization-name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Organization name
                  </label>

                  <input
                    id="organization-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Acme Engineering"
                    autoFocus
                    maxLength={100}
                    className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                {/* Description */}

                <div>
                  <label
                    htmlFor="organization-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Description
                    <span className="ml-1 text-slate-600">
                      (optional)
                    </span>
                  </label>

                  <textarea
                    id="organization-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="What is this workspace used for?"
                    rows={4}
                    maxLength={500}
                    className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                  />

                  <p className="mt-1.5 text-right text-[11px] text-slate-600">
                    {form.description.length}/500
                  </p>
                </div>

                {/* Error */}

                {(formError || error) && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-3">
                    <p className="text-xs text-red-400">
                      {formError ||
                        error}
                    </p>
                  </div>
                )}

                {/* Actions */}

                <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isLoading}
                    className="h-11 rounded-xl border border-slate-800 px-5 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Creating...
                      </>
                    ) : (
                      <>
                        <FiPlus size={16} />

                        Create organization
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;