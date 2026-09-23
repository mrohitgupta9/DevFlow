const Organization = require("../models/Organization");
const OrganizationMember = require("../models/OrganizationMember");
const User = require("../models/User");

const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const createUniqueSlug = async (name) => {
  const baseSlug = createSlug(name);

  let slug = baseSlug;
  let counter = 1;

  while (await Organization.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

const createOrganization = async (
  req,
  res,
  next
) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Organization name is required",
      });
    }

    const slug = await createUniqueSlug(name);

    const organization =
      await Organization.create({
        name: name.trim(),
        slug,
        description: description?.trim() || "",
        owner: req.user._id,
      });

    await OrganizationMember.create({
      organization: organization._id,
      user: req.user._id,
      role: "owner",
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    next(error);
  }
};

const getOrganizations = async (
  req,
  res,
  next
) => {
  try {
    const memberships =
      await OrganizationMember.find({
        user: req.user._id,
        status: "active",
      }).populate({
        path: "organization",
        populate: {
          path: "owner",
          select: "name email avatar",
        },
      });

    const organizations = memberships
      .filter(
        (membership) => membership.organization
      )
      .map((membership) => ({
        ...membership.organization.toObject(),
        role: membership.role,
      }));

    return res.status(200).json({
      success: true,
      count: organizations.length,
      organizations,
    });
  } catch (error) {
    next(error);
  }
};

const getOrganization = async (
  req,
  res,
  next
) => {
  try {
    const organization =
      await Organization.findById(
        req.organization._id
      ).populate(
        "owner",
        "name email avatar"
      );

    return res.status(200).json({
      success: true,
      organization,
      membership: {
        role: req.organizationMember.role,
        status: req.organizationMember.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateOrganization = async (
  req,
  res,
  next
) => {
  try {
    const { name, description } = req.body;

    if (
      name !== undefined &&
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Organization name cannot be empty",
      });
    }

    const organization =
      req.organization;

    if (name !== undefined) {
      organization.name = name.trim();
    }

    if (description !== undefined) {
      organization.description =
        description.trim();
    }

    await organization.save();

    return res.status(200).json({
      success: true,
      message:
        "Organization updated successfully",
      organization,
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrganization = async (
  req,
  res,
  next
) => {
  try {
    const organization =
      req.organization;

    organization.isActive = false;

    await organization.save();

    await OrganizationMember.updateMany(
      {
        organization: organization._id,
      },
      {
        $set: {
          status: "suspended",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Organization deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMembers = async (
  req,
  res,
  next
) => {
  try {
    const members =
      await OrganizationMember.find({
        organization:
          req.organization._id,
      })
        .populate(
          "user",
          "name email role avatar isActive createdAt"
        )
        .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    next(error);
  }
};

const addMember = async (
  req,
  res,
  next
) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const allowedRoles = [
      "admin",
      "developer",
      "viewer",
    ];

    const memberRole =
      role || "developer";

    if (
      !allowedRoles.includes(memberRole)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid organization role",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No user found with this email",
      });
    }

    const existingMember =
      await OrganizationMember.findOne({
        organization:
          req.organization._id,
        user: user._id,
      });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message:
          "User is already a member of this organization",
      });
    }

    const member =
      await OrganizationMember.create({
        organization:
          req.organization._id,
        user: user._id,
        role: memberRole,
        status: "active",
      });

    await member.populate(
      "user",
      "name email role avatar isActive"
    );

    return res.status(201).json({
      success: true,
      message:
        "Member added successfully",
      member,
    });
  } catch (error) {
    next(error);
  }
};

const updateMember = async (
  req,
  res,
  next
) => {
  try {
    const { memberId } = req.params;
    const { role, status } = req.body;

    const member =
      await OrganizationMember.findOne({
        _id: memberId,
        organization:
          req.organization._id,
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Organization member not found",
      });
    }

    if (member.role === "owner") {
      return res.status(403).json({
        success: false,
        message:
          "Owner membership cannot be modified here",
      });
    }

    if (role !== undefined) {
      const allowedRoles = [
        "admin",
        "developer",
        "viewer",
      ];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid organization role",
        });
      }

      member.role = role;
    }

    if (status !== undefined) {
      const allowedStatuses = [
        "active",
        "invited",
        "suspended",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid member status",
        });
      }

      member.status = status;
    }

    await member.save();

    await member.populate(
      "user",
      "name email avatar isActive"
    );

    return res.status(200).json({
      success: true,
      message:
        "Organization member updated successfully",
      member,
    });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (
  req,
  res,
  next
) => {
  try {
    const { memberId } = req.params;

    const member =
      await OrganizationMember.findOne({
        _id: memberId,
        organization:
          req.organization._id,
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Organization member not found",
      });
    }

    if (member.role === "owner") {
      return res.status(403).json({
        success: false,
        message:
          "Organization owner cannot be removed",
      });
    }

    await member.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Member removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getMembers,
  addMember,
  updateMember,
  removeMember,
};