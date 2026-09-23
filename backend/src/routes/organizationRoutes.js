
const express = require("express");

const {
  createOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getMembers,
  addMember,
  updateMember,
  removeMember,
} = require("../controllers/organizationController");

const { protect } = require("../middleware/authMiddleware");

const {
  organizationMember,
  requireRole,
} = require("../middleware/organizationMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Organization
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  createOrganization
);

router.get(
  "/",
  protect,
  getOrganizations
);

router.get(
  "/:id",
  protect,
  organizationMember,
  getOrganization
);

router.patch(
  "/:id",
  protect,
  organizationMember,
  requireRole("owner", "admin"),
  updateOrganization
);

router.delete(
  "/:id",
  protect,
  organizationMember,
  requireRole("owner"),
  deleteOrganization
);

/*
|--------------------------------------------------------------------------
| Organization Members
|--------------------------------------------------------------------------
*/

router.get(
  "/:id/members",
  protect,
  organizationMember,
  getMembers
);

router.post(
  "/:id/members",
  protect,
  organizationMember,
  requireRole("owner", "admin"),
  addMember
);

router.patch(
  "/:id/members/:memberId",
  protect,
  organizationMember,
  requireRole("owner", "admin"),
  updateMember
);

router.delete(
  "/:id/members/:memberId",
  protect,
  organizationMember,
  requireRole("owner", "admin"),
  removeMember
);

module.exports = router;