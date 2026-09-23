const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// =====================================================
// USER SCHEMA
// =====================================================

const userSchema = new mongoose.Schema(
  {
    // -------------------------------------------------
    // BASIC INFORMATION
    // -------------------------------------------------

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },

    // -------------------------------------------------
    // AUTHENTICATION
    // -------------------------------------------------

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    // -------------------------------------------------
    // ROLE
    // -------------------------------------------------

    role: {
      type: String,
      enum: ["owner", "admin", "developer", "viewer"],
      default: "owner",
    },

    // -------------------------------------------------
    // PROFILE
    // -------------------------------------------------

    avatar: {
      type: String,
      default: "",
    },

    // -------------------------------------------------
    // ACCOUNT STATUS
    // -------------------------------------------------

    isActive: {
      type: Boolean,
      default: true,
    },

    // -------------------------------------------------
    // LOGIN INFORMATION
    // -------------------------------------------------

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// =====================================================
// PASSWORD HASHING
// =====================================================

userSchema.pre("save", async function () {
  // Password was not changed.
  // No need to hash it again.
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

// =====================================================
// PASSWORD COMPARISON
// =====================================================

userSchema.methods.matchPassword = async function (
  enteredPassword
) {
  return bcrypt.compare(
    enteredPassword,
    this.password
  );
};

// =====================================================
// MODEL
// =====================================================

module.exports = mongoose.model("User", userSchema);