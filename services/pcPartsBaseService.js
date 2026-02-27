/**
 * PC Parts Base Service
 * Helper functions dùng chung cho 9 Data Table services
 */

const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

/**
 * Loại bỏ FK fields khỏi plain object (sau khi đã có nested object)
 * @param {Model|Model[]} data - Sequelize instance hoặc mảng instance
 * @param {string[]} exclude - Danh sách field cần ẩn
 */
const stripFkFields = (data, exclude = []) => {
  if (!exclude.length) return data;

  const strip = (instance) => {
    const plain = instance.toJSON();
    exclude.forEach((field) => delete plain[field]);
    return plain;
  };

  return Array.isArray(data) ? data.map(strip) : strip(data);
};

/**
 * Lấy tất cả với include relations, ẩn FK fields thừa
 * @param {Model} Model
 * @param {Array}  includeOptions - Sequelize include array
 * @param {string[]} excludeFields - FK fields cần loại khỏi response
 */
const findAll = async (Model, includeOptions = [], excludeFields = []) => {
  const rows = await Model.findAll({
    include: includeOptions,
    order: [["name", "ASC"]],
  });
  return stripFkFields(rows, excludeFields);
};

/**
 * Lấy theo ID với include relations, ẩn FK fields thừa
 * @param {Model} Model
 * @param {string} id
 * @param {Array}  includeOptions
 * @param {string[]} excludeFields
 */
const findById = async (Model, id, includeOptions = [], excludeFields = []) => {
  const record = await Model.findByPk(id, { include: includeOptions });
  if (!record) {
    throw new AppError(
      "Không tìm thấy linh kiện",
      ErrorCodes.PC_PART_NOT_FOUND,
    );
  }
  return stripFkFields(record, excludeFields);
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
