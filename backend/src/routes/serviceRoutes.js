const express = require("express");

const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  organizationMember,
  requireRole,
} = require("../middleware/organizationMiddleware");

const router = express.Router();

// =====================================================
// SERVICES
// =====================================================

// Create service
router.post(
  "/organizations/:id/projects/:projectId/services",
  protect,
  organizationMember,
  requireRole(
    "owner",
    "admin",
    "developer"
  ),
  createService
);

// Get services
router.get(
  "/organizations/:id/projects/:projectId/services",
  protect,
  organizationMember,
  getServices
);

// Get single service
router.get(
  "/organizations/:id/projects/:projectId/services/:serviceId",
  protect,
  organizationMember,
  getService
);

// Update service
router.patch(
  "/organizations/:id/projects/:projectId/services/:serviceId",
  protect,
  organizationMember,
  requireRole(
    "owner",
    "admin",
    "developer"
  ),
  updateService
);

// Delete service
router.delete(
  "/organizations/:id/projects/:projectId/services/:serviceId",
  protect,
  organizationMember,
  requireRole(
    "owner",
    "admin"
  ),
  deleteService
);

module.exports = router;