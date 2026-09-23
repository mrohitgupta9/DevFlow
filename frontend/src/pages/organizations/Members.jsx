import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiChevronDown,
  FiEdit2,
  FiMail,
  FiMoreVertical,
  FiPlus,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import {
  Link,
  useParams,
} from "react-router-dom";

import useOrganizationStore from "../../stores/organizationStore";

const Members = () => {
  const { id } = useParams();

  const {
    currentOrganization,
    members,
    isLoading,
    isMembersLoading,
    error,
    fetchOrganization,
    fetchMembers,
    addMember,
    updateMember,
    removeMember,
    clearError,
  } = useOrganizationStore();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("all");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [editingMember, setEditingMember] =
    useState(null);

  const [menuMemberId, setMenuMemberId] =
    useState(null);

  const [form, setForm] = useState({
    email: "",
    role: "developer",
  });

  const [formError, setFormError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | Load organization + members
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!id) return;

    fetchOrganization(id).catch(() => {});
    fetchMembers(id).catch(() => {});
  }, [
    id,
    fetchOrganization,
    fetchMembers,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Filter members
  |--------------------------------------------------------------------------
  */

  const filteredMembers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return members.filter((member) => {
      const user = member.user || {};

      const matchesSearch =
        !query ||
        user.name
          ?.toLowerCase()
          .includes(query) ||
        user.email
          ?.toLowerCase()
          .includes(query);

      const matchesRole =
        roleFilter === "all" ||
        member.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    members,
    search,
    roleFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Form helpers
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setForm({
      email: "",
      role: "developer",
    });

    setFormError("");
    clearError();
  };

  const closeModal = () => {
    if (isLoading || isMembersLoading) {
      return;
    }

    setShowAddModal(false);
    setEditingMember(null);
    resetForm();
  };

  const handleFormChange = (event) => {
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

  /*
  |--------------------------------------------------------------------------
  | Add member
  |--------------------------------------------------------------------------
  */

  const handleAddMember = async (
    event
  ) => {
    event.preventDefault();

    const email =
      form.email.trim().toLowerCase();

    if (!email) {
      setFormError(
        "Member email is required."
      );
      return;
    }

    if (
      !/^\S+@\S+\.\S+$/.test(email)
    ) {
      setFormError(
        "Please enter a valid email address."
      );
      return;
    }

    try {
      await addMember(id, {
        email,
        role: form.role,
      });

      closeModal();
    } catch {
      // Store contains API error.
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Edit role
  |--------------------------------------------------------------------------
  */

  const handleEditRole = async (
    memberId,
    role
  ) => {
    try {
      await updateMember(id, memberId, {
        role,
      });

      setEditingMember(null);
      setMenuMemberId(null);
    } catch {
      // Store contains API error.
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Remove member
  |--------------------------------------------------------------------------
  */

  const handleRemoveMember = async (
    member
  ) => {
    const userName =
      member.user?.name ||
      member.user?.email ||
      "this member";

    const confirmed = window.confirm(
      `Remove ${userName} from this organization?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeMember(
        id,
        member._id
      );

      setMenuMemberId(null);
    } catch {
      // Store contains API error.
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial
  |--------------------------------------------------------------------------
  */

  const getInitial = (name = "") => {
    return (
      name
        .charAt(0)
        .toUpperCase() || "U"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Role badge
  |--------------------------------------------------------------------------
  */

  const getRoleClasses = (role) => {
    switch (role) {
      case "owner":
        return "bg-amber-500/10 text-amber-400";

      case "admin":
        return "bg-violet-500/10 text-violet-400";

      case "developer":
        return "bg-blue-500/10 text-blue-400";

      case "viewer":
        return "bg-slate-800 text-slate-400";

      default:
        return "bg-slate-800 text-slate-400";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (
    isLoading &&
    !currentOrganization
  ) {
    return (
      <div className="min-h-full bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-48 rounded bg-slate-800" />

            <div className="h-8 w-64 rounded bg-slate-800" />

            <div className="h-12 rounded-xl bg-slate-900" />

            <div className="h-96 rounded-2xl border border-slate-800 bg-slate-900/60" />
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Organization unavailable
  |--------------------------------------------------------------------------
  */

  if (!currentOrganization) {
    return (
      <div className="min-h-full bg-slate-950">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <FiUsers size={24} />
            </div>

            <h1 className="mt-5 text-lg font-semibold text-white">
              Organization unavailable
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error ||
                "Unable to load this organization."}
            </p>

            <Link
              to="/organizations"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
            >
              <FiArrowLeft size={16} />
              Back to organizations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const organization =
    currentOrganization;

  return (
    <div className="min-h-full bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-7">
          <div className="mb-4 flex items-center gap-2 text-xs">
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
              className="truncate text-slate-500 hover:text-slate-300"
            >
              {organization.name}
            </Link>

            <span className="text-slate-700">
              /
            </span>

            <span className="text-slate-300">
              Members
            </span>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FiUsers size={20} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">
                    Members
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage access and roles for{" "}
                    <span className="text-slate-300">
                      {organization.name}
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
                  setShowAddModal(true)
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500"
              >
                <FiPlus size={16} />

                Add member
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

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

        {/* =====================================================
            TOOLBAR
        ====================================================== */}

        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-3 sm:flex-row sm:items-center sm:justify-between">
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
              placeholder="Search members..."
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
                label: "Owners",
                value: "owner",
              },
              {
                label: "Admins",
                value: "admin",
              },
              {
                label: "Developers",
                value: "developer",
              },
              {
                label: "Viewers",
                value: "viewer",
              },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setRoleFilter(
                    filter.value
                  )
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  roleFilter ===
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
            MEMBER TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">

          {/* Table header */}

          <div className="hidden grid-cols-[minmax(240px,1.8fr)_1fr_1fr_100px] gap-4 border-b border-slate-800 bg-slate-900/80 px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600 md:grid">
            <span>Member</span>
            <span>Role</span>
            <span>Status</span>
            <span className="text-right">
              Actions
            </span>
          </div>

          {isMembersLoading ? (
            <div className="divide-y divide-slate-800">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="animate-pulse p-5"
                  >
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-800" />

                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 rounded bg-slate-800" />
                        <div className="h-3 w-56 rounded bg-slate-800" />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : filteredMembers.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {filteredMembers.map(
                (member) => {
                  const user =
                    member.user || {};

                  const name =
                    user.name ||
                    "Unknown user";

                  const email =
                    user.email ||
                    "No email";

                  const initial =
                    getInitial(name);

                  const isOwner =
                    member.role ===
                    "owner";

                  return (
                    <div
                      key={member._id}
                      className="relative px-5 py-5 transition hover:bg-slate-950/50 sm:px-6"
                    >
                      <div className="grid gap-4 md:grid-cols-[minmax(240px,1.8fr)_1fr_1fr_100px] md:items-center">

                        {/* Member */}

                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-300">
                            {initial}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-medium text-slate-200">
                                {name}
                              </p>

                              {isOwner && (
                                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold text-amber-400">
                                  OWNER
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-600">
                              <FiMail
                                size={12}
                              />

                              {email}
                            </p>
                          </div>
                        </div>

                        {/* Role */}

                        <div>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${getRoleClasses(
                              member.role
                            )}`}
                          >
                            <FiShield
                              size={11}
                            />

                            {member.role}
                          </span>
                        </div>

                        {/* Status */}

                        <div>
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                            {member.status ||
                              "active"}
                          </span>
                        </div>

                        {/* Actions */}

                        <div className="relative flex justify-end">
                          <button
                            type="button"
                            disabled={isOwner}
                            onClick={() =>
                              setMenuMemberId(
                                menuMemberId ===
                                  member._id
                                  ? null
                                  : member._id
                              )
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label={`Actions for ${name}`}
                          >
                            <FiMoreVertical
                              size={17}
                            />
                          </button>

                          {menuMemberId ===
                            member._id &&
                            !isOwner && (
                              <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-2xl shadow-black/40">

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMember(
                                      member
                                    );
                                    setForm({
                                      email,
                                      role:
                                        member.role,
                                    });
                                    setMenuMemberId(
                                      null
                                    );
                                  }}
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                                >
                                  <FiEdit2
                                    size={14}
                                  />

                                  Change role
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveMember(
                                      member
                                    )
                                  }
                                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs text-red-400 hover:bg-red-500/10"
                                >
                                  <FiTrash2
                                    size={14}
                                  />

                                  Remove member
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            /* Empty */

            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-600">
                <FiUsers size={24} />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-white">
                {search ||
                roleFilter !== "all"
                  ? "No members found"
                  : "No members yet"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-600">
                {search ||
                roleFilter !== "all"
                  ? "Try changing your search or role filter."
                  : "Add developers, admins, or viewers to this organization."}
              </p>

              {!search &&
                roleFilter ===
                  "all" && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAddModal(
                        true
                      )
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    <FiPlus
                      size={15}
                    />

                    Add member
                  </button>
                )}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          ADD MEMBER MODAL
      ====================================================== */}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">

            <div className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Add member
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Give a user access to this workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
              >
                <FiX size={18} />
              </button>
            </div>

            <form
              onSubmit={handleAddMember}
              className="space-y-5 p-6"
            >
              <div>
                <label
                  htmlFor="member-email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <input
                  id="member-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="developer@example.com"
                  autoFocus
                  className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="member-role"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Role
                </label>

                <div className="relative">
                  <select
                    id="member-role"
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                    className="h-11 w-full appearance-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 pr-10 text-sm capitalize text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                  >
                    <option value="admin">
                      Admin
                    </option>

                    <option value="developer">
                      Developer
                    </option>

                    <option value="viewer">
                      Viewer
                    </option>
                  </select>

                  <FiChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                </div>
              </div>

              {(formError ||
                error) && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-3">
                  <p className="text-xs text-red-400">
                    {formError ||
                      error}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-11 rounded-xl border border-slate-800 px-5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    isMembersLoading
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isMembersLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Adding...
                    </>
                  ) : (
                    <>
                      <FiPlus size={16} />

                      Add member
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          EDIT ROLE MODAL
      ====================================================== */}

      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">

            <div className="flex items-start justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Change member role
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Update access level for{" "}
                  <span className="text-slate-300">
                    {editingMember.user?.name ||
                      editingMember.user?.email}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingMember(
                    null
                  )
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="edit-member-role"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Role
                </label>

                <div className="relative">
                  <select
                    id="edit-member-role"
                    value={form.role}
                    onChange={(event) =>
                      setForm(
                        (current) => ({
                          ...current,
                          role:
                            event.target
                              .value,
                        })
                      )
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 pr-10 text-sm capitalize text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                  >
                    <option value="admin">
                      Admin
                    </option>

                    <option value="developer">
                      Developer
                    </option>

                    <option value="viewer">
                      Viewer
                    </option>
                  </select>

                  <FiChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setEditingMember(
                      null
                    )
                  }
                  className="h-11 rounded-xl border border-slate-800 px-5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleEditRole(
                      editingMember._id,
                      form.role
                    )
                  }
                  disabled={
                    isMembersLoading
                  }
                  className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isMembersLoading
                    ? "Saving..."
                    : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;