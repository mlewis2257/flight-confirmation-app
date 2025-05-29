// Main entry into the application
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const logger = require("winston");

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGDB_URI;

dotenv.config();

const app = express();

// Middleware
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  })
);
// Custom logging using Winston
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/flights", require("./routes/flights"));

// Database Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((error) => {
    console.error(error);
  });

app.listen(PORT, () => {
  try {
    logger.info(`Server started successfully at: ${PORT}`);
  } catch (error) {
    logger.error("Something went wrong", { details: error.stack });
  }
});
