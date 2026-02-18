const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PcieVersion = sequelize.define(
    "PcieVersion",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: "PCIE_3 | PCIE_4 | PCIE_5",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "pcie_version",
      timestamps: false,
    },
  );

  PcieVersion.associate = (models) => {
    PcieVersion.hasMany(models.Cpu, {
      foreignKey: "pcieVersionId",
      as: "cpus",
    });
    PcieVersion.hasMany(models.Mainboard, {
      foreignKey: "pcieVgaVersionId",
      as: "mainboards",
    });
    PcieVersion.hasMany(models.Vga, {
      foreignKey: "pcieVersionId",
      as: "vgas",
    });
  };

  return PcieVersion;
};
