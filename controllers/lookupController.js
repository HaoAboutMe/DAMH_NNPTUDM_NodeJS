/**
 * Lookup Controller (Generic)
 * Tạo controller functions cho một Lookup Table cụ thể
 * Dùng: const ctrl = createLookupController(models.CoolerType)
 */

const lookupService = require("../services/lookupService");
const { successResponse, errorResponse } = require("../utils/response");
const { ErrorCodes } = require("../utils/errorCodes");

/**
 * Factory — nhận Model, trả về object chứa 5 controller functions
 * @param {Model} Model - Sequelize model của lookup table
 */
const createLookupController = (Model) => {
  /**
   * GET /  — Lấy tất cả
   */
  const getAll = async (req, res) => {
    try {
      const data = await lookupService.getAll(Model);
      return successResponse(res, data, 200);
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
   * GET /:id — Lấy theo ID
   */
  const getById = async (req, res) => {
    try {
      const data = await lookupService.getById(Model, req.params.id);
      return successResponse(res, data, 200);
    } catch (error) {
      if (error.code) return errorResponse(res, error.message, error.code, 404);
      return errorResponse(
        res,
        error.message || "Lỗi hệ thống",
        ErrorCodes.INTERNAL_SERVER_ERROR,
        500,
      );
    }
  };

  /**
   * POST /  — Tạo mới (ADMIN only)
   * Body: { id, name }
   */
  const create = async (req, res) => {
    try {
      const { id, name } = req.body;
      const data = await lookupService.create(Model, id, name);
      return successResponse(res, data, 201);
    } catch (error) {
      if (error.code) {
        const httpStatus =
          error.code === ErrorCodes.PC_PART_ALREADY_EXISTS ? 409 : 400;
        return errorResponse(res, error.message, error.code, httpStatus);
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
   * PUT /:id — Cập nhật name (ADMIN only)
   * Body: { name }
   */
  const update = async (req, res) => {
    try {
      const { name } = req.body;
      const data = await lookupService.update(Model, req.params.id, name);
      return successResponse(res, data, 200);
    } catch (error) {
      if (error.code) {
        const httpStatus =
          error.code === ErrorCodes.PC_PART_NOT_FOUND ? 404 : 400;
        return errorResponse(res, error.message, error.code, httpStatus);
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
   * DELETE /:id — Xóa (ADMIN only)
   */
  const remove = async (req, res) => {
    try {
      await lookupService.remove(Model, req.params.id);
      return successResponse(res, { message: "Xóa thành công" }, 200);
    } catch (error) {
      if (error.code) {
        const httpStatus =
          error.code === ErrorCodes.PC_PART_NOT_FOUND ? 404 : 409;
        return errorResponse(res, error.message, error.code, httpStatus);
      }
      return errorResponse(
        res,
        error.message || "Lỗi hệ thống",
        ErrorCodes.INTERNAL_SERVER_ERROR,
        500,
      );
    }
  };

  return { getAll, getById, create, update, remove };
};

module.exports = { createLookupController };
