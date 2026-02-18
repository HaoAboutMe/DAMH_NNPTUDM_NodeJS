/**
 * Authentication Routes
 * Định nghĩa các route cho authentication
 */

const express = require("express");
const router = express.Router();
const {
  registerController,
  loginController,
} = require("../controllers/authController");

/**
 * POST /auth/register
 * Đăng ký user mới
 */
router.post("/register", registerController);

/**
 * POST /auth/login
 * Đăng nhập
 */
router.post("/login", loginController);

module.exports = router;
