const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
);

const User = require("./user.schema")(sequelize);
const Role = require("./role.schema")(sequelize);
const Permission = require("./permission.schema")(sequelize);
const RolePermission = require("./role_permission.schema")(sequelize);

const models = {
  Role,
  Permission,
  RolePermission,
  User,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
