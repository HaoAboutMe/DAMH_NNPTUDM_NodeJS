const { Cpu, Socket, PcieVersion } = require("../schemas");
const { findAll, findById, destroy } = require("./pcPartsBaseService");
const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

const INCLUDE = [
  { model: Socket, as: "socket" },
  { model: PcieVersion, as: "pcieVersion" },
];

const getAll = () => findAll(Cpu, INCLUDE);

const getById = (id) => findById(Cpu, id, INCLUDE);

const create = async ({
  name,
  socketId,
  vrmMin,
  igpu,
  tdp,
  pcieVersionId,
  score,
  description,
}) => {
  if (!name || !socketId || vrmMin == null || tdp == null || !pcieVersionId) {
    throw new AppError(
      "name, socketId, vrmMin, tdp, pcieVersionId là bắt buộc",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }
  return await Cpu.create({
    name,
    socketId,
    vrmMin,
    igpu: igpu ?? false,
    tdp,
    pcieVersionId,
    score: score ?? 0,
    description,
  });
};

const update = async (id, data) => {
  const record = await findById(Cpu, id);
  await record.update(data);
  return findById(Cpu, id, INCLUDE);
};

const remove = (id) => destroy(Cpu, id);

module.exports = { getAll, getById, create, update, remove };
