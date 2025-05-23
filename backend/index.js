// Main entry into the application
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("morgan");

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGDB_URI;

dotenv.config();

const app = express();

// Middleware
app.use(logger("dev"));
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
  console.log(`Server Listening on Port: ${PORT}`);
});
