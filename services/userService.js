/**
 * User Service
 * Xử lý business logic cho user operations
 */

const bcrypt = require("bcrypt");
const { User, Role } = require("../schemas");
const { ErrorCodes } = require("../utils/errorCodes");
const { AppError } = require("../services/authService");

/**
 * Lấy thông tin user (chỉ thông tin cần thiết)
 * @param {String} userId - ID của user
 * @returns {Object} User info
 */
const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["name", "description"],
      },
    ],
  });

  if (!user) {
    throw new AppError("Không tìm thấy người dùng", ErrorCodes.USER_NOT_FOUND);
  }

  // Chỉ trả về thông tin cần thiết, không trả password
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    dateOfBirth: user.dateOfBirth,
    role: user.role,
  };
};

/**
 * Đổi mật khẩu
 * @param {String} userId - ID của user
 * @param {String} currentPassword - Mật khẩu hiện tại
 * @param {String} newPassword - Mật khẩu mới
 * @returns {Object} Success message
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  // Tìm user
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError("Không tìm thấy người dùng", ErrorCodes.USER_NOT_FOUND);
  }

  // Kiểm tra mật khẩu hiện tại
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new AppError(
      "Mật khẩu hiện tại không đúng",
      ErrorCodes.CURRENT_PASSWORD_INCORRECT,
    );
  }

  // Kiểm tra mật khẩu mới có trùng với mật khẩu cũ không
  const isSameAsOld = await bcrypt.compare(newPassword, user.password);

  if (isSameAsOld) {
    throw new AppError(
      "Mật khẩu mới không được trùng với mật khẩu cũ",
      ErrorCodes.NEW_PASSWORD_SAME_AS_OLD,
    );
  }

  // Hash mật khẩu mới
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Cập nhật mật khẩu
  await user.update({ password: hashedNewPassword });

  return "Đổi mật khẩu thành công";
};

/**
 * Lấy danh sách tất cả user (chỉ dành cho ADMIN)
 * @returns {Array} Danh sách user
 */
const getAllUsers = async () => {
  const users = await User.findAll({
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["name", "description"],
      },
    ],
    attributes: { exclude: ["password"] }, // Không trả password
    order: [["username", "ASC"]],
  });

  return users;
};

/**
 * Cập nhật thông tin cá nhân
 * @param {String} userId - ID của user
 * @param {Object} updateData - Dữ liệu cần cập nhật (username, firstname, lastname, dateOfBirth)
 * @returns {Object} User sau khi cập nhật
 */
const updateProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError("Không tìm thấy người dùng", ErrorCodes.USER_NOT_FOUND);
  }

  // Chỉ cho phép cập nhật các trường an toàn — loại bỏ password, email, roleName
  const allowedFields = ["username", "firstname", "lastname", "dateOfBirth"];
  const filteredData = {};

  for (const field of allowedFields) {
    // Chỉ cập nhật trường nào được gửi lên (không ghi đè bằng undefined)
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    throw new AppError(
      "Không có trường hợp lệ nào để cập nhật",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }

  await user.update(filteredData);

  // Trả về thông tin user sau khi cập nhật (kèm role)
  const updatedUser = await User.findByPk(userId, {
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["name", "description"],
      },
    ],
    attributes: { exclude: ["password"] },
  });

  return updatedUser;
};

module.exports = {
  getUserProfile,
  changePassword,
  getAllUsers,
  updateProfile,
};
