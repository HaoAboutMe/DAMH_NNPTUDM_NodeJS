const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Ram = sequelize.define(
    "Ram",
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
      ramTypeId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "ram_type", key: "id" },
      },
      ramBus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "MHz",
      },
      ramCas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "CAS Latency",
      },
      capacityPerStick: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "GB mỗi thanh",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "Số thanh trong kit",
      },
      tdp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Watt",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "ram",
      timestamps: false,
    },
  );

  Ram.associate = (models) => {
    Ram.belongsTo(models.RamType, { foreignKey: "ramTypeId", as: "ramType" });
  };

  return Ram;
};
