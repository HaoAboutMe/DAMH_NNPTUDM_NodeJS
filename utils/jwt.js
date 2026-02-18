/**
 * JWT Utility
 * Xử lý tạo và verify JWT token
 */

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Tạo JWT token
 * @param {Object} payload - Dữ liệu cần mã hóa (userId, roleId, email, etc.)
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token cần verify
 * @returns {Object} Decoded payload hoặc null nếu token không hợp lệ
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
