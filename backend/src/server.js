require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const {
  connectDatabase,
  disconnectDatabase,
} = require("./config/database");

const {
  connectRedis,
  disconnectRedis,
} = require("./config/redis");

const authRoutes = require("./routes/authRoutes");

// =====================================================
// APP CONFIG
// =====================================================

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

// =====================================================
// SECURITY
// =====================================================

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// =====================================================
// BODY PARSING
// =====================================================

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

app.use(cookieParser());

// =====================================================
// RATE LIMITING
// =====================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// =====================================================
// REQUEST LOGGING - DEVELOPMENT
// =====================================================

if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;

      console.log(
        `${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
      );
    });

    next();
  });
}

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DevFlow API",
    version: "1.0.0",
    environment: NODE_ENV,
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevFlow API is healthy and running",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// API ROUTES
// =====================================================

// Authentication
app.use("/api/auth", authRoutes);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("");
  console.error("✗ Unhandled error");

  if (error.stack) {
    console.error(error.stack);
  } else {
    console.error(error);
  }

  // -----------------------------------------------
  // Mongoose validation error
  // -----------------------------------------------

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map(
      (item) => item.message
    );

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // -----------------------------------------------
  // Mongoose duplicate key error
  // -----------------------------------------------

  if (error.code === 11000) {
    const fields = Object.keys(error.keyPattern || {});

    return res.status(409).json({
      success: false,
      message: fields.length
        ? `${fields.join(", ")} already exists`
        : "Duplicate resource",
    });
  }

  // -----------------------------------------------
  // JSON parse error
  // -----------------------------------------------

  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    error.type === "entity.parse.failed"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  // -----------------------------------------------
  // Rate limit error
  // -----------------------------------------------

  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  }

  // -----------------------------------------------
  // Default error
  // -----------------------------------------------

  return res.status(error.statusCode || error.status || 500).json({
    success: false,
    message:
      NODE_ENV === "production"
        ? "Internal server error"
        : error.message || "Internal server error",
  });
});

// =====================================================
// SERVER START
// =====================================================

const startServer = async () => {
  try {
    console.log("");
    console.log("========================================");
    console.log("🚀 DevFlow Backend Starting...");
    console.log("========================================");

    console.log(`Environment : ${NODE_ENV}`);
    console.log(`Port        : ${PORT}`);
    console.log(`Client URL  : ${CLIENT_URL}`);

    // -----------------------------------------------
    // MongoDB
    // -----------------------------------------------

    await connectDatabase();

    // -----------------------------------------------
    // Redis
    // -----------------------------------------------

    await connectRedis();

    // -----------------------------------------------
    // HTTP Server
    // -----------------------------------------------

    const server = app.listen(PORT, () => {
      console.log("");
      console.log("✓ MongoDB connected");
      console.log("✓ Redis connected");
      console.log(`✓ DevFlow API running on port ${PORT}`);
      console.log(`✓ http://localhost:${PORT}`);
      console.log("");
      console.log("Available endpoints:");
      console.log(`  GET  /`);
      console.log(`  GET  /health`);
      console.log(`  POST /api/auth/register`);
      console.log(`  POST /api/auth/login`);
      console.log(`  GET  /api/auth/me`);
      console.log(`  POST /api/auth/logout`);
      console.log("");
      console.log("========================================");
      console.log("DevFlow Backend Ready");
      console.log("========================================");
      console.log("");
    });

    // =================================================
    // GRACEFUL SHUTDOWN
    // =================================================

    let isShuttingDown = false;

    const gracefulShutdown = async (signal) => {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      console.log("");
      console.log(`→ ${signal} received.`);
      console.log("→ Starting graceful shutdown...");

      server.close(async () => {
        try {
          await disconnectRedis();
          await disconnectDatabase();

          console.log("✓ Redis disconnected");
          console.log("✓ MongoDB disconnected");
          console.log("✓ DevFlow shutdown complete");
          console.log("");

          process.exit(0);
        } catch (error) {
          console.error(
            "✗ Error during shutdown:",
            error.message
          );

          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error(
          "✗ Graceful shutdown timed out. Forcing exit."
        );

        process.exit(1);
      }, 10000).unref();
    };

    process.on("SIGINT", () => {
      gracefulShutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      gracefulShutdown("SIGTERM");
    });

    // =================================================
    // UNHANDLED ERRORS
    // =================================================

    process.on("unhandledRejection", (reason) => {
      console.error("");
      console.error("✗ Unhandled Promise Rejection:");

      if (reason instanceof Error) {
        console.error(reason.stack || reason.message);
      } else {
        console.error(reason);
      }
    });

    process.on("uncaughtException", (error) => {
      console.error("");
      console.error("✗ Uncaught Exception:");
      console.error(error.stack || error.message);

      gracefulShutdown("uncaughtException");
    });
  } catch (error) {
    console.error("");
    console.error("========================================");
    console.error("✗ DevFlow failed to start");
    console.error("========================================");
    console.error(error.stack || error.message);
    console.error("");

    process.exit(1);
  }
};

// =====================================================
// START APPLICATION
// =====================================================

startServer();