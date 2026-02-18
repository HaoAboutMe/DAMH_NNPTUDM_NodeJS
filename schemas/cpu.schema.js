const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Cpu = sequelize.define(
    "Cpu",
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
      socketId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "socket", key: "id" },
      },
      vrmMin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Số phase VRM tối thiểu yêu cầu",
      },
      igpu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Có iGPU tích hợp không",
      },
      tdp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Watt",
      },
      pcieVersionId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "pcie_version", key: "id" },
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Điểm hiệu năng benchmark",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "cpu",
      timestamps: false,
    },
  );

  Cpu.associate = (models) => {
    Cpu.belongsTo(models.Socket, { foreignKey: "socketId", as: "socket" });
    Cpu.belongsTo(models.PcieVersion, {
      foreignKey: "pcieVersionId",
      as: "pcieVersion",
    });
  };

  return Cpu;
};
