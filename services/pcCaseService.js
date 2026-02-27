const { PcCase, CaseSize } = require("../schemas");
const { findAll, findById, destroy } = require("./pcPartsBaseService");
const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

const INCLUDE = [{ model: CaseSize, as: "caseSize" }];
const EXCLUDE = ["caseSizeId"];

const getAll = () => findAll(PcCase, INCLUDE, EXCLUDE);

const getById = (id) => findById(PcCase, id, INCLUDE, EXCLUDE);

const create = async ({
  name,
  caseSizeId,
  maxVgaLengthMm,
  maxCoolerHeightMm,
  maxRadiatorSize,
  drive35Slot,
  drive25Slot,
  description,
}) => {
  if (
    !name ||
    !caseSizeId ||
    maxVgaLengthMm == null ||
    maxCoolerHeightMm == null
  ) {
    throw new AppError(
      "name, caseSizeId, maxVgaLengthMm, maxCoolerHeightMm là bắt buộc",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }
  const record = await PcCase.create({
    name,
    caseSizeId,
    maxVgaLengthMm,
    maxCoolerHeightMm,
    maxRadiatorSize,
    drive35Slot,
    drive25Slot,
    description,
  });
  return findById(PcCase, record.id, INCLUDE, EXCLUDE);
};

const update = async (id, data) => {
  const record = await findById(PcCase, id);
  await record.update(data);
  return findById(PcCase, id, INCLUDE, EXCLUDE);
};

const remove = (id) => destroy(PcCase, id);

module.exports = { getAll, getById, create, update, remove };
