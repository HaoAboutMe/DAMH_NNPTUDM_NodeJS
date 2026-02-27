const { Psu, PcieConnector } = require("../schemas");
const { findAll, findById, destroy } = require("./pcPartsBaseService");
const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

const INCLUDE = [{ model: PcieConnector, as: "pcieConnector" }];
const EXCLUDE = ["pcieConnectorId"];

const getAll = () => findAll(Psu, INCLUDE, EXCLUDE);

const getById = (id) => findById(Psu, id, INCLUDE, EXCLUDE);

const create = async ({
  name,
  wattage,
  efficiency,
  pcieConnectorId,
  sataConnector,
  description,
}) => {
  if (!name || wattage == null || !efficiency) {
    throw new AppError(
      "name, wattage, efficiency là bắt buộc",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }
  const record = await Psu.create({
    name,
    wattage,
    efficiency,
    pcieConnectorId: pcieConnectorId ?? null,
    sataConnector: sataConnector ?? 0,
    description,
  });
  return findById(Psu, record.id, INCLUDE, EXCLUDE);
};

const update = async (id, data) => {
  const record = await findById(Psu, id);
  await record.update(data);
  return findById(Psu, id, INCLUDE, EXCLUDE);
};

const remove = (id) => destroy(Psu, id);

module.exports = { getAll, getById, create, update, remove };
