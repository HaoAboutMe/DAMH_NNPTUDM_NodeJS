const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Ssd = sequelize.define(
    "Ssd",
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
      ssdTypeId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "ssd_type", key: "id" },
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
      tableName: "ssd",
      timestamps: false,
    },
  );

  Ssd.associate = (models) => {
    Ssd.belongsTo(models.SsdType, { foreignKey: "ssdTypeId", as: "ssdType" });
    Ssd.belongsTo(models.FormFactor, {
      foreignKey: "formFactorId",
      as: "formFactor",
    });
    Ssd.belongsTo(models.InterfaceType, {
      foreignKey: "interfaceTypeId",
      as: "interfaceType",
    });
  };

  return Ssd;
};
