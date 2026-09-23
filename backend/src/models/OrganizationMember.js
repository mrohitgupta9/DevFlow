const mongoose = require("mongoose");

const organizationMemberSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: [
        "owner",
        "admin",
        "developer",
        "viewer",
      ],
      default: "developer",
    },

    status: {
      type: String,
      enum: [
        "active",
        "invited",
        "suspended",
      ],
      default: "active",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

organizationMemberSchema.index(
  { organization: 1, user: 1 },
  { unique: true }
);

organizationMemberSchema.index({
  organization: 1,
  role: 1,
});

module.exports = mongoose.model(
  "OrganizationMember",
  organizationMemberSchema
);