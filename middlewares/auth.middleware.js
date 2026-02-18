/**
 * Authentication Middleware
 * Xác thực JWT token và gắn user info vào req.user
 */

const { verifyToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/response");
const { ErrorCodes } = require("../utils/errorCodes");
const { User, Role } = require("../schemas");

/**
 * Middleware xác thực token
 * Kiểm tra Authorization header và verify JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return errorResponse(
        res,
        "Token không được cung cấp",
        ErrorCodes.UNAUTHORIZED,
        401,
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return errorResponse(
        res,
        "Token không hợp lệ hoặc đã hết hạn",
        ErrorCodes.INVALID_TOKEN,
        401,
      );
    }

    // Tìm user từ database
    const user = await User.findByPk(decoded.userId, {
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["name", "description"],
        },
      ],
    });

    if (!user) {
      return errorResponse(
        res,
        "Người dùng không tồn tại",
        ErrorCodes.USER_NOT_FOUND,
        401,
      );
    }

    // Gắn user vào request
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      dateOfBirth: user.dateOfBirth,
      roleName: user.roleName,
      role: user.role,
    };

    next();
  } catch (error) {
    return errorResponse(
      res,
      "Lỗi xác thực",
      ErrorCodes.INTERNAL_SERVER_ERROR,
      500,
    );
  }
};

/**
 * Middleware kiểm tra role
 * Phải dùng SAU authenticateToken (vì cần req.user)
 * @param {...String} roles - Danh sách role được phép, ví dụ: requireRole("ADMIN") hoặc requireRole("ADMIN", "MODERATOR")
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Chưa xác thực", ErrorCodes.UNAUTHORIZED, 401);
    }

    if (!roles.includes(req.user.roleName)) {
      return errorResponse(
        res,
        "Bạn không có quyền truy cập tài nguyên này",
        ErrorCodes.FORBIDDEN,
        403,
      );
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
};
