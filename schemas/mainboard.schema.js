const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Mainboard = sequelize.define(
    "Mainboard",
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
      vrmPhase: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Số phase VRM",
      },
      cpuTdpSupport: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Watt TDP CPU tối đa hỗ trợ",
      },
      ramTypeId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "ram_type", key: "id" },
      },
      ramBusMax: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "MHz — bus RAM tối đa hỗ trợ",
      },
      ramSlot: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Số khe RAM",
      },
      ramMaxCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "GB — dung lượng RAM tối đa",
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "ATX | mATX | ITX",
      },
      pcieVgaVersionId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: "pcie_version", key: "id" },
      },
      m2Slot: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Số khe M.2",
      },
      sataSlot: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Số cổng SATA",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "mainboard",
      timestamps: false,
    },
  );

  Mainboard.associate = (models) => {
    Mainboard.belongsTo(models.Socket, {
      foreignKey: "socketId",
      as: "socket",
    });
    Mainboard.belongsTo(models.RamType, {
      foreignKey: "ramTypeId",
      as: "ramType",
    });
    Mainboard.belongsTo(models.PcieVersion, {
      foreignKey: "pcieVgaVersionId",
      as: "pcieVgaVersion",
    });
  };

  return Mainboard;
};
