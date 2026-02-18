const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RolePermission = sequelize.define(
    "RolePermission",
    {
      roleName: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "roles",
          key: "name",
        },
      },
      permissionName: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "permissions",
          key: "name",
        },
      },
    },
    {
      tableName: "role_permissions",
      timestamps: false,
    },
  );

  return RolePermission;
};
