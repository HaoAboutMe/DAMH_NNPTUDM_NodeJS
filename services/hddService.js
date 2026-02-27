const { Hdd, FormFactor, InterfaceType } = require("../schemas");
const { findAll, findById, destroy } = require("./pcPartsBaseService");
const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

const INCLUDE = [
  { model: FormFactor, as: "formFactor" },
  { model: InterfaceType, as: "interfaceType" },
];
const EXCLUDE = ["formFactorId", "interfaceTypeId"];

const getAll = () => findAll(Hdd, INCLUDE, EXCLUDE);

const getById = (id) => findById(Hdd, id, INCLUDE, EXCLUDE);

const create = async ({
  name,
  formFactorId,
  interfaceTypeId,
  capacity,
  tdp,
  description,
}) => {
  if (
    !name ||
    !formFactorId ||
    !interfaceTypeId ||
    capacity == null ||
    tdp == null
  ) {
    throw new AppError(
      "name, formFactorId, interfaceTypeId, capacity, tdp là bắt buộc",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }
  const record = await Hdd.create({
    name,
    formFactorId,
    interfaceTypeId,
    capacity,
    tdp,
    description,
  });
  return findById(Hdd, record.id, INCLUDE, EXCLUDE);
};

const update = async (id, data) => {
  const record = await findById(Hdd, id);
  await record.update(data);
  return findById(Hdd, id, INCLUDE, EXCLUDE);
};

const remove = (id) => destroy(Hdd, id);

module.exports = { getAll, getById, create, update, remove };
