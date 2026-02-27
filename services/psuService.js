const { Psu, PcieConnector } = require("../schemas");
const { findAll, findById, destroy } = require("./pcPartsBaseService");
const { AppError } = require("./authService");
const { ErrorCodes } = require("../utils/errorCodes");

const INCLUDE = [
  { model: PcieConnector, as: "pcieConnectors", through: { attributes: [] } },
];

// Không cần EXCLUDE vì many-to-many không sinh FK field trên bảng psu

const getAll = () => findAll(Psu, INCLUDE);

const getById = (id) => findById(Psu, id, INCLUDE);

const create = async ({
  name,
  wattage,
  efficiency,
  pcieConnectorIds, // mảng string ID, có thể rỗng
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
    sataConnector: sataConnector ?? 0,
    description,
  });

  // Gán các PCIe connectors (many-to-many)
  if (Array.isArray(pcieConnectorIds) && pcieConnectorIds.length) {
    await record.setPcieConnectors(pcieConnectorIds);
  }

  return findById(Psu, record.id, INCLUDE);
};

const update = async (id, data) => {
  const record = await Psu.findByPk(id);
  if (!record) {
    throw new AppError(
      "Không tìm thấy linh kiện",
      ErrorCodes.PC_PART_NOT_FOUND,
    );
  }

  const { pcieConnectorIds, ...rest } = data;
  await record.update(rest);

  // Cập nhật danh sách connectors nếu client có gửi
  if (Array.isArray(pcieConnectorIds)) {
    await record.setPcieConnectors(pcieConnectorIds);
  }

  return findById(Psu, id, INCLUDE);
};

const remove = (id) => destroy(Psu, id);

module.exports = { getAll, getById, create, update, remove };
