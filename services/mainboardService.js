const {
  Mainboard,
  Socket,
  RamType,
  PcieVersion,
  CaseSize,
} = require("../schemas");
const { findAll, findById, destroy } = require("./pcPartsBaseService");
const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

const INCLUDE = [
  { model: Socket, as: "socket" },
  { model: RamType, as: "ramType" },
  { model: PcieVersion, as: "pcieVgaVersion" },
  { model: CaseSize, as: "caseSize" },
];
const EXCLUDE = ["socketId", "ramTypeId", "pcieVgaVersionId", "caseSizeId"];

const getAll = () => findAll(Mainboard, INCLUDE, EXCLUDE);

const getById = (id) => findById(Mainboard, id, INCLUDE, EXCLUDE);

const create = async ({
  name,
  socketId,
  vrmPhase,
  cpuTdpSupport,
  ramTypeId,
  ramBusMax,
  ramSlot,
  ramMaxCapacity,
  caseSizeId,
  pcieVgaVersionId,
  m2Slot,
  sataSlot,
  description,
}) => {
  if (
    !name ||
    !socketId ||
    vrmPhase == null ||
    cpuTdpSupport == null ||
    !ramTypeId ||
    ramBusMax == null ||
    ramSlot == null ||
    ramMaxCapacity == null ||
    !caseSizeId ||
    !pcieVgaVersionId
  ) {
    throw new AppError(
      "Thiếu trường bắt buộc",
      ErrorCodes.MISSING_REQUIRED_FIELDS,
    );
  }
  const record = await Mainboard.create({
    name,
    socketId,
    vrmPhase,
    cpuTdpSupport,
    ramTypeId,
    ramBusMax,
    ramSlot,
    ramMaxCapacity,
    caseSizeId,
    pcieVgaVersionId,
    m2Slot: m2Slot ?? 0,
    sataSlot: sataSlot ?? 0,
    description,
  });
  return findById(Mainboard, record.id, INCLUDE, EXCLUDE);
};

const update = async (id, data) => {
  const record = await findById(Mainboard, id);
  await record.update(data);
  return findById(Mainboard, id, INCLUDE, EXCLUDE);
};

const remove = (id) => destroy(Mainboard, id);

module.exports = { getAll, getById, create, update, remove };
