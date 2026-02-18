/**
 * Error Codes
 * Định nghĩa các mã lỗi cụ thể cho từng trường hợp
 */

const ErrorCodes = {
  // Success
  SUCCESS: 1000,

  // Authentication Errors (1001-1099)
  EMAIL_ALREADY_EXISTS: 1001,
  INVALID_EMAIL_FORMAT: 1002,
  PASSWORD_TOO_SHORT: 1003,
  MISSING_REQUIRED_FIELDS: 1004,
  INVALID_CREDENTIALS: 1005,
  CURRENT_PASSWORD_INCORRECT: 1006,
  NEW_PASSWORD_SAME_AS_OLD: 1007,

  // User Errors (1100-1199)
  USER_NOT_FOUND: 1100,
  USER_ALREADY_EXISTS: 1101,

  // Authorization Errors (1200-1299)
  UNAUTHORIZED: 1200,
  FORBIDDEN: 1201,
  INVALID_TOKEN: 1202,

  // Validation Errors (1300-1399)
  VALIDATION_ERROR: 1300,

  // PC Parts Errors (1400-1499)
  PC_PART_NOT_FOUND: 1400,
  PC_PART_ALREADY_EXISTS: 1401,
  PC_PART_IN_USE: 1402,

  // Server Errors (9000-9999)
  INTERNAL_SERVER_ERROR: 9999,
};

const ErrorMessages = {
  [ErrorCodes.EMAIL_ALREADY_EXISTS]: "Email đã được sử dụng",
  [ErrorCodes.INVALID_EMAIL_FORMAT]: "Email không hợp lệ",
  [ErrorCodes.PASSWORD_TOO_SHORT]: "Mật khẩu phải có ít nhất 6 ký tự",
  [ErrorCodes.MISSING_REQUIRED_FIELDS]:
    "Email, username, password và ngày sinh là bắt buộc",
  [ErrorCodes.INVALID_CREDENTIALS]: "Email hoặc mật khẩu không đúng",
  [ErrorCodes.CURRENT_PASSWORD_INCORRECT]: "Mật khẩu hiện tại không đúng",
  [ErrorCodes.NEW_PASSWORD_SAME_AS_OLD]:
    "Mật khẩu mới không được trùng với mật khẩu cũ",
  [ErrorCodes.USER_NOT_FOUND]: "Không tìm thấy người dùng",
  [ErrorCodes.UNAUTHORIZED]: "Chưa xác thực",
  [ErrorCodes.FORBIDDEN]: "Không có quyền truy cập",
  [ErrorCodes.INVALID_TOKEN]: "Token không hợp lệ",
  [ErrorCodes.INTERNAL_SERVER_ERROR]: "Lỗi hệ thống",
};

module.exports = {
  ErrorCodes,
  ErrorMessages,
};
