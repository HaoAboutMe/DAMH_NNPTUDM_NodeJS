const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CaseSize = sequelize.define(
    "CaseSize",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: "ATX | MATX | ITX | EATX",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "case_size",
      timestamps: false,
    },
  );

  CaseSize.associate = (models) => {
    CaseSize.hasMany(models.PcCase, {
      foreignKey: "caseSizeId",
      as: "pcCases",
    });
    CaseSize.hasMany(models.Mainboard, {
      foreignKey: "caseSizeId",
      as: "mainboards",
    });
  };

  return CaseSize;
};
