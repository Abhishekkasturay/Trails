const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

// Generate token
const generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Verify token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
};

module.exports = {
  generateToken,
  verifyToken,
};

