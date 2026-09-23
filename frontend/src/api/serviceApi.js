import api from "./axios";

// =====================================================
// CREATE SERVICE
// =====================================================

export const createService = async (
  organizationId,
  projectId,
  data
) => {
  const response = await api.post(
    `/organizations/${organizationId}/projects/${projectId}/services`,
    data
  );

  return response.data;
};

// =====================================================
// GET SERVICES
// =====================================================

export const getServices = async (
  organizationId,
  projectId,
  params = {}
) => {
  const response = await api.get(
    `/organizations/${organizationId}/projects/${projectId}/services`,
    {
      params,
    }
  );

  return response.data;
};

// =====================================================
// GET SINGLE SERVICE
// =====================================================

export const getService = async (
  organizationId,
  projectId,
  serviceId
) => {
  const response = await api.get(
    `/organizations/${organizationId}/projects/${projectId}/services/${serviceId}`
  );

  return response.data;
};

// =====================================================
// UPDATE SERVICE
// =====================================================

export const updateService = async (
  organizationId,
  projectId,
  serviceId,
  data
) => {
  const response = await api.patch(
    `/organizations/${organizationId}/projects/${projectId}/services/${serviceId}`,
    data
  );

  return response.data;
};

// =====================================================
// DELETE SERVICE
// =====================================================

export const deleteService = async (
  organizationId,
  projectId,
  serviceId
) => {
  const response = await api.delete(
    `/organizations/${organizationId}/projects/${projectId}/services/${serviceId}`
  );

  return response.data;
};