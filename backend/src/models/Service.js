const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [2, "Service name must be at least 2 characters"],
      maxlength: [100, "Service name cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      required: [true, "Service slug is required"],
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    type: {
      type: String,
      enum: [
        "api",
        "frontend",
        "worker",
        "database",
        "cache",
        "queue",
        "other",
      ],
      default: "api",
    },

    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "deprecated",
      ],
      default: "active",
    },

    environment: {
      type: String,
      enum: [
        "development",
        "staging",
        "production",
      ],
      default: "development",
    },

    repository: {
      type: String,
      trim: true,
      default: "",
    },

    url: {
      type: String,
      trim: true,
      default: "",
    },

    healthCheckUrl: {
      type: String,
      trim: true,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same project cannot have two services with same slug
serviceSchema.index(
  {
    project: 1,
    slug: 1,
  },
  {
    unique: true,
  }
);

serviceSchema.index({
  organization: 1,
  project: 1,
  status: 1,
});

serviceSchema.index({
  project: 1,
  type: 1,
});

serviceSchema.index({
  project: 1,
  environment: 1,
});

module.exports = mongoose.model(
  "Service",
  serviceSchema
);