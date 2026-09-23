const Project = require("../models/Project");

const createSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
};

const createUniqueSlug = async (
  organizationId,
  name
) => {
  const baseSlug = createSlug(name);

  let slug = baseSlug;
  let counter = 1;

  while (
    await Project.exists({
      organization: organizationId,
      slug,
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
*/

const createProject = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      description,
      visibility,
      repository,
      environment,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const slug = await createUniqueSlug(
      req.organization._id,
      name
    );

    const project =
      await Project.create({
        organization:
          req.organization._id,

        name: name.trim(),

        slug,

        description:
          description?.trim() || "",

        owner: req.user._id,

        visibility:
          visibility || "private",

        repository:
          repository?.trim() || "",

        environment:
          environment || "development",
      });

    const populatedProject =
      await Project.findById(
        project._id
      )
        .populate(
          "owner",
          "name email avatar"
        )
        .populate(
          "organization",
          "name slug"
        );

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Projects
|--------------------------------------------------------------------------
*/

const getProjects = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
      visibility,
      search,
    } = req.query;

    const filter = {
      organization:
        req.organization._id,
    };

    if (
      status &&
      ["active", "archived"].includes(
        status
      )
    ) {
      filter.status = status;
    }

    if (
      visibility &&
      [
        "private",
        "internal",
        "public",
      ].includes(visibility)
    ) {
      filter.visibility =
        visibility;
    }

    if (search?.trim()) {
      filter.$or = [
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
      ];
    }

    const projects =
      await Project.find(filter)
        .populate(
          "owner",
          "name email avatar"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Project
|--------------------------------------------------------------------------
*/

const getProject = async (
  req,
  res,
  next
) => {
  try {
    const project =
      await Project.findOne({
        _id: req.params.projectId,
        organization:
          req.organization._id,
      })
        .populate(
          "owner",
          "name email avatar"
        )
        .populate(
          "organization",
          "name slug"
        );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update Project
|--------------------------------------------------------------------------
*/

const updateProject = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      description,
      status,
      visibility,
      repository,
      environment,
    } = req.body;

    const project =
      await Project.findOne({
        _id: req.params.projectId,
        organization:
          req.organization._id,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Project name cannot be empty",
        });
      }

      project.name = name.trim();
    }

    if (description !== undefined) {
      project.description =
        description.trim();
    }

    if (
      status &&
      ["active", "archived"].includes(
        status
      )
    ) {
      project.status = status;
    }

    if (
      visibility &&
      [
        "private",
        "internal",
        "public",
      ].includes(visibility)
    ) {
      project.visibility =
        visibility;
    }

    if (repository !== undefined) {
      project.repository =
        repository.trim();
    }

    if (
      environment &&
      [
        "development",
        "staging",
        "production",
      ].includes(environment)
    ) {
      project.environment =
        environment;
    }

    await project.save();

    const updatedProject =
      await Project.findById(
        project._id
      ).populate(
        "owner",
        "name email avatar"
      );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Archive Project
|--------------------------------------------------------------------------
*/

const archiveProject = async (
  req,
  res,
  next
) => {
  try {
    const project =
      await Project.findOne({
        _id: req.params.projectId,
        organization:
          req.organization._id,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.status = "archived";

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project archived successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Delete Project
|--------------------------------------------------------------------------
*/

const deleteProject = async (
  req,
  res,
  next
) => {
  try {
    const project =
      await Project.findOne({
        _id: req.params.projectId,
        organization:
          req.organization._id,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  archiveProject,
  deleteProject,
};