import { create } from "zustand";

import {
  createProject as createProjectApi,
  getProjects,
  getProject,
  updateProject as updateProjectApi,
  archiveProject as archiveProjectApi,
  deleteProject as deleteProjectApi,
} from "../api/projectApi";

const useProjectStore = create(
  (set) => ({
    // =====================================================
    // STATE
    // =====================================================

    projects: [],
    currentProject: null,

    isLoading: false,
    isProjectLoading: false,

    error: null,

    // =====================================================
    // FETCH PROJECTS
    // =====================================================

    fetchProjects: async (
      organizationId,
      params = {}
    ) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const data = await getProjects(
          organizationId,
          params
        );

        set({
          projects: data.projects || [],
          isLoading: false,
        });

        return data;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load projects.";

        set({
          isLoading: false,
          error: message,
        });

        throw error;
      }
    },

    // =====================================================
    // CREATE PROJECT
    // =====================================================

    createProject: async (
      organizationId,
      projectData
    ) => {
      set({
        isProjectLoading: true,
        error: null,
      });

      try {
        const data =
          await createProjectApi(
            organizationId,
            projectData
          );

        set((state) => ({
          projects: [
            data.project,
            ...state.projects,
          ],
          isProjectLoading: false,
        }));

        return data;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to create project.";

        set({
          isProjectLoading: false,
          error: message,
        });

        throw error;
      }
    },

    // =====================================================
    // FETCH SINGLE PROJECT
    // =====================================================

    fetchProject: async (
      organizationId,
      projectId
    ) => {
      set({
        isProjectLoading: true,
        error: null,
      });

      try {
        const data =
          await getProject(
            organizationId,
            projectId
          );

        set({
          currentProject:
            data.project,
          isProjectLoading: false,
        });

        return data;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load project.";

        set({
          isProjectLoading: false,
          error: message,
        });

        throw error;
      }
    },

    // =====================================================
    // UPDATE PROJECT
    // =====================================================

    updateProject: async (
      organizationId,
      projectId,
      projectData
    ) => {
      set({
        isProjectLoading: true,
        error: null,
      });

      try {
        const data =
          await updateProjectApi(
            organizationId,
            projectId,
            projectData
          );

        set((state) => ({
          projects: state.projects.map(
            (project) =>
              project._id === projectId
                ? data.project
                : project
          ),

          currentProject:
            state.currentProject?._id ===
            projectId
              ? data.project
              : state.currentProject,

          isProjectLoading: false,
        }));

        return data;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to update project.";

        set({
          isProjectLoading: false,
          error: message,
        });

        throw error;
      }
    },

    // =====================================================
    // ARCHIVE PROJECT
    // =====================================================

    archiveProject: async (
      organizationId,
      projectId
    ) => {
      set({
        isProjectLoading: true,
        error: null,
      });

      try {
        const data =
          await archiveProjectApi(
            organizationId,
            projectId
          );

        set((state) => ({
          projects: state.projects.map(
            (project) =>
              project._id === projectId
                ? {
                    ...project,
                    status: "archived",
                  }
                : project
          ),

          currentProject:
            state.currentProject?._id ===
            projectId
              ? data.project
              : state.currentProject,

          isProjectLoading: false,
        }));

        return data;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to archive project.";

        set({
          isProjectLoading: false,
          error: message,
        });

        throw error;
      }
    },

    // =====================================================
    // DELETE PROJECT
    // =====================================================

    deleteProject: async (
      organizationId,
      projectId
    ) => {
      set({
        isProjectLoading: true,
        error: null,
      });

      try {
        const data =
          await deleteProjectApi(
            organizationId,
            projectId
          );

        set((state) => ({
          projects: state.projects.filter(
            (project) =>
              project._id !== projectId
          ),

          currentProject:
            state.currentProject?._id ===
            projectId
              ? null
              : state.currentProject,

          isProjectLoading: false,
        }));

        return data;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to delete project.";

        set({
          isProjectLoading: false,
          error: message,
        });

        throw error;
      }
    },

    // =====================================================
    // CLEAR ERROR
    // =====================================================

    clearError: () => {
      set({
        error: null,
      });
    },

    // =====================================================
    // CLEAR CURRENT PROJECT
    // =====================================================

    clearCurrentProject: () => {
      set({
        currentProject: null,
      });
    },
  })
);

export default useProjectStore;