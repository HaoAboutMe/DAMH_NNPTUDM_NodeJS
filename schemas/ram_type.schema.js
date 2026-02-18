const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RamType = sequelize.define(
    "RamType",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: "DDR4 | DDR5",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "ram_type",
      timestamps: false,
    },
  );

  RamType.associate = (models) => {
    RamType.hasMany(models.Ram, { foreignKey: "ramTypeId", as: "rams" });
    RamType.hasMany(models.Mainboard, {
      foreignKey: "ramTypeId",
      as: "mainboards",
    });
  };

  return RamType;
};
