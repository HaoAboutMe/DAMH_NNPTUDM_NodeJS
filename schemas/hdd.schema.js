const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Hdd = sequelize.define(
    "Hdd",
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
      formFactorId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "form_factor", key: "id" },
      },
      interfaceTypeId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "interface_type", key: "id" },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "GB",
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
      tableName: "hdd",
      timestamps: false,
    },
  );

  Hdd.associate = (models) => {
    Hdd.belongsTo(models.FormFactor, {
      foreignKey: "formFactorId",
      as: "formFactor",
    });
    Hdd.belongsTo(models.InterfaceType, {
      foreignKey: "interfaceTypeId",
      as: "interfaceType",
    });
  };

  return Hdd;
};
