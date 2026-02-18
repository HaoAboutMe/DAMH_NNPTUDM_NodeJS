const bcrypt = require("bcrypt");
const {
  User,
  Role,
  Permission,
  RolePermission,
  CoolerType,
  FormFactor,
  InterfaceType,
  PcieConnector,
  PcieVersion,
  RamType,
  Socket,
  SsdType,
} = require("./index");

async function seed() {
  // ── 1. Roles ────────────────────────────────────────────────────────────────
  const [adminRole] = await Role.findOrCreate({
    where: { name: "ADMIN" },
    defaults: { name: "ADMIN", description: "Quản trị hệ thống" },
  });

  await Role.findOrCreate({
    where: { name: "USER" },
    defaults: { name: "USER", description: "Người dùng thông thường" },
  });

  // ── 2. Permissions ──────────────────────────────────────────────────────────
  const permissionsData = [
    { name: "USER_READ", description: "Xem user" },
    { name: "USER_WRITE", description: "Tạo / sửa user" },
    { name: "USER_DELETE", description: "Xóa user" },
    { name: "ROLE_MANAGE", description: "Quản lý role" },
  ];

  const permissions = [];
  for (const p of permissionsData) {
    const [perm] = await Permission.findOrCreate({
      where: { name: p.name },
      defaults: p,
    });
    permissions.push(perm);
  }

  // ── 3. Gán full permission cho ADMIN ────────────────────────────────────────
  for (const perm of permissions) {
    await RolePermission.findOrCreate({
      where: { roleName: adminRole.name, permissionName: perm.name },
    });
  }

  // ── 4. Admin user ───────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("admin", 10);
  await User.findOrCreate({
    where: { email: "haoaboutme@gmail.com" },
    defaults: {
      username: "Admin Hảo",
      firstname: "Admin",
      lastname: "Hảo",
      password: hashedPassword,
      dateOfBirth: "2026-01-01",
      roleName: adminRole.name,
    },
  });

  console.log("✅ Seed Auth/User thành công");

  // ── 5. PC Parts — Lookup Tables ─────────────────────────────────────────────

  // CoolerType
  const coolerTypes = [
    { id: "AIR", name: "Air Cooler (Tản nhiệt khí)" },
    { id: "AIO", name: "AIO Liquid Cooler (Tản nhiệt nước)" },
  ];
  for (const item of coolerTypes) {
    await CoolerType.findOrCreate({ where: { id: item.id }, defaults: item });
  }

  // FormFactor
  const formFactors = [
    { id: "FF_2_5", name: '2.5" (SATA SSD / HDD laptop)' },
    { id: "FF_3_5", name: '3.5" (HDD desktop)' },
    { id: "M2_2280", name: "M.2 2280 (80mm)" },
    { id: "M2_2260", name: "M.2 2260 (60mm)" },
    { id: "M2_2242", name: "M.2 2242 (42mm)" },
  ];
  for (const item of formFactors) {
    await FormFactor.findOrCreate({ where: { id: item.id }, defaults: item });
  }

  // InterfaceType
  const interfaceTypes = [
    { id: "SATA_3", name: "SATA III (6 Gb/s)" },
    { id: "SAS", name: "SAS (Serial Attached SCSI)" },
    { id: "PCIE_3", name: "PCIe 3.0 NVMe" },
    { id: "PCIE_4", name: "PCIe 4.0 NVMe" },
    { id: "PCIE_5", name: "PCIe 5.0 NVMe" },
  ];
  for (const item of interfaceTypes) {
    await InterfaceType.findOrCreate({
      where: { id: item.id },
      defaults: item,
    });
  }

  // PcieConnector
  const pcieConnectors = [
    { id: "2X8PIN", name: "2x 8-pin PCIe" },
    { id: "3X8PIN", name: "3x 8-pin PCIe" },
    { id: "12VHPWR", name: "12VHPWR (16-pin, RTX 4000 series)" },
    { id: "16PIN", name: "16-pin PCIe" },
  ];
  for (const item of pcieConnectors) {
    await PcieConnector.findOrCreate({
      where: { id: item.id },
      defaults: item,
    });
  }

  // PcieVersion
  const pcieVersions = [
    { id: "PCIE_3", name: "PCIe 3.0" },
    { id: "PCIE_4", name: "PCIe 4.0" },
    { id: "PCIE_5", name: "PCIe 5.0" },
  ];
  for (const item of pcieVersions) {
    await PcieVersion.findOrCreate({ where: { id: item.id }, defaults: item });
  }

  // RamType
  const ramTypes = [
    { id: "DDR4", name: "DDR4 SDRAM" },
    { id: "DDR5", name: "DDR5 SDRAM" },
  ];
  for (const item of ramTypes) {
    await RamType.findOrCreate({ where: { id: item.id }, defaults: item });
  }

  // Socket
  const sockets = [
    { id: "AM4", name: "AMD AM4 (Ryzen 1000–5000)" },
    { id: "AM5", name: "AMD AM5 (Ryzen 7000+)" },
    { id: "LGA1700", name: "Intel LGA1700 (12th–14th Gen)" },
  ];
  for (const item of sockets) {
    await Socket.findOrCreate({ where: { id: item.id }, defaults: item });
  }

  // SsdType
  const ssdTypes = [
    { id: "SATA", name: "SATA SSD" },
    { id: "NVME", name: "NVMe SSD" },
  ];
  for (const item of ssdTypes) {
    await SsdType.findOrCreate({ where: { id: item.id }, defaults: item });
  }

  console.log("✅ Seed PC Parts Lookup Tables thành công");
}

module.exports = seed;
