const bcrypt = require("bcrypt");
const { User, Role, Permission, RolePermission } = require("./index");

async function seed() {
  // 1. Tạo role ADMIN
  const [adminRole] = await Role.findOrCreate({
    where: { name: "ADMIN" },
    defaults: {
      name: "ADMIN",
      description: "Quản trị hệ thống",
    },
  });

  // 1.1. Tạo role USER (mặc định cho user đăng ký)
  await Role.findOrCreate({
    where: { name: "USER" },
    defaults: {
      name: "USER",
      description: "Người dùng thông thường",
    },
  });

  // 2. Tạo permissions (full quyền – demo)
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

  // 3. Gán full permission cho ADMIN
  for (const perm of permissions) {
    await RolePermission.findOrCreate({
      where: {
        roleName: adminRole.name,
        permissionName: perm.name,
      },
    });
  }

  // 4. Hash password
  const hashedPassword = await bcrypt.hash("admin", 10);

  // 5. Tạo user ADMIN
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

  console.log("✅ Seed ADMIN user thành công");
}

module.exports = seed;
