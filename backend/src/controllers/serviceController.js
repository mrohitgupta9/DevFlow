const Service = require("../models/Service");
const Project = require("../models/Project");

// =====================================================
// HELPERS
// =====================================================

const createSlug = (value) => {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
};

const createUniqueSlug = async (projectId, name, excludeId = null) => {
  const baseSlug = createSlug(name) || "service";

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = {
      project: projectId,
      slug,
    };

    if (excludeId) {
      query._id = {
        $ne: excludeId,
      };
    }

    const existing = await Service.findOne(query);

    if (!existing) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
};

// =====================================================
// CREATE SERVICE
// =====================================================

const createService = async (req, res, next) => {
  try {
    const {
      name,
      description,
      type,
      status,
      environment,
      repository,
      url,
      healthCheckUrl,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Service name is required",
      });
    }

    const project = await Project.findOne({
      _id: req.params.projectId,
      organization: req.organization._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.status === "archived") {
      return res.status(400).json({
        success: false,
        message: "Cannot create a service inside an archived project",
      });
    }

    const slug = await createUniqueSlug(project._id, name);

    const service = await Service.create({
      organization: req.organization._id,

      project: project._id,

      name: name.trim(),

      slug,

      description: description?.trim() || "",

      type: type || "api",

      status: status || "active",

      environment: environment || "development",

      repository: repository?.trim() || "",

      url: url?.trim() || "",

      healthCheckUrl: healthCheckUrl?.trim() || "",

      owner: req.user._id,
    });

    const populatedService = await Service.findById(service._id)
      .populate("owner", "name email avatar")
      .populate("project", "name slug status");

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service: populatedService,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET SERVICES
// =====================================================

const getServices = async (req, res, next) => {
  try {
    const { status, type, environment, search } = req.query;

    const project = await Project.findOne({
      _id: req.params.projectId,
      organization: req.organization._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const query = {
      organization: req.organization._id,

      project: project._id,
    };

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    if (environment) {
      query.environment = environment;
    }

    if (search?.trim()) {
      query.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          slug: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const services = await Service.find(query)
      .populate("owner", "name email avatar")
      .populate("project", "name slug status")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET SINGLE SERVICE
// =====================================================

const getService = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      _id: req.params.serviceId,

      organization: req.organization._id,

      project: req.params.projectId,
    })
      .populate("owner", "name email avatar")
      .populate("project", "name slug status")
      .populate("organization", "name slug");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE SERVICE
// =====================================================

const updateService = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      _id: req.params.serviceId,
      organization: req.organization._id,
      project: req.params.projectId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // -------------------------------------------------
    // Check whether service name is changing
    // -------------------------------------------------

    const nameChanged =
      req.body.name !== undefined && req.body.name.trim() !== service.name;

    // -------------------------------------------------
    // Allowed fields
    // -------------------------------------------------

    const allowedFields = [
      "name",
      "description",
      "type",
      "status",
      "environment",
      "repository",
      "url",
      "healthCheckUrl",
    ];

    // -------------------------------------------------
    // Update fields
    // -------------------------------------------------

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        service[field] =
          typeof req.body[field] === "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    }

    // -------------------------------------------------
    // Regenerate slug when name changes
    // -------------------------------------------------

    if (nameChanged) {
      service.slug = await createUniqueSlug(
        service.project,
        service.name,
        service._id,
      );
    }

    // -------------------------------------------------
    // Save changes
    // -------------------------------------------------

    await service.save();

    // -------------------------------------------------
    // Return updated service
    // -------------------------------------------------

    const updatedService = await Service.findById(service._id)
      .populate("owner", "name email avatar")
      .populate("project", "name slug status");

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE SERVICE
// =====================================================

const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      _id: req.params.serviceId,

      organization: req.organization._id,

      project: req.params.projectId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    await service.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
};
