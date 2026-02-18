const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Cooler = sequelize.define(
    "Cooler",
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
      coolerTypeId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "cooler_type", key: "id" },
      },
      radiatorSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "mm: 120/240/360 — null nếu là tản khí (AIR)",
      },
      heightMm: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Chiều cao tản khí (mm) — null nếu là AIO",
      },
      tdpSupport: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Watt TDP tối đa hỗ trợ",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "cooler",
      timestamps: false,
    },
  );

  Cooler.associate = (models) => {
    Cooler.belongsTo(models.CoolerType, {
      foreignKey: "coolerTypeId",
      as: "coolerType",
    });
  };

  return Cooler;
};
