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
    Psu.belongsToMany(models.PcieConnector, {
      through: models.PsuPcieConnector,
      foreignKey: "psuId",
      otherKey: "pcieConnectorId",
      as: "pcieConnectors",
    });
  };

  return Psu;
};
