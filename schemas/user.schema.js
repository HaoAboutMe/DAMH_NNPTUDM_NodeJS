const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      roleName: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "roles",
          key: "name",
        },
      },
    },
    {
      tableName: "users",
      timestamps: false,
    },
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: "roleName",
      targetKey: "name",
      as: "role",
    });
  };

  return User;
};
