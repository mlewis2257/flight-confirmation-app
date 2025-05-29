const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const JWT = process.env.JWT;

module.exports = (req, res, next) => {
  const token = req.header("Authorication")?.replace("Bearer", "");
  if (!token) return res.status(401).json({ msg: "Access Denied" });

  try {
    const decoded = jwt.verify(token, JWT);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid Token" });
  }
};
