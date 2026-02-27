const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PcCase = sequelize.define(
    "PcCase",
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
      caseSizeId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "case_size", key: "id" },
      },
      maxVgaLengthMm: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "mm",
      },
      maxCoolerHeightMm: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "mm",
      },
      maxRadiatorSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "mm (120/240/360)",
      },
      drive35Slot: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Số khe 3.5 inch",
      },
      drive25Slot: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Số khe 2.5 inch",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "pc_case",
      timestamps: false,
    },
  );

  PcCase.associate = (models) => {
    PcCase.belongsTo(models.CaseSize, {
      foreignKey: "caseSizeId",
      as: "caseSize",
    });
  };

  return PcCase;
};
