const { Ssd, SsdType, FormFactor, InterfaceType } = require("../schemas");
const { findAll, findById, destroy } = require("./pcPartsBaseService");
const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

const INCLUDE = [
  { model: SsdType, as: "ssdType" },
  { model: FormFactor, as: "formFactor" },
  { model: InterfaceType, as: "interfaceType" },
];

const getAll = () => findAll(Ssd, INCLUDE);

const getById = (id) => findById(Ssd, id, INCLUDE);

const create = async ({
  name,
  ssdTypeId,
  formFactorId,
  interfaceTypeId,
  capacity,
  tdp,
  description,
}) => {
  if (
    !name ||
    !ssdTypeId ||
    !formFactorId ||
    !interfaceTypeId ||
    capacity == null ||
    tdp == null
  ) {
    throw new AppError(
      "name, ssdTypeId, formFactorId, interfaceTypeId, capacity, tdp là bắt buộc",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }
  return await Ssd.create({
    name,
    ssdTypeId,
    formFactorId,
    interfaceTypeId,
    capacity,
    tdp,
    description,
  });
};

const update = async (id, data) => {
  const record = await findById(Ssd, id);
  await record.update(data);
  return findById(Ssd, id, INCLUDE);
};

const remove = (id) => destroy(Ssd, id);

module.exports = { getAll, getById, create, update, remove };
