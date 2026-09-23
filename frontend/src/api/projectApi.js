import api from "./axios";

export const createProject = async (
  organizationId,
  data
) => {
  const response = await api.post(
    `/organizations/${organizationId}/projects`,
    data
  );

  return response.data;
};

export const getProjects = async (
  organizationId,
  params = {}
) => {
  const response = await api.get(
    `/organizations/${organizationId}/projects`,
    {
      params,
    }
  );

  return response.data;
};

export const getProject = async (
  organizationId,
  projectId
) => {
  const response = await api.get(
    `/organizations/${organizationId}/projects/${projectId}`
  );

  return response.data;
};

export const updateProject = async (
  organizationId,
  projectId,
  data
) => {
  const response = await api.patch(
    `/organizations/${organizationId}/projects/${projectId}`,
    data
  );

  return response.data;
};

export const archiveProject = async (
  organizationId,
  projectId
) => {
  const response = await api.post(
    `/organizations/${organizationId}/projects/${projectId}/archive`
  );

  return response.data;
};

export const deleteProject = async (
  organizationId,
  projectId
) => {
  const response = await api.delete(
    `/organizations/${organizationId}/projects/${projectId}`
  );

  return response.data;
};