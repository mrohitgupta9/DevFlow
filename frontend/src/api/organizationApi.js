import api from "./axios";

export const createOrganization = async (data) => {
  const response = await api.post(
    "/organizations",
    data
  );

  return response.data;
};

export const getOrganizations = async () => {
  const response = await api.get(
    "/organizations"
  );

  return response.data;
};

export const getOrganization = async (
  organizationId
) => {
  const response = await api.get(
    `/organizations/${organizationId}`
  );

  return response.data;
};

export const updateOrganization = async (
  organizationId,
  data
) => {
  const response = await api.patch(
    `/organizations/${organizationId}`,
    data
  );

  return response.data;
};

export const deleteOrganization = async (
  organizationId
) => {
  const response = await api.delete(
    `/organizations/${organizationId}`
  );

  return response.data;
};

export const getOrganizationMembers =
  async (organizationId) => {
    const response = await api.get(
      `/organizations/${organizationId}/members`
    );

    return response.data;
  };

export const addOrganizationMember = async (
  organizationId,
  data
) => {
  const response = await api.post(
    `/organizations/${organizationId}/members`,
    data
  );

  return response.data;
};

export const updateOrganizationMember =
  async (
    organizationId,
    memberId,
    data
  ) => {
    const response = await api.patch(
      `/organizations/${organizationId}/members/${memberId}`,
      data
    );

    return response.data;
  };

export const removeOrganizationMember =
  async (
    organizationId,
    memberId
  ) => {
    const response = await api.delete(
      `/organizations/${organizationId}/members/${memberId}`
    );

    return response.data;
  };