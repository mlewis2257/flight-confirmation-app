const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenBlacklistSchema = new Schema({
  token: { type: String, required: true },
  blacklistedAt: { type: Date, default: Date.now, expires: "7d" },
});

module.exports = mongoose.model("TokenBlackList", tokenBlacklistSchema);
