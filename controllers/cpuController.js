const service = require("../services/cpuService");
const { successResponse, errorResponse } = require("../utils/response");
const { ErrorCodes } = require("../utils/errorCodes");

const handleError = (res, error) => {
  if (error.code)
    return errorResponse(
      res,
      error.message,
      error.code,
      error.code === ErrorCodes.PC_PART_NOT_FOUND ? 404 : 400,
    );
  return errorResponse(
    res,
    error.message || "Lỗi hệ thống",
    ErrorCodes.INTERNAL_SERVER_ERROR,
    500,
  );
};

const getAll = async (req, res) => {
  try {
    return successResponse(res, await service.getAll());
  } catch (e) {
    return handleError(res, e);
  }
};

const getById = async (req, res) => {
  try {
    return successResponse(res, await service.getById(req.params.id));
  } catch (e) {
    return handleError(res, e);
  }
};

const create = async (req, res) => {
  try {
    return successResponse(res, await service.create(req.body), 201);
  } catch (e) {
    return handleError(res, e);
  }
};

const update = async (req, res) => {
  try {
    return successResponse(res, await service.update(req.params.id, req.body));
  } catch (e) {
    return handleError(res, e);
  }
};

const remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    return successResponse(res, { message: "Xóa thành công" });
  } catch (e) {
    return handleError(res, e);
  }
};

module.exports = { getAll, getById, create, update, remove };
