const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Role = sequelize.define(
    "Role",
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
      tableName: "roles",
      timestamps: false,
    },
  );

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: "roleName",
      sourceKey: "name",
      as: "users",
    });

    Role.belongsToMany(models.Permission, {
      through: "role_permissions",
      foreignKey: "roleName",
      otherKey: "permissionName",
      as: "permissions",
    });
  };

  return Role;
};
