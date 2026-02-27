const { Cooler, CoolerType } = require("../schemas");
const { findAll, findById, destroy } = require("./pcPartsBaseService");
const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

const INCLUDE = [{ model: CoolerType, as: "coolerType" }];
const EXCLUDE = ["coolerTypeId"];

const getAll = () => findAll(Cooler, INCLUDE, EXCLUDE);

const getById = (id) => findById(Cooler, id, INCLUDE, EXCLUDE);

const create = async ({
  name,
  coolerTypeId,
  radiatorSize,
  heightMm,
  tdpSupport,
  description,
}) => {
  if (!name || !coolerTypeId || tdpSupport == null) {
    throw new AppError(
      "name, coolerTypeId, tdpSupport là bắt buộc",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }
  const record = await Cooler.create({
    name,
    coolerTypeId,
    radiatorSize,
    heightMm,
    tdpSupport,
    description,
  });
  return findById(Cooler, record.id, INCLUDE, EXCLUDE);
};

const update = async (id, data) => {
  const record = await findById(Cooler, id);
  await record.update(data);
  return findById(Cooler, id, INCLUDE, EXCLUDE);
};

const remove = (id) => destroy(Cooler, id);

module.exports = { getAll, getById, create, update, remove };
