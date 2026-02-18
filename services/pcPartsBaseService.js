/**
 * PC Parts Base Service
 * Helper functions dùng chung cho 9 Data Table services
 */

const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

/**
 * Lấy tất cả với include relations
 */
const findAll = async (Model, includeOptions = []) => {
  return await Model.findAll({
    include: includeOptions,
    order: [["name", "ASC"]],
  });
};

/**
 * Lấy theo ID với include relations
 */
const findById = async (Model, id, includeOptions = []) => {
  const record = await Model.findByPk(id, { include: includeOptions });
  if (!record) {
    throw new AppError(
      "Không tìm thấy linh kiện",
      ErrorCodes.PC_PART_NOT_FOUND,
    );
  }
  return record;
};

/**
 * Xóa theo ID
 */
const destroy = async (Model, id) => {
  const record = await Model.findByPk(id);
  if (!record) {
    throw new AppError(
      "Không tìm thấy linh kiện",
      ErrorCodes.PC_PART_NOT_FOUND,
    );
  }
  await record.destroy();
};

module.exports = { findAll, findById, destroy };
