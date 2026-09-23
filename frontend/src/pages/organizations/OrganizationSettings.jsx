import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheck,
  FiCopy,
  FiInfo,
  FiSave,
  FiSettings,
  FiShield,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import useOrganizationStore from "../../stores/organizationStore";

const OrganizationSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const organization = useOrganizationStore(
    (state) => state.currentOrganization
  );

  const isLoading = useOrganizationStore(
    (state) => state.isLoading
  );

  const error = useOrganizationStore(
    (state) => state.error
  );

  const fetchOrganization = useOrganizationStore(
    (state) => state.fetchOrganization
  );

  const updateOrganization = useOrganizationStore(
    (state) => state.updateOrganization
  );

  const deleteOrganization = useOrganizationStore(
    (state) => state.deleteOrganization
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOrganization(id).catch(() => {});
  }, [id, fetchOrganization]);

  useEffect(() => {
    if (!organization) return;

    setForm({
      name: organization.name || "",
      description: organization.description || "",
    });
  }, [organization]);

  const handleChange = (field, value) => {
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
      await updateOrganization(id, {
        name: form.name.trim(),
        description: form.description.trim(),
      });

      setSuccess("Organization settings saved successfully.");
    } catch {
      // Store handles API error.
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${organization?.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteOrganization(id);

      navigate("/organizations");
    } catch {
      setIsDeleting(false);
    }
  };

  const copySlug = async () => {
    if (!organization?.slug) return;

    try {
      await navigator.clipboard.writeText(
        organization.slug
      );
    } catch {
      // Ignore clipboard errors.
    }
  };

  if (isLoading && !organization) {
    return (
      <div className="min-h-full bg-slate-950 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-72 animate-pulse rounded bg-slate-800" />
          <div className="mt-6 h-96 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
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
              navigate(`/organizations/${id}`)
            }
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300"
          >
            <FiArrowLeft size={15} />
            Back to organization
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <FiSettings size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Organization settings
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your organization profile and
                configuration.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            <FiAlertTriangle className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}

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
                  className="text-blue-400"
                  size={18}
                />

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    General
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Basic information about this organization.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="space-y-6 p-6">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Organization name
                  </label>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      handleChange(
                        "name",
                        e.target.value
                      )
                    }
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    placeholder="Organization name"
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
                      handleChange(
                        "description",
                        e.target.value
                      )
                    }
                    maxLength={500}
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    placeholder="Describe this organization..."
                  />

                  <p className="mt-2 text-right text-xs text-slate-600">
                    {form.description.length}/500
                  </p>
                </div>

                {/* Slug */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Organization slug
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      value={organization?.slug || ""}
                      readOnly
                      className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-500 outline-none"
                    />

                    <button
                      type="button"
                      onClick={copySlug}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                      title="Copy slug"
                    >
                      <FiCopy size={16} />
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-slate-600">
                    Slugs are used as stable identifiers and
                    cannot be edited here.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end border-t border-slate-800 px-6 py-4">
                <button
                  type="submit"
                  disabled={
                    isSaving ||
                    !form.name.trim()
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiSave size={15} />

                  {isSaving
                    ? "Saving..."
                    : "Save changes"}
                </button>
              </div>
            </form>
          </section>

          {/* Organization information */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3">
              <FiShield
                className="text-violet-400"
                size={18}
              />

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Organization information
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  System-managed organization details.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <InfoCard
                label="Organization ID"
                value={organization?._id}
              />

              <InfoCard
                label="Status"
                value={
                  organization?.isActive
                    ? "Active"
                    : "Inactive"
                }
              />

              <InfoCard
                label="Created"
                value={
                  organization?.createdAt
                    ? new Date(
                        organization.createdAt
                      ).toLocaleDateString("en-IN")
                    : "—"
                }
              />
            </div>
          </section>

          {/* Danger zone */}

          <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.025]">
            <div className="border-b border-red-500/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <FiAlertTriangle
                  className="text-red-400"
                  size={18}
                />

                <div>
                  <h2 className="text-sm font-semibold text-red-300">
                    Danger zone
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Irreversible organization operations.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-200">
                  Delete organization
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  This permanently removes the organization
                  and its registered configuration.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
              >
                <FiTrash2 size={15} />

                {isDeleting
                  ? "Deleting..."
                  : "Delete organization"}
              </button>
            </div>
          </section>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-2 truncate text-sm text-slate-300">
        {value || "—"}
      </p>
    </div>
  );
};

export default OrganizationSettings;