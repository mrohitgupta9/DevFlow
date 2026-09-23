import { create } from "zustand";

import {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
} from "../api/serviceApi";

const useServiceStore = create((set, get) => ({
  // =========================================================
  // STATE
  // =========================================================

  services: [],
  currentService: null,

  isLoading: false,
  isServiceLoading: false,

  error: null,

  // =========================================================
  // FETCH SERVICES
  // =========================================================

  fetchServices: async (organizationId, projectId) => {
    if (!organizationId || !projectId) {
      return;
    }

    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await getServices(
        organizationId,
        projectId
      );

      const services =
        response?.data?.services ||
        response?.services ||
        [];

      set({
        services,
        isLoading: false,
        error: null,
      });

      return services;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load services";

      set({
        services: [],
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // =========================================================
  // FETCH SINGLE SERVICE
  // =========================================================

  fetchService: async (
    organizationId,
    projectId,
    serviceId
  ) => {
    if (
      !organizationId ||
      !projectId ||
      !serviceId
    ) {
      return;
    }

    set({
      isServiceLoading: true,
      error: null,
    });

    try {
      const response = await getService(
        organizationId,
        projectId,
        serviceId
      );

      const service =
        response?.data?.service ||
        response?.service ||
        null;

      set({
        currentService: service,
        isServiceLoading: false,
        error: null,
      });

      return service;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load service";

      set({
        currentService: null,
        isServiceLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // =========================================================
  // CREATE SERVICE
  // =========================================================

  createService: async (
    organizationId,
    projectId,
    data
  ) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await createService(
        organizationId,
        projectId,
        data
      );

      const service =
        response?.data?.service ||
        response?.service;

      if (service) {
        set((state) => ({
          services: [
            service,
            ...state.services,
          ],
          isLoading: false,
        }));
      } else {
        set({
          isLoading: false,
        });
      }

      return service;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create service";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // =========================================================
  // UPDATE SERVICE
  // =========================================================

  updateService: async (
    organizationId,
    projectId,
    serviceId,
    data
  ) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await updateService(
        organizationId,
        projectId,
        serviceId,
        data
      );

      const updatedService =
        response?.data?.service ||
        response?.service;

      set((state) => ({
        services: state.services.map(
          (service) =>
            service._id === serviceId
              ? updatedService
              : service
        ),

        currentService:
          state.currentService?._id === serviceId
            ? updatedService
            : state.currentService,

        isLoading: false,
      }));

      return updatedService;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update service";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // =========================================================
  // DELETE SERVICE
  // =========================================================

  deleteService: async (
    organizationId,
    projectId,
    serviceId
  ) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      await deleteService(
        organizationId,
        projectId,
        serviceId
      );

      set((state) => ({
        services: state.services.filter(
          (service) =>
            service._id !== serviceId
        ),

        currentService:
          state.currentService?._id === serviceId
            ? null
            : state.currentService,

        isLoading: false,
      }));
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to delete service";

      set({
        isLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // =========================================================
  // REFRESH
  // =========================================================

  refreshServices: async (
    organizationId,
    projectId
  ) => {
    return get().fetchServices(
      organizationId,
      projectId
    );
  },

  // =========================================================
  // CLEAR ERROR
  // =========================================================

  clearError: () => {
    set({
      error: null,
    });
  },

  // =========================================================
  // CLEAR CURRENT SERVICE
  // =========================================================

  clearCurrentService: () => {
    set({
      currentService: null,
    });
  },

  // =========================================================
  // RESET
  // =========================================================

  resetServiceState: () => {
    set({
      services: [],
      currentService: null,
      isLoading: false,
      isServiceLoading: false,
      error: null,
    });
  },
}));

export default useServiceStore;