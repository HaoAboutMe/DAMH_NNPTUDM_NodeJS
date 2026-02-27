const { DataTypes } = require("sequelize");

/**
 * Junction table: PSU <-> PcieConnector (many-to-many)
 * Một PSU có thể có nhiều loại PCIe connector,
 * một loại connector có thể thuộc nhiều PSU.
 */
module.exports = (sequelize) => {
  const PsuPcieConnector = sequelize.define(
    "PsuPcieConnector",
    {
      psuId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "psu", key: "id" },
      },
      pcieConnectorId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "pcie_connector", key: "id" },
      },
    },
    {
      tableName: "psu_pcie_connector",
      timestamps: false,
    },
  );

  return PsuPcieConnector;
};
