const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CoolerType = sequelize.define(
    "CoolerType",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: "AIR | AIO",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "cooler_type",
      timestamps: false,
    },
  );

  CoolerType.associate = (models) => {
    CoolerType.hasMany(models.Cooler, {
      foreignKey: "coolerTypeId",
      as: "coolers",
    });
  };

  return CoolerType;
};
