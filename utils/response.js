/**
 * Response Builder Utility
 * Theo quy tắc API Response format trong rule.md
 */

/**
 * Trả về response thành công với result
 * @param {Object} res - Express response object
 * @param {Object} result - Dữ liệu trả về
 * @param {Number} statusCode - HTTP status code (mặc định 200)
 */
const successResponse = (res, result = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    code: 1000,
    result,
  });
};

/**
 * Trả về response thành công với message
 * Dùng cho các action đơn giản chỉ cần thông báo thành công
 * @param {Object} res - Express response object
 * @param {String} message - Thông báo thành công
 * @param {Number} statusCode - HTTP status code (mặc định 200)
 */
const successMessageResponse = (res, message, statusCode = 200) => {
  return res.status(statusCode).json({
    code: 1000,
    message,
  });
};

/**
 * Trả về response lỗi
 * @param {Object} res - Express response object
 * @param {String} message - Thông báo lỗi
 * @param {Number} code - Mã lỗi cụ thể
 * @param {Number} statusCode - HTTP status code (mặc định 400)
 */
const errorResponse = (res, message, code, statusCode = 400) => {
  return res.status(statusCode).json({
    code,
    message,
  });
};

module.exports = {
  successResponse,
  successMessageResponse,
  errorResponse,
};
