const express = require("express");
const router = express.Router();
const auth = require("../utils/authMiddleWare");

router.post("/api/flights", auth);

module.exports = router;
