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

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// =====================================================
// SECURITY
// =====================================================

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// =====================================================
// BODY PARSING
// =====================================================

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

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
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to DevFlow API",
    version: "1.0.0",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "DevFlow API is healthy and running",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  res.status(error.statusCode || 500).json({
    success: false,
    message:
      NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
});

// =====================================================
// SERVER START
// =====================================================

const startServer = async () => {
  try {
    console.log("");
    console.log("🚀 DevFlow Backend Starting...");
    console.log(`   Environment: ${NODE_ENV}`);
    console.log(`   Port: ${PORT}`);

    await connectDatabase();
    await connectRedis();

    const server = app.listen(PORT, () => {
      console.log("");
      console.log(`✓ DevFlow API running on port ${PORT}`);
      console.log(`✓ http://localhost:${PORT}`);
      console.log("");
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n→ ${signal} received. Shutting down...`);

      server.close(async () => {
        await disconnectRedis();
        await disconnectDatabase();

        console.log("✓ DevFlow shutdown complete");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    console.error("");
    console.error("✗ DevFlow failed to start");
    console.error(`  ${error.message}`);

    process.exit(1);
  }
};

startServer();