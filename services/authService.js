/**
 * Authentication Service
 * Xử lý business logic cho authentication
 */

const bcrypt = require("bcrypt");
const { User, Role } = require("../schemas");
const { generateToken } = require("../utils/jwt");
const { ErrorCodes } = require("../utils/errorCodes");

/**
 * Custom Error với error code
 */
class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

/**
 * Đăng ký user mới
 * @param {Object} userData - Dữ liệu user (email, username, password, firstname, lastname, dateOfBirth)
 * @returns {Object} User đã tạo
 */
const register = async (userData) => {
  const { email, username, password, firstname, lastname, dateOfBirth } =
    userData;

  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError(
      "Email đã được sử dụng",
      ErrorCodes.EMAIL_ALREADY_EXISTS,
    );
  }

  // Tìm role USER mặc định
  let userRole = await Role.findOne({ where: { name: "USER" } });

  // Nếu không có role USER, tạo mới
  if (!userRole) {
    userRole = await Role.create({
      name: "USER",
      description: "Người dùng thông thường",
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo user mới
  const newUser = await User.create({
    email,
    username,
    firstname: firstname || null,
    lastname: lastname || null,
    password: hashedPassword,
    dateOfBirth,
    roleName: userRole.name,
  });

  // Trả về user (không bao gồm password), không kèm token
  return {
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
    firstname: newUser.firstname,
    lastname: newUser.lastname,
    dateOfBirth: newUser.dateOfBirth,
    roleName: newUser.roleName,
  };
};

/**
 * Đăng nhập
 * @param {String} email - Email user
 * @param {String} password - Password
 * @returns {Object} User và token
 */
const login = async (email, password) => {
  // Tìm user theo email
  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["name", "description"],
      },
    ],
  });

  if (!user) {
    throw new AppError(
      "Email hoặc mật khẩu không đúng",
      ErrorCodes.INVALID_CREDENTIALS,
    );
  }

  // Kiểm tra password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(
      "Email hoặc mật khẩu không đúng",
      ErrorCodes.INVALID_CREDENTIALS,
    );
  }

  // Tạo JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    roleName: user.roleName,
  });

  // Trả về user (không bao gồm password) và token
  const userResponse = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    dateOfBirth: user.dateOfBirth,
    roleName: user.roleName,
    role: user.role,
  };

  return {
    user: userResponse,
    token,
  };
};

module.exports = {
  register,
  login,
  AppError,
};
