const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const InterfaceType = sequelize.define(
    "InterfaceType",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: "SATA_3 | SAS | PCIE_3 | PCIE_4 | PCIE_5",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "interface_type",
      timestamps: false,
    },
  );

  InterfaceType.associate = (models) => {
    InterfaceType.hasMany(models.Ssd, {
      foreignKey: "interfaceTypeId",
      as: "ssds",
    });
    InterfaceType.hasMany(models.Hdd, {
      foreignKey: "interfaceTypeId",
      as: "hdds",
    });
  };

  return InterfaceType;
};
