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

// ── Auth / User models ────────────────────────────────────────────────────────
const User = require("./user.schema")(sequelize);
const Role = require("./role.schema")(sequelize);
const Permission = require("./permission.schema")(sequelize);
const RolePermission = require("./role_permission.schema")(sequelize);

// ── PC Parts: Lookup Tables (Manual String ID) ────────────────────────────────
const CoolerType = require("./cooler_type.schema")(sequelize);
const FormFactor = require("./form_factor.schema")(sequelize);
const InterfaceType = require("./interface_type.schema")(sequelize);
const PcieConnector = require("./pcie_connector.schema")(sequelize);
const PcieVersion = require("./pcie_version.schema")(sequelize);
const RamType = require("./ram_type.schema")(sequelize);
const Socket = require("./socket.schema")(sequelize);
const SsdType = require("./ssd_type.schema")(sequelize);

// ── PC Parts: Data Tables (Auto UUID) ────────────────────────────────────────
const PcCase = require("./pc_case.schema")(sequelize);
const Cooler = require("./cooler.schema")(sequelize);
const Cpu = require("./cpu.schema")(sequelize);
const Hdd = require("./hdd.schema")(sequelize);
const Mainboard = require("./mainboard.schema")(sequelize);
const Psu = require("./psu.schema")(sequelize);
const Ram = require("./ram.schema")(sequelize);
const Ssd = require("./ssd.schema")(sequelize);
const Vga = require("./vga.schema")(sequelize);

const models = {
  // Auth / User
  Role,
  Permission,
  RolePermission,
  User,

  // Lookup Tables
  CoolerType,
  FormFactor,
  InterfaceType,
  PcieConnector,
  PcieVersion,
  RamType,
  Socket,
  SsdType,

  // Data Tables
  PcCase,
  Cooler,
  Cpu,
  Hdd,
  Mainboard,
  Psu,
  Ram,
  Ssd,
  Vga,
};

// Chạy associate cho tất cả models
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
