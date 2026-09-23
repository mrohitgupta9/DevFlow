import { create } from "zustand";

import {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationMembers,
  addOrganizationMember,
  updateOrganizationMember,
  removeOrganizationMember,
} from "../api/organizationApi";

const useOrganizationStore = create(
  (set, get) => ({
    organizations: [],
    currentOrganization: null,
    members: [],

    isLoading: false,
    isMembersLoading: false,

    error: null,

    fetchOrganizations: async () => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const response =
          await getOrganizations();

        set({
          organizations:
            response.organizations || [],
          isLoading: false,
          error: null,
        });

        return response;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load organizations";

        set({
          isLoading: false,
          error: message,
        });

        throw error;
      }
    },

    createOrganization: async (data) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const response =
          await createOrganization(data);

        const organization =
          response.organization;

        set((state) => ({
          organizations: [
            organization,
            ...state.organizations,
          ],
          currentOrganization:
            organization,
          isLoading: false,
          error: null,
        }));

        return response;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to create organization";

        set({
          isLoading: false,
          error: message,
        });

        throw error;
      }
    },

    fetchOrganization: async (
      organizationId
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const response =
          await getOrganization(
            organizationId
          );

        set({
          currentOrganization:
            response.organization,
          isLoading: false,
          error: null,
        });

        return response;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load organization";

        set({
          isLoading: false,
          error: message,
        });

        throw error;
      }
    },

    updateOrganization: async (
      organizationId,
      data
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const response =
          await updateOrganization(
            organizationId,
            data
          );

        set((state) => ({
          organizations:
            state.organizations.map(
              (organization) =>
                organization._id ===
                organizationId
                  ? {
                      ...organization,
                      ...response.organization,
                    }
                  : organization
            ),

          currentOrganization:
            response.organization,

          isLoading: false,
          error: null,
        }));

        return response;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to update organization";

        set({
          isLoading: false,
          error: message,
        });

        throw error;
      }
    },

    deleteOrganization: async (
      organizationId
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const response =
          await deleteOrganization(
            organizationId
          );

        set((state) => ({
          organizations:
            state.organizations.filter(
              (organization) =>
                organization._id !==
                organizationId
            ),

          currentOrganization:
            state.currentOrganization?._id ===
            organizationId
              ? null
              : state.currentOrganization,

          isLoading: false,
          error: null,
        }));

        return response;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to delete organization";

        set({
          isLoading: false,
          error: message,
        });

        throw error;
      }
    },

    fetchMembers: async (
      organizationId
    ) => {
      set({
        isMembersLoading: true,
        error: null,
      });

      try {
        const response =
          await getOrganizationMembers(
            organizationId
          );

        set({
          members: response.members || [],
          isMembersLoading: false,
          error: null,
        });

        return response;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load organization members";

        set({
          isMembersLoading: false,
          error: message,
        });

        throw error;
      }
    },

    addMember: async (
      organizationId,
      data
    ) => {
      try {
        const response =
          await addOrganizationMember(
            organizationId,
            data
          );

        set((state) => ({
          members: [
            ...state.members,
            response.member,
          ],
          error: null,
        }));

        return response;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to add member";

        set({
          error: message,
        });

        throw error;
      }
    },

    updateMember: async (
      organizationId,
      memberId,
      data
    ) => {
      try {
        const response =
          await updateOrganizationMember(
            organizationId,
            memberId,
            data
          );

        set((state) => ({
          members:
            state.members.map((member) =>
              member._id === memberId
                ? response.member
                : member
            ),
          error: null,
        }));

        return response;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to update member";

        set({
          error: message,
        });

        throw error;
      }
    },

    removeMember: async (
      organizationId,
      memberId
    ) => {
      try {
        const response =
          await removeOrganizationMember(
            organizationId,
            memberId
          );

        set((state) => ({
          members:
            state.members.filter(
              (member) =>
                member._id !== memberId
            ),
          error: null,
        }));

        return response;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to remove member";

        set({
          error: message,
        });

        throw error;
      }
    },

    clearError: () => {
      set({
        error: null,
      });
    },

    clearCurrentOrganization: () => {
      set({
        currentOrganization: null,
        members: [],
      });
    },
  })
);

export default useOrganizationStore;