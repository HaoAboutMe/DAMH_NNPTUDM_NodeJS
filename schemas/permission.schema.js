const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Permission = sequelize.define(
    "Permission",
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "permissions",
      timestamps: false,
    },
  );

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, {
      through: "role_permissions",
      foreignKey: "permissionName",
      otherKey: "roleName",
      as: "roles",
    });
  };

  return Permission;
};
