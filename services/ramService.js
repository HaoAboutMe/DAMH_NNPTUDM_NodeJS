const { Ram, RamType } = require("../schemas");
const { findAll, findById, destroy } = require("./pcPartsBaseService");
const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

const INCLUDE = [{ model: RamType, as: "ramType" }];

const getAll = () => findAll(Ram, INCLUDE);

const getById = (id) => findById(Ram, id, INCLUDE);

const create = async ({
  name,
  ramTypeId,
  ramBus,
  ramCas,
  capacityPerStick,
  quantity,
  tdp,
  description,
}) => {
  if (
    !name ||
    !ramTypeId ||
    ramBus == null ||
    ramCas == null ||
    capacityPerStick == null ||
    tdp == null
  ) {
    throw new AppError(
      "name, ramTypeId, ramBus, ramCas, capacityPerStick, tdp là bắt buộc",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }
  return await Ram.create({
    name,
    ramTypeId,
    ramBus,
    ramCas,
    capacityPerStick,
    quantity: quantity ?? 1,
    tdp,
    description,
  });
};

const update = async (id, data) => {
  const record = await findById(Ram, id);
  await record.update(data);
  return findById(Ram, id, INCLUDE);
};

const remove = (id) => destroy(Ram, id);

module.exports = { getAll, getById, create, update, remove };
