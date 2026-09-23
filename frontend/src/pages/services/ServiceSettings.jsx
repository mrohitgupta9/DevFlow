import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheck,
  FiCopy,
  FiDatabase,
  FiInfo,
  FiSave,
  FiSettings,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import useProjectStore from "../../stores/projectStore";

const ProjectSettings = () => {
  const { id, projectId } = useParams();
  const navigate = useNavigate();

  const project = useProjectStore(
    (state) => state.currentProject
  );

  const isLoading = useProjectStore(
    (state) => state.isProjectLoading
  );

  const error = useProjectStore(
    (state) => state.error
  );

  const fetchProject = useProjectStore(
    (state) => state.fetchProject
  );

  const updateProject = useProjectStore(
    (state) => state.updateProject
  );

  const deleteProject = useProjectStore(
    (state) => state.deleteProject
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
    visibility: "private",
    repository: "",
    environment: "development",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProject(id, projectId).catch(() => {});
  }, [id, projectId, fetchProject]);

  useEffect(() => {
    if (!project) return;

    setForm({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "active",
      visibility: project.visibility || "private",
      repository: project.repository || "",
      environment:
        project.environment || "development",
    });
  }, [project]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccess("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) return;

    setIsSaving(true);
    setSuccess("");

    try {
      await updateProject(id, projectId, {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        visibility: form.visibility,
        repository: form.repository.trim(),
        environment: form.environment,
      });

      setSuccess("Project settings saved successfully.");
    } catch {
      // Store handles error.
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${project?.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteProject(id, projectId);

      navigate(
        `/organizations/${id}/projects`
      );
    } catch {
      setIsDeleting(false);
    }
  };

  const copySlug = async () => {
    if (!project?.slug) return;

    try {
      await navigator.clipboard.writeText(
        project.slug
      );
    } catch {}
  };

  if (isLoading && !project) {
    return (
      <div className="min-h-full bg-slate-950 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-72 animate-pulse rounded bg-slate-800" />
          <div className="mt-6 h-[600px] animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-slate-950">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/organizations/${id}/projects/${projectId}`
              )
            }
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300"
          >
            <FiArrowLeft size={15} />
            Back to project
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <FiSettings size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-white">
                Project settings
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage project configuration, visibility
                and environment.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            <FiAlertTriangle />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-400">
            <FiCheck />
            {success}
          </div>
        )}

        <div className="space-y-6">

          {/* General */}

          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="border-b border-slate-800 px-6 py-5">
              <div className="flex items-center gap-3">
                <FiInfo
                  size={18}
                  className="text-blue-400"
                />

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    General
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Core project information.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="space-y-6 p-6">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Project name
                  </label>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      updateField(
                        "name",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      updateField(
                        "description",
                        e.target.value
                      )
                    }
                    maxLength={500}
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />

                  <p className="mt-2 text-right text-xs text-slate-600">
                    {form.description.length}/500
                  </p>
                </div>

                {/* Two columns */}

                <div className="grid gap-5 md:grid-cols-2">

                  <FieldSelect
                    label="Status"
                    value={form.status}
                    onChange={(value) =>
                      updateField(
                        "status",
                        value
                      )
                    }
                    options={[
                      ["active", "Active"],
                      ["archived", "Archived"],
                    ]}
                  />

                  <FieldSelect
                    label="Visibility"
                    value={form.visibility}
                    onChange={(value) =>
                      updateField(
                        "visibility",
                        value
                      )
                    }
                    options={[
                      ["private", "Private"],
                      ["internal", "Internal"],
                      ["public", "Public"],
                    ]}
                  />

                  <FieldSelect
                    label="Environment"
                    value={form.environment}
                    onChange={(value) =>
                      updateField(
                        "environment",
                        value
                      )
                    }
                    options={[
                      [
                        "development",
                        "Development",
                      ],
                      ["staging", "Staging"],
                      [
                        "production",
                        "Production",
                      ],
                    ]}
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Repository
                    </label>

                    <input
                      value={form.repository}
                      onChange={(e) =>
                        updateField(
                          "repository",
                          e.target.value
                        )
                      }
                      placeholder="https://github.com/..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Slug */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Project slug
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={project?.slug || ""}
                      readOnly
                      className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-500"
                    />

                    <button
                      type="button"
                      onClick={copySlug}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                      <FiCopy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-800 px-6 py-4">
                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    !form.name.trim()
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  <FiSave size={15} />

                  {isSaving
                    ? "Saving..."
                    : "Save changes"}
                </button>
              </div>
            </form>
          </section>

          {/* Project metadata */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3">
              <FiDatabase
                size={18}
                className="text-violet-400"
              />

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Project information
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  System-managed project information.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <InfoCard
                label="Project ID"
                value={project?._id}
              />

              <InfoCard
                label="Created"
                value={
                  project?.createdAt
                    ? new Date(
                        project.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "—"
                }
              />

              <InfoCard
                label="Updated"
                value={
                  project?.updatedAt
                    ? new Date(
                        project.updatedAt
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "—"
                }
              />
            </div>
          </section>

          {/* Danger */}

          <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.025]">
            <div className="border-b border-red-500/10 px-6 py-5">
              <h2 className="text-sm font-semibold text-red-300">
                Danger zone
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Irreversible project operations.
              </p>
            </div>

            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-200">
                  Delete project
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Permanently remove this project and its
                  registered configuration.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50"
              >
                <FiTrash2 size={15} />

                {isDeleting
                  ? "Deleting..."
                  : "Delete project"}
              </button>
            </div>
          </section>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
};

const FieldSelect = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
      >
        {options.map(([optionValue, label]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
      {label}
    </p>

    <p className="mt-2 truncate text-sm text-slate-300">
      {value || "—"}
    </p>
  </div>
);

export default ProjectSettings;