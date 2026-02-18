const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Psu = sequelize.define(
    "Psu",
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
      wattage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Watt công suất",
      },
      efficiency: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "80+ Bronze | Gold | Platinum | Titanium",
      },
      pcieConnectorId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: { model: "pcie_connector", key: "id" },
        comment: "nullable — một số PSU không có PCIe connector riêng",
      },
      sataConnector: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Số cổng SATA power",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "psu",
      timestamps: false,
    },
  );

  Psu.associate = (models) => {
    Psu.belongsTo(models.PcieConnector, {
      foreignKey: "pcieConnectorId",
      as: "pcieConnector",
    });
  };

  return Psu;
};
