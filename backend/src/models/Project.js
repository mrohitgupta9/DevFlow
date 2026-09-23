const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [2, "Project name must be at least 2 characters"],
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      required: [true, "Project slug is required"],
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    visibility: {
      type: String,
      enum: ["private", "internal", "public"],
      default: "private",
    },

    repository: {
      type: String,
      trim: true,
      default: "",
    },

    environment: {
      type: String,
      enum: ["development", "staging", "production"],
      default: "development",
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index(
  { organization: 1, slug: 1 },
  { unique: true }
);

projectSchema.index({
  organization: 1,
  status: 1,
});

projectSchema.index({
  organization: 1,
  owner: 1,
});

module.exports = mongoose.model(
  "Project",
  projectSchema
);