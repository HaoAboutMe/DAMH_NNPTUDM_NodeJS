const { PcCase } = require("../schemas");
const { findAll, findById, destroy } = require("./pcPartsBaseService");
const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

const getAll = () => findAll(PcCase);

const getById = (id) => findById(PcCase, id);

const create = async ({
  name,
  size,
  maxVgaLengthMm,
  maxCoolerHeightMm,
  maxRadiatorSize,
  drive35Slot,
  drive25Slot,
  description,
}) => {
  if (!name || !size || maxVgaLengthMm == null || maxCoolerHeightMm == null) {
    throw new AppError(
      "name, size, maxVgaLengthMm, maxCoolerHeightMm là bắt buộc",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }
  return await PcCase.create({
    name,
    size,
    maxVgaLengthMm,
    maxCoolerHeightMm,
    maxRadiatorSize,
    drive35Slot,
    drive25Slot,
    description,
  });
};

const update = async (id, data) => {
  const record = await findById(PcCase, id);
  await record.update(data);
  return record;
};

const remove = (id) => destroy(PcCase, id);

module.exports = { getAll, getById, create, update, remove };
