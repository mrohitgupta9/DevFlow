const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  archiveProject,
  deleteProject,
} = require("../controllers/projectController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  organizationMember,
  requireRole,
} = require("../middleware/organizationMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Organization Projects
|--------------------------------------------------------------------------
*/

router.post(
  "/organizations/:id/projects",
  protect,
  organizationMember,
  requireRole(
    "owner",
    "admin",
    "developer"
  ),
  createProject
);

router.get(
  "/organizations/:id/projects",
  protect,
  organizationMember,
  getProjects
);

/*
|--------------------------------------------------------------------------
| Single Project
|--------------------------------------------------------------------------
*/

router.get(
  "/organizations/:id/projects/:projectId",
  protect,
  organizationMember,
  getProject
);

router.patch(
  "/organizations/:id/projects/:projectId",
  protect,
  organizationMember,
  requireRole(
    "owner",
    "admin",
    "developer"
  ),
  updateProject
);

router.post(
  "/organizations/:id/projects/:projectId/archive",
  protect,
  organizationMember,
  requireRole(
    "owner",
    "admin"
  ),
  archiveProject
);

router.delete(
  "/organizations/:id/projects/:projectId",
  protect,
  organizationMember,
  requireRole(
    "owner",
    "admin"
  ),
  deleteProject
);

module.exports = router;