const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Vga = sequelize.define(
    "Vga",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lengthMm: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Chiều dài card (mm)",
      },
      tdp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Watt",
      },
      pcieVersionId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "pcie_version", key: "id" },
      },
      pcieConnectorId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "pcie_connector", key: "id" },
        comment: "Loại connector nguồn PCIe (vd: 12VHPWR, 2X8PIN)",
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Điểm hiệu năng benchmark",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "vga",
      timestamps: false,
    },
  );

  Vga.associate = (models) => {
    Vga.belongsTo(models.PcieVersion, {
      foreignKey: "pcieVersionId",
      as: "pcieVersion",
    });
    Vga.belongsTo(models.PcieConnector, {
      foreignKey: "pcieConnectorId",
      as: "pcieConnector",
    });
  };

  return Vga;
};
