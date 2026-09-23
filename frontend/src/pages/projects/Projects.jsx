import { useEffect, useMemo, useState } from "react";
import {
  FiArchive,
  FiArrowLeft,
  FiBox,
  FiCheckCircle,
  FiChevronDown,
  FiCode,
  FiEdit2,
  FiEye,
  FiGitBranch,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import {
  Link,
  useParams,
} from "react-router-dom";

import useOrganizationStore from "../../stores/organizationStore";
import useProjectStore from "../../stores/projectStore";

const Projects = () => {
  const { id } = useParams();

  const {
    currentOrganization,
    fetchOrganization,
  } = useOrganizationStore();

  const {
    projects,
    isLoading,
    isProjectLoading,
    error,
    fetchProjects,
    createProject,
    archiveProject,
    deleteProject,
    clearError,
  } = useProjectStore();

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [menuProjectId, setMenuProjectId] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    visibility: "private",
    repository: "",
    environment: "development",
  });

  const [formError, setFormError] =
    useState("");

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    if (!id) return;

    fetchOrganization(id).catch(() => {});

    fetchProjects(id).catch(() => {});
  }, [
    id,
    fetchOrganization,
    fetchProjects,
  ]);

  // =====================================================
  // FILTER PROJECTS
  // =====================================================

  const filteredProjects = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return projects.filter(
      (project) => {
        const matchesSearch =
          !query ||
          project.name
            ?.toLowerCase()
            .includes(query) ||
          project.description
            ?.toLowerCase()
            .includes(query) ||
          project.slug
            ?.toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          project.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    projects,
    search,
    statusFilter,
  ]);

  // =====================================================
  // STATS
  // =====================================================

  const activeCount = projects.filter(
    (project) =>
      project.status === "active"
  ).length;

  const archivedCount = projects.filter(
    (project) =>
      project.status === "archived"
  ).length;

  // =====================================================
  // FORM
  // =====================================================

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      visibility: "private",
      repository: "",
      environment: "development",
    });

    setFormError("");
    clearError();
  };

  const closeCreateModal = () => {
    if (isProjectLoading) {
      return;
    }

    setShowCreateModal(false);
    resetForm();
  };

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
    clearError();
  };

  // =====================================================
  // CREATE PROJECT
  // =====================================================

  const handleCreateProject = async (
    event
  ) => {
    event.preventDefault();

    const name =
      form.name.trim();

    if (!name) {
      setFormError(
        "Project name is required."
      );
      return;
    }

    if (name.length < 2) {
      setFormError(
        "Project name must be at least 2 characters."
      );
      return;
    }

    try {
      await createProject(id, {
        name,
        description:
          form.description.trim(),
        visibility:
          form.visibility,
        repository:
          form.repository.trim(),
        environment:
          form.environment,
      });

      closeCreateModal();
    } catch {
      // Store handles error.
    }
  };

  // =====================================================
  // ARCHIVE
  // =====================================================

  const handleArchive = async (
    project
  ) => {
    const confirmed =
      window.confirm(
        `Archive "${project.name}"?`
      );

    if (!confirmed) return;

    try {
      await archiveProject(
        id,
        project._id
      );

      setMenuProjectId(null);
    } catch {
      // Store handles error.
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    project
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${project.name}" permanently? This action cannot be undone.`
      );

    if (!confirmed) return;

    try {
      await deleteProject(
        id,
        project._id
      );

      setMenuProjectId(null);
    } catch {
      // Store handles error.
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getProjectInitial = (
    name = ""
  ) => {
    return (
      name
        .charAt(0)
        .toUpperCase() || "P"
    );
  };

  const getEnvironmentClasses = (
    environment
  ) => {
    switch (environment) {
      case "production":
        return "bg-emerald-500/10 text-emerald-400";

      case "staging":
        return "bg-amber-500/10 text-amber-400";

      default:
        return "bg-blue-500/10 text-blue-400";
    }
  };

  const getVisibilityLabel = (
    visibility
  ) => {
    if (visibility === "internal") {
      return "Internal";
    }

    if (visibility === "public") {
      return "Public";
    }

    return "Private";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (
    isLoading &&
    !currentOrganization
  ) {
    return (
      <div className="min-h-full bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-52 rounded bg-slate-800" />

            <div className="h-8 w-64 rounded bg-slate-800" />

            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="h-24 rounded-2xl bg-slate-900"
                  />
                )
              )}
            </div>

            <div className="h-80 rounded-2xl bg-slate-900" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div className="min-h-full bg-slate-950">
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <FiBox size={24} />
            </div>

            <h1 className="mt-5 text-lg font-semibold text-white">
              Organization unavailable
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Unable to load this workspace.
            </p>

            <Link
              to="/organizations"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
            >
              <FiArrowLeft size={15} />
              Organizations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =================================================
            BREADCRUMB
        ================================================== */}

        <div className="mb-5 flex items-center gap-2 text-xs">
          <Link
            to="/organizations"
            className="text-slate-500 hover:text-slate-300"
          >
            Organizations
          </Link>

          <span className="text-slate-700">
            /
          </span>

          <Link
            to={`/organizations/${id}`}
            className="text-slate-500 hover:text-slate-300"
          >
            {currentOrganization.name}
          </Link>

          <span className="text-slate-700">
            /
          </span>

          <span className="text-slate-300">
            Projects
          </span>
        </div>

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FiBox size={21} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Projects
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Organize engineering work inside{" "}
                  <span className="text-slate-300">
                    {currentOrganization.name}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to={`/organizations/${id}`}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-800 px-4 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <FiArrowLeft size={15} />
              Overview
            </Link>

            <button
              type="button"
              onClick={() =>
                setShowCreateModal(true)
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500"
            >
              <FiPlus size={16} />
              New project
            </button>
          </div>
        </div>

        {/* =================================================
            STATS
        ================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Total projects
              </span>

              <FiBox
                size={17}
                className="text-slate-600"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-white">
              {projects.length}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Across this workspace
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Active
              </span>

              <FiCheckCircle
                size={17}
                className="text-emerald-500"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-white">
              {activeCount}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Currently active
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Archived
              </span>

              <FiArchive
                size={17}
                className="text-amber-500"
              />
            </div>

            <p className="mt-3 text-2xl font-bold text-white">
              {archivedCount}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              No longer active
            </p>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
            <p className="text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={clearError}
              className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {/* =================================================
            FILTER BAR
        ================================================== */}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <FiSearch
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search projects..."
              className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
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
                label: "Archived",
                value: "archived",
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

        {/* =================================================
            PROJECT GRID
        ================================================== */}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
                />
              )
            )}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map(
              (project) => {
                const initial =
                  getProjectInitial(
                    project.name
                  );

                return (
                  <div
                    key={project._id}
                    className="group relative flex min-h-[260px] flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900"
                  >
                    {/* Top */}

                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-sm font-bold text-blue-400">
                          {initial}
                        </div>

                        <div className="min-w-0">
                          <Link
                            to={`/organizations/${id}/projects/${project._id}`}
                            className="block max-w-[190px] truncate text-sm font-semibold text-white hover:text-blue-400"
                          >
                            {project.name}
                          </Link>

                          <p className="mt-0.5 text-[11px] text-slate-600">
                            {project.slug}
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setMenuProjectId(
                              menuProjectId ===
                                project._id
                                ? null
                                : project._id
                            )
                          }
                          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-800 hover:text-white"
                        >
                          <FiMoreVertical
                            size={17}
                          />
                        </button>

                        {menuProjectId ===
                          project._id && (
                          <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-2xl shadow-black/40">

                            <Link
                              to={`/organizations/${id}/projects/${project._id}`}
                              onClick={() =>
                                setMenuProjectId(
                                  null
                                )
                              }
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                            >
                              <FiEye
                                size={14}
                              />
                              View project
                            </Link>

                            {project.status ===
                              "active" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleArchive(
                                    project
                                  )
                                }
                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                              >
                                <FiArchive
                                  size={14}
                                />
                                Archive
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  project
                                )
                              }
                              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs text-red-400 hover:bg-red-500/10"
                            >
                              <FiTrash2
                                size={14}
                              />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}

                    <p className="mt-5 line-clamp-3 min-h-[54px] text-xs leading-5 text-slate-500">
                      {project.description ||
                        "No project description has been added yet."}
                    </p>

                    {/* Metadata */}

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${getEnvironmentClasses(
                          project.environment
                        )}`}
                      >
                        <FiCode
                          size={11}
                        />

                        {project.environment}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                        <FiEye
                          size={11}
                        />

                        {getVisibilityLabel(
                          project.visibility
                        )}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          project.status ===
                          "active"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {project.status ===
                        "active"
                          ? "Active"
                          : "Archived"}
                      </span>
                    </div>

                    {/* Repository */}

                    {project.repository && (
                      <div className="mt-4 flex min-w-0 items-center gap-2 text-[11px] text-slate-600">
                        <FiGitBranch
                          size={13}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {project.repository}
                        </span>
                      </div>
                    )}

                    {/* Footer */}

                    <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[9px] font-semibold text-slate-400">
                          {getProjectInitial(
                            project.owner?.name ||
                              "U"
                          )}
                        </div>

                        <span className="max-w-[120px] truncate text-[10px] text-slate-600">
                          {project.owner?.name ||
                            "Unknown owner"}
                        </span>
                      </div>

                      <Link
                        to={`/organizations/${id}/projects/${project._id}`}
                        className="text-[11px] font-semibold text-blue-400 hover:text-blue-300"
                      >
                        Open project →
                      </Link>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          /* =================================================
             EMPTY STATE
          ================================================== */

          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-600">
              <FiBox size={24} />
            </div>

            <h2 className="mt-5 text-sm font-semibold text-white">
              {search ||
              statusFilter !== "all"
                ? "No projects found"
                : "No projects yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-600">
              {search ||
              statusFilter !== "all"
                ? "Try changing your search or status filter."
                : "Create your first engineering project to start organizing your work."}
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
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  <FiPlus
                    size={15}
                  />
                  Create project
                </button>
              )}
          </div>
        )}
      </div>

      {/* =====================================================
          CREATE PROJECT MODAL
      ====================================================== */}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">

            {/* Header */}

            <div className="sticky top-0 flex items-start justify-between border-b border-slate-800 bg-slate-900 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Create project
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add a new engineering project to{" "}
                  <span className="text-slate-300">
                    {currentOrganization.name}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeCreateModal
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Form */}

            <form
              onSubmit={
                handleCreateProject
              }
              className="space-y-5 p-6"
            >
              {/* Name */}

              <div>
                <label
                  htmlFor="project-name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Project name
                </label>

                <input
                  id="project-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  placeholder="e.g. DevFlow"
                  autoFocus
                  className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                />

                <p className="mt-1.5 text-[10px] text-slate-600">
                  A URL-friendly slug will be generated automatically.
                </p>
              </div>

              {/* Description */}

              <div>
                <label
                  htmlFor="project-description"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Description
                </label>

                <textarea
                  id="project-description"
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={3}
                  maxLength={500}
                  placeholder="What is this project responsible for?"
                  className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* Two columns */}

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Visibility */}

                <div>
                  <label
                    htmlFor="project-visibility"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Visibility
                  </label>

                  <div className="relative">
                    <select
                      id="project-visibility"
                      name="visibility"
                      value={
                        form.visibility
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full appearance-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 pr-9 text-sm capitalize text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                    >
                      <option value="private">
                        Private
                      </option>

                      <option value="internal">
                        Internal
                      </option>

                      <option value="public">
                        Public
                      </option>
                    </select>

                    <FiChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />
                  </div>
                </div>

                {/* Environment */}

                <div>
                  <label
                    htmlFor="project-environment"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Environment
                  </label>

                  <div className="relative">
                    <select
                      id="project-environment"
                      name="environment"
                      value={
                        form.environment
                      }
                      onChange={
                        handleChange
                      }
                      className="h-11 w-full appearance-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 pr-9 text-sm capitalize text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
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

                    <FiChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Repository */}

              <div>
                <label
                  htmlFor="project-repository"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Repository
                  <span className="ml-1 text-slate-600">
                    optional
                  </span>
                </label>

                <input
                  id="project-repository"
                  name="repository"
                  type="text"
                  value={
                    form.repository
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="github.com/owner/repository"
                  className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* Error */}

              {(formError ||
                error) && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-3">
                  <p className="text-xs text-red-400">
                    {formError ||
                      error}
                  </p>
                </div>
              )}

              {/* Actions */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeCreateModal
                  }
                  className="h-11 rounded-xl border border-slate-800 px-5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isProjectLoading
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProjectLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiPlus size={16} />
                      Create project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;