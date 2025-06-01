const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15" });
};

const generatRefreshToken = (userId) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(404).json({ msg: "User already exists" });

    const user = new User({ email, password });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ token, userId: user._id, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generatRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save();
    res.status(201).json({
      accessToken,
      refreshToken,
      userId: user._id,
      email: user.email,
      msg: "Successfully logged in",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signOut = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) res.status(400).json({ msg: "No token provided" });
  try {
    res.status(200).json({ msg: "Signed Out Successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error during sign-out" });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) res.status(401).json({ msg: "No Refresh Token Provided" });
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findOne(decoded.userId);

    if (!user || user.refreshToken !== refreshToken)
      res.status(403).json({ msg: "Invalid Refesh Token" });

    const newAccessToken = generateAccessToken(user._id);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ msg: "Refresh token expired or invalid" });
  }
};

module.exports = { signup, login, signOut, refreshToken };
