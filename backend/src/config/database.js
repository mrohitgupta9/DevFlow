const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log("✓ MongoDB connected");
    console.log(`  Database: ${connection.connection.name}`);
  } catch (error) {
    console.error("✗ MongoDB connection failed");
    console.error(`  ${error.message}`);

    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("✓ MongoDB disconnected");
  } catch (error) {
    console.error("✗ MongoDB disconnect failed");
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};