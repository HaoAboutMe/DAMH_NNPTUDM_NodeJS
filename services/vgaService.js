const { Vga, PcieVersion, PcieConnector } = require("../schemas");
const { findAll, findById, destroy } = require("./pcPartsBaseService");
const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

const INCLUDE = [
  { model: PcieVersion, as: "pcieVersion" },
  { model: PcieConnector, as: "pcieConnector" },
];
const EXCLUDE = ["pcieVersionId", "pcieConnectorId"];

const getAll = () => findAll(Vga, INCLUDE, EXCLUDE);

const getById = (id) => findById(Vga, id, INCLUDE, EXCLUDE);

const create = async ({
  name,
  lengthMm,
  tdp,
  pcieVersionId,
  pcieConnectorId,
  score,
  description,
}) => {
  if (
    !name ||
    lengthMm == null ||
    tdp == null ||
    !pcieVersionId ||
    !pcieConnectorId
  ) {
    throw new AppError(
      "name, lengthMm, tdp, pcieVersionId, pcieConnectorId là bắt buộc",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }
  const record = await Vga.create({
    name,
    lengthMm,
    tdp,
    pcieVersionId,
    pcieConnectorId,
    score: score ?? 0,
    description,
  });
  return findById(Vga, record.id, INCLUDE, EXCLUDE);
};

const update = async (id, data) => {
  const record = await findById(Vga, id);
  await record.update(data);
  return findById(Vga, id, INCLUDE, EXCLUDE);
};

const remove = (id) => destroy(Vga, id);

module.exports = { getAll, getById, create, update, remove };
