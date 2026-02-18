# Schema Update Summary - Name as Primary Key

## Tổng quan thay đổi

Đã cập nhật schema cho `Role`, `Permission`, và `RolePermission` để sử dụng `name` làm khóa chính thay vì `id` (UUID).

## Lý do thay đổi

- **Đơn giản hóa**: Sử dụng `name` làm khóa chính giúp dễ đọc và dễ hiểu hơn
- **Tự nhiên hơn**: Role và Permission thường được tham chiếu bằng tên (VD: "ADMIN", "USER")
- **Giảm join**: Không cần join để lấy tên role/permission

## Files đã cập nhật

### 1. Schema Files

#### `/schemas/role.schema.js`

**Trước:**

```javascript
{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
}
```

**Sau:**

```javascript
{
  name: {
    type: DataTypes.STRING,
    primaryKey: true,  // ✅ name là primary key
  },
  description: {
    type: DataTypes.STRING,
  },
}
```

**Associations:**

```javascript
// User relationship
Role.hasMany(models.User, {
  foreignKey: "roleName", // ✅ Đổi từ roleId
  sourceKey: "name", // ✅ Tham chiếu đến name
  as: "users",
});

// Permission relationship
Role.belongsToMany(models.Permission, {
  through: "role_permissions",
  foreignKey: "roleName", // ✅ Đổi từ roleId
  otherKey: "permissionName", // ✅ Đổi từ permissionId
  as: "permissions",
});
```

#### `/schemas/permission.schema.js`

**Trước:**

```javascript
{
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
}
```

**Sau:**

```javascript
{
  name: {
    type: DataTypes.STRING,
    primaryKey: true,  // ✅ name là primary key
  },
  description: {
    type: DataTypes.STRING,
  },
}
```

**Associations:**

```javascript
Permission.belongsToMany(models.Role, {
  through: "role_permissions",
  foreignKey: "permissionName", // ✅ Đổi từ permissionId
  otherKey: "roleName", // ✅ Đổi từ roleId
  as: "roles",
});
```

#### `/schemas/role_permission.schema.js`

**Trước:**

```javascript
{
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  roleId: {
    type: DataTypes.UUID,
    references: { model: "Roles", key: "id" },
  },
  permissionId: {
    type: DataTypes.UUID,
    references: { model: "Permissions", key: "id" },
  },
}
```

**Sau:**

```javascript
{
  roleName: {
    type: DataTypes.STRING,
    primaryKey: true,  // ✅ Composite primary key (part 1)
    references: {
      model: "roles",
      key: "name"     // ✅ Tham chiếu đến Role.name
    },
  },
  permissionName: {
    type: DataTypes.STRING,
    primaryKey: true,  // ✅ Composite primary key (part 2)
    references: {
      model: "permissions",
      key: "name"     // ✅ Tham chiếu đến Permission.name
    },
  },
}
```

**Note**: `RolePermission` giờ sử dụng **composite primary key** (roleName + permissionName)

#### `/schemas/user.schema.js`

**Trước:**

```javascript
{
  roleId: {
    type: DataTypes.UUID,
    references: { model: "Roles", key: "id" },
  },
}

User.belongsTo(models.Role, {
  foreignKey: "roleId",
  as: "role",
});
```

**Sau:**

```javascript
{
  roleName: {
    type: DataTypes.STRING,
    references: {
      model: "roles",
      key: "name"     // ✅ Tham chiếu đến Role.name
    },
  },
}

User.belongsTo(models.Role, {
  foreignKey: "roleName",  // ✅ Đổi từ roleId
  targetKey: "name",       // ✅ Tham chiếu đến name
  as: "role",
});
```

### 2. Service Files

#### `/schemas/seed.js`

**Thay đổi:**

```javascript
// Trước
await RolePermission.findOrCreate({
  where: {
    roleId: adminRole.id,
    permissionId: perm.id,
  },
});

await User.create({
  roleId: adminRole.id,
});

// Sau
await RolePermission.findOrCreate({
  where: {
    roleName: adminRole.name, // ✅ Sử dụng name
    permissionName: perm.name, // ✅ Sử dụng name
  },
});

await User.create({
  roleName: adminRole.name, // ✅ Sử dụng name
});
```

#### `/utils/authService.js`

**Thay đổi:**

```javascript
// Trước
const newUser = await User.create({
  roleId: userRole.id,
});

const token = generateToken({
  userId: newUser.id,
  roleId: newUser.roleId,
});

const userResponse = {
  roleId: newUser.roleId,
};

// Sau
const newUser = await User.create({
  roleName: userRole.name, // ✅ Sử dụng name
});

const token = generateToken({
  userId: newUser.id,
  roleName: newUser.roleName, // ✅ Sử dụng name
});

const userResponse = {
  roleName: newUser.roleName, // ✅ Sử dụng name
};
```

**Role attributes trong include:**

```javascript
// Trước
attributes: ["id", "name", "description"];

// Sau
attributes: ["name", "description"]; // ✅ Không có id
```

#### `/utils/userService.js`

**Thay đổi:**

```javascript
// Trước
attributes: ["id", "name", "description"];

// Sau
attributes: ["name", "description"]; // ✅ Không có id
```

#### `/middlewares/auth.middleware.js`

**Thay đổi:**

```javascript
// Trước
req.user = {
  roleId: user.roleId,
};

attributes: ["id", "name", "description"];

// Sau
req.user = {
  roleName: user.roleName, // ✅ Sử dụng name
};

attributes: ["name", "description"]; // ✅ Không có id
```

