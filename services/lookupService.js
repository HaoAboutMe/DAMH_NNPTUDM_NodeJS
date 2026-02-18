/**
 * Lookup Service (Generic)
 * Xử lý CRUD cho tất cả 8 Lookup Tables (Manual String ID)
 * Dùng chung cho: CoolerType, FormFactor, InterfaceType,
 *                 PcieConnector, PcieVersion, RamType, Socket, SsdType
 */

const { ErrorCodes } = require("../utils/errorCodes");
const { AppError } = require("./authService");

/**
 * Lấy tất cả bản ghi của một lookup table
 * @param {Model} Model - Sequelize model
 */
const getAll = async (Model) => {
  return await Model.findAll({ order: [["id", "ASC"]] });
};

/**
 * Lấy một bản ghi theo ID
 * @param {Model} Model
 * @param {String} id
 */
const getById = async (Model, id) => {
  const record = await Model.findByPk(id);
  if (!record) {
    throw new AppError("Không tìm thấy dữ liệu", ErrorCodes.PC_PART_NOT_FOUND);
  }
  return record;
};

/**
 * Tạo mới một bản ghi (ID do người dùng nhập)
 * @param {Model} Model
 * @param {String} id
 * @param {String} name
 */
const create = async (Model, id, name) => {
  if (!id || !name) {
    throw new AppError(
      "id và name là bắt buộc",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }

  // Kiểm tra ID đã tồn tại chưa
  const existing = await Model.findByPk(id);
  if (existing) {
    throw new AppError(
      `ID '${id}' đã tồn tại`,
      ErrorCodes.PC_PART_ALREADY_EXISTS,
    );
  }

  return await Model.create({ id: id.toUpperCase(), name });
};

/**
 * Cập nhật name của một bản ghi (không cho đổi ID)
 * @param {Model} Model
 * @param {String} id
 * @param {String} name
 */
const update = async (Model, id, name) => {
  if (!name || name.trim() === "") {
    throw new AppError(
      "name không được để trống",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }

  const record = await Model.findByPk(id);
  if (!record) {
    throw new AppError("Không tìm thấy dữ liệu", ErrorCodes.PC_PART_NOT_FOUND);
  }

  await record.update({ name: name.trim() });
  return record;
};

/**
 * Xóa một bản ghi
 * @param {Model} Model
 * @param {String} id
 */
const remove = async (Model, id) => {
  const record = await Model.findByPk(id);
  if (!record) {
    throw new AppError("Không tìm thấy dữ liệu", ErrorCodes.PC_PART_NOT_FOUND);
  }

  try {
    await record.destroy();
  } catch (err) {
    // FK constraint — bản ghi đang được tham chiếu bởi bảng khác
    if (err.name === "SequelizeForeignKeyConstraintError") {
      throw new AppError(
        "Không thể xóa — dữ liệu đang được sử dụng bởi linh kiện khác",
        ErrorCodes.PC_PART_IN_USE,
      );
    }
    throw err;
  }
};

module.exports = { getAll, getById, create, update, remove };
