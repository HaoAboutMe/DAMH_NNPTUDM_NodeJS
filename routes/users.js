/**
 * User Routes
 * Định nghĩa các route cho user operations
 */

const express = require("express");
const router = express.Router();
const {
  getMeController,
  changePasswordController,
  getAllUsersController,
  updateProfileController,
} = require("../controllers/userController");
const {
  authenticateToken,
  requireRole,
} = require("../middlewares/auth.middleware");

/**
 * GET /users
 * Lấy danh sách tất cả user — chỉ ADMIN
 */
router.get("/", authenticateToken, requireRole("ADMIN"), getAllUsersController);

/**
 * GET /users/me
 * Lấy thông tin user hiện tại (cần authentication)
 */
router.get("/me", authenticateToken, getMeController);

/**
 * PUT /users/me
 * Cập nhật thông tin cá nhân (username, firstname, lastname, dateOfBirth)
 */
router.put("/me", authenticateToken, updateProfileController);

/**
 * POST /users/change-password
 * Đổi mật khẩu (cần authentication)
 */
router.post("/change-password", authenticateToken, changePasswordController);

module.exports = router;
