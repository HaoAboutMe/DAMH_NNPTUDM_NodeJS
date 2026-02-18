/**
 * User Controller
 * Xử lý các request liên quan đến user
 */

const userService = require("../services/userService");
const {
  successResponse,
  successMessageResponse,
  errorResponse,
} = require("../utils/response");
const { ErrorCodes } = require("../utils/errorCodes");

/**
 * Controller lấy thông tin user hiện tại
 * GET /users/me
 * Headers: Authorization: Bearer <token>
 */
const getMeController = async (req, res) => {
  try {
    // req.user đã được gắn bởi authenticateToken middleware
    const userId = req.user.id;

    const userProfile = await userService.getUserProfile(userId);

    return successResponse(res, userProfile, 200);
  } catch (error) {
    if (error.code) {
      return errorResponse(res, error.message, error.code, 404);
    }
    return errorResponse(
      res,
      error.message || "Lỗi hệ thống",
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500,
    );
  }
};

/**
 * Controller đổi mật khẩu
 * POST /users/change-password
 * Headers: Authorization: Bearer <token>
 * Body: { currentPassword, newPassword }
 */
const changePasswordController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return errorResponse(
        res,
        "Mật khẩu hiện tại và mật khẩu mới là bắt buộc",
        ErrorCodes.MISSING_REQUIRED_FIELDS,
        400,
      );
    }

    // Validate password length
    if (newPassword.length < 6) {
      return errorResponse(
        res,
        "Mật khẩu mới phải có ít nhất 6 ký tự",
        ErrorCodes.PASSWORD_TOO_SHORT,
        400,
      );
    }

    const message = await userService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );

    return successMessageResponse(res, message, 200);
  } catch (error) {
    if (error.code) {
      return errorResponse(res, error.message, error.code, 400);
    }
    return errorResponse(
      res,
      error.message || "Lỗi hệ thống",
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500,
    );
  }
};

/**
 * Controller lấy danh sách tất cả user
 * GET /users
 * Chỉ ADMIN mới được truy cập (bảo vệ bởi requireRole middleware ở route)
 */
const getAllUsersController = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, users, 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Lỗi hệ thống",
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500,
    );
  }
};

/**
 * Controller cập nhật thông tin cá nhân
 * PUT /users/me
 * Headers: Authorization: Bearer <token>
 * Body: { username?, firstname?, lastname?, dateOfBirth? }
 */
const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, firstname, lastname, dateOfBirth } = req.body;

    // Validate: username nếu được gửi thì không được rỗng
    if (username !== undefined && username.trim() === "") {
      return errorResponse(
        res,
        "Username không được để trống",
        ErrorCodes.MISSING_REQUIRED_FIELDS,
        400,
      );
    }

    const updatedUser = await userService.updateProfile(userId, {
      username: username?.trim(),
      firstname,
      lastname,
      dateOfBirth,
    });

    return successResponse(res, updatedUser, 200);
  } catch (error) {
    if (error.code) {
      return errorResponse(res, error.message, error.code, 400);
    }
    return errorResponse(
      res,
      error.message || "Lỗi hệ thống",
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500,
    );
  }
};

module.exports = {
  getMeController,
  changePasswordController,
  getAllUsersController,
  updateProfileController,
};
