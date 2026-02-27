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
    PcieConnector.belongsToMany(models.Psu, {
      through: models.PsuPcieConnector,
      foreignKey: "pcieConnectorId",
      otherKey: "psuId",
      as: "psus",
    });
    PcieConnector.hasMany(models.Vga, {
      foreignKey: "pcieConnectorId",
      as: "vgas",
    });
  };

  return PcieConnector;
};