## Database Schema Changes

### Bảng `roles`

```sql
-- Trước
CREATE TABLE roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description VARCHAR(255)
);

-- Sau
CREATE TABLE roles (
  name VARCHAR(255) PRIMARY KEY,
  description VARCHAR(255)
);
```

### Bảng `permissions`

```sql
-- Trước
CREATE TABLE permissions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description VARCHAR(255)
);

-- Sau
CREATE TABLE permissions (
  name VARCHAR(255) PRIMARY KEY,
  description VARCHAR(255)
);
```

### Bảng `role_permissions`

```sql
-- Trước
CREATE TABLE role_permissions (
  id VARCHAR(36) PRIMARY KEY,
  roleId VARCHAR(36) REFERENCES roles(id),
  permissionId VARCHAR(36) REFERENCES permissions(id)
);

-- Sau
CREATE TABLE role_permissions (
  roleName VARCHAR(255) REFERENCES roles(name),
  permissionName VARCHAR(255) REFERENCES permissions(name),
  PRIMARY KEY (roleName, permissionName)
);
```

### Bảng `users`

```sql
-- Trước
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  dateOfBirth DATE NOT NULL,
  roleId VARCHAR(36) REFERENCES roles(id)
);

-- Sau
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  dateOfBirth DATE NOT NULL,
  roleName VARCHAR(255) REFERENCES roles(name)
);
```

## API Response Changes

### Trước

```json
{
  "code": 1000,
  "result": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "roleId": "uuid-of-role",
      "role": {
        "id": "uuid-of-role",
        "name": "USER",
        "description": "Người dùng thông thường"
      }
    }
  }
}
```

### Sau

```json
{
  "code": 1000,
  "result": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "roleName": "USER",
      "role": {
        "name": "USER",
        "description": "Người dùng thông thường"
      }
    }
  }
}
```

**Thay đổi:**

- ✅ `roleId` → `roleName`
- ✅ `role.id` không còn tồn tại
- ✅ `role` chỉ có `name` và `description`

## JWT Token Payload Changes

### Trước

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "roleId": "uuid-of-role",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Sau

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "roleName": "USER",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Thay đổi:**

- ✅ `roleId` → `roleName`
- ✅ Token payload giờ chứa tên role trực tiếp

## Migration Guide

### Nếu đã có database cũ:

1. **Backup database** trước khi migrate

2. **Drop và recreate tables** (hoặc viết migration script):

```sql
-- Drop foreign keys
ALTER TABLE users DROP FOREIGN KEY users_ibfk_1;
ALTER TABLE role_permissions DROP FOREIGN KEY role_permissions_ibfk_1;
ALTER TABLE role_permissions DROP FOREIGN KEY role_permissions_ibfk_2;

-- Drop old tables
DROP TABLE role_permissions;
DROP TABLE users;
DROP TABLE permissions;
DROP TABLE roles;

-- Sequelize sẽ tạo lại tables với schema mới
```

3. **Chạy lại seed**:

```bash
npm start
```

## Lợi ích của thay đổi

### ✅ Ưu điểm

1. **Dễ đọc hơn**
   - `roleName: "ADMIN"` rõ ràng hơn `roleId: "uuid-string"`
   - Không cần join để biết role name

2. **Đơn giản hơn**
   - Ít cột hơn (không cần cả id và name)
   - Composite key tự nhiên cho role_permissions

3. **Performance**
   - Giảm số lượng join trong một số trường hợp
   - Index trên STRING nhỏ hơn UUID

4. **Developer Experience**
   - Dễ debug (nhìn thấy "ADMIN" thay vì UUID)
   - Dễ test (so sánh string thay vì UUID)

### ⚠️ Nhược điểm

1. **Không thể đổi tên role/permission**
   - Name là primary key nên không thể update
   - Nếu cần đổi tên, phải tạo mới và migrate data

2. **String comparison**
   - So sánh string chậm hơn UUID một chút
   - Nhưng với số lượng role/permission ít thì không đáng kể

3. **Case sensitivity**
   - Cần cẩn thận với case ("ADMIN" ≠ "admin")
   - MySQL mặc định case-insensitive, nhưng nên consistent

## Testing

### Test 1: Đăng ký user mới

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "Test User",
    "password": "password123",
    "dateOfBirth": "2000-01-01"
  }'

# Expected response:
# {
#   "code": 1000,
#   "result": {
#     "user": {
#       "roleName": "USER",  ✅
#       "role": {
#         "name": "USER",    ✅
#         "description": "..."
#       }
#     }
#   }
# }
```

### Test 2: Lấy thông tin user

```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer <token>"

# Expected response:
# {
#   "code": 1000,
#   "result": {
#     "roleName": "USER",  ✅
#     "role": {
#       "name": "USER",    ✅
#       "description": "..."
#     }
#   }
# }
```

## Tóm tắt

✅ **Đã hoàn thành**:

- Cập nhật 3 schema: Role, Permission, RolePermission
- Sử dụng `name` làm primary key
- Composite primary key cho RolePermission
- Cập nhật tất cả foreign keys
- Cập nhật seed file
- Cập nhật tất cả services và middlewares
- Cập nhật API responses
- Cập nhật JWT token payload

✅ **Breaking Changes**:

- `roleId` → `roleName` trong User model
- `role.id` không còn tồn tại trong responses
- JWT token payload thay đổi
- Database schema hoàn toàn khác

⚠️ **Lưu ý**:

- Cần drop và recreate database
- Cần chạy lại seed
- API responses đã thay đổi (client cần update)
