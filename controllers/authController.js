/**
 * Authentication Controller
 * Xử lý các request liên quan đến authentication
 */

const authService = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/response");
const { ErrorCodes } = require("../utils/errorCodes");

/**
 * Controller đăng ký user mới
 * POST /auth/register
 * Body: { email, username, password, firstname, lastname, dateOfBirth }
 */
const registerController = async (req, res) => {
  try {
    const { email, username, password, firstname, lastname, dateOfBirth } =
      req.body;

    // Validate required fields
    if (!email || !username || !password || !dateOfBirth) {
      return errorResponse(
        res,
        "Email, username, password và ngày sinh là bắt buộc",
        ErrorCodes.MISSING_REQUIRED_FIELDS,
        400,
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(
        res,
        "Email không hợp lệ",
        ErrorCodes.INVALID_EMAIL_FORMAT,
        400,
      );
    }

    // Validate password length
    if (password.length < 6) {
      return errorResponse(
        res,
        "Mật khẩu phải có ít nhất 6 ký tự",
        ErrorCodes.PASSWORD_TOO_SHORT,
        400,
      );
    }

    // Gọi service để đăng ký
    const result = await authService.register({
      email,
      username,
      password,
      firstname,
      lastname,
      dateOfBirth,
    });

    return successResponse(res, result, 201);
  } catch (error) {
    // Nếu là AppError, sử dụng error code từ error
    if (error.code) {
      return errorResponse(res, error.message, error.code, 400);
    }
    // Lỗi không xác định
    return errorResponse(
      res,
      error.message || "Lỗi hệ thống",
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500,
    );
  }
};

/**
 * Controller đăng nhập
 * POST /auth/login
 * Body: { email, password }
 */
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return errorResponse(
        res,
        "Email và password là bắt buộc",
        ErrorCodes.MISSING_REQUIRED_FIELDS,
        400,
      );
    }

    // Gọi service để đăng nhập
    const result = await authService.login(email, password);

    return successResponse(res, result, 200);
  } catch (error) {
    // Nếu là AppError, sử dụng error code từ error
    if (error.code) {
      return errorResponse(res, error.message, error.code, 401);
    }
    // Lỗi không xác định
    return errorResponse(
      res,
      error.message || "Lỗi hệ thống",
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500,
    );
  }
};

module.exports = {
  registerController,
  loginController,
};
