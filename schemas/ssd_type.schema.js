const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SsdType = sequelize.define(
    "SsdType",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: "SATA | NVME",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "ssd_type",
      timestamps: false,
    },
  );

  SsdType.associate = (models) => {
    SsdType.hasMany(models.Ssd, { foreignKey: "ssdTypeId", as: "ssds" });
  };

  return SsdType;
};
