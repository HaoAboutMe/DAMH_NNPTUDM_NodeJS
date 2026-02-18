const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PcieConnector = sequelize.define(
    "PcieConnector",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: "2X8PIN | 3X8PIN | 12VHPWR | 16PIN",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "pcie_connector",
      timestamps: false,
    },
  );

  PcieConnector.associate = (models) => {
    PcieConnector.hasMany(models.Psu, {
      foreignKey: "pcieConnectorId",
      as: "psus",
    });
  };

  return PcieConnector;
};
