const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Socket = sequelize.define(
    "Socket",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        comment: "AM4 | AM5 | LGA1700",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "socket",
      timestamps: false,
    },
  );

  Socket.associate = (models) => {
    Socket.hasMany(models.Cpu, { foreignKey: "socketId", as: "cpus" });
    Socket.hasMany(models.Mainboard, {
      foreignKey: "socketId",
      as: "mainboards",
    });
  };

  return Socket;
};
