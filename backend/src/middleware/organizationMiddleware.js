const Organization = require("../models/Organization");
const OrganizationMember = require("../models/OrganizationMember");

const organizationMember = async (
  req,
  res,
  next
) => {
  try {
    const organizationId =
      req.params.id ||
      req.params.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    const organization =
      await Organization.findById(
        organizationId
      );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    if (!organization.isActive) {
      return res.status(403).json({
        success: false,
        message: "Organization is inactive",
      });
    }

    const member =
      await OrganizationMember.findOne({
        organization: organization._id,
        user: req.user._id,
        status: "active",
      });

    if (!member) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a member of this organization",
      });
    }

    req.organization = organization;
    req.organizationMember = member;

    next();
  } catch (error) {
    next(error);
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.organizationMember) {
      return res.status(403).json({
        success: false,
        message: "Organization membership required",
      });
    }

    if (
      !allowedRoles.includes(
        req.organizationMember.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to perform this action",
      });
    }

    next();
  };
};

module.exports = {
  organizationMember,
  requireRole,
};