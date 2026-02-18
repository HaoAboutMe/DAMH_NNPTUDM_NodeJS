# User API Implementation Summary

## Tổng quan

Đã hoàn thành implementation cho 2 API endpoints:

1. **GET /users/me** - Lấy thông tin user hiện tại
2. **POST /users/change-password** - Đổi mật khẩu

## Files đã tạo

### 1. Middleware

**`/middlewares/auth.middleware.js`**

- `authenticateToken()`: Middleware xác thực JWT token
- Verify token từ Authorization header
- Tìm user từ database
- Gắn user info vào `req.user`
- Sử dụng cho tất cả protected routes

### 2. Service

**`/utils/userService.js`**

- `getUserProfile()`: Lấy thông tin user
  - Chỉ trả về thông tin cần thiết
  - Không trả về password
  - Include role information
- `changePassword()`: Đổi mật khẩu
  - Verify mật khẩu hiện tại
  - Kiểm tra mật khẩu mới không trùng mật khẩu cũ
  - Hash mật khẩu mới trước khi lưu

### 3. Controller

**`/controllers/userController.js`**

- `getMeController()`: Controller cho GET /users/me
- `changePasswordController()`: Controller cho POST /users/change-password
- Validation input
- Error handling với error codes cụ thể

### 4. Routes

**`/routes/users.js`** (Đã cập nhật)

- GET /users/me (protected)
- POST /users/change-password (protected)
- Sử dụng `authenticateToken` middleware

### 5. Documentation

**`/USER_API.md`**

- Tài liệu chi tiết về User API
- Request/Response examples
- Error codes
- Testing instructions

## Files đã cập nhật

### 1. Error Codes

**`/utils/errorCodes.js`**

- Thêm error codes mới:
  - `1006`: CURRENT_PASSWORD_INCORRECT
  - `1007`: NEW_PASSWORD_SAME_AS_OLD
  - `1100`: USER_NOT_FOUND
  - `1200`: UNAUTHORIZED
  - `1202`: INVALID_TOKEN

## API Endpoints

### 1. GET /users/me

**Purpose**: Lấy thông tin user hiện tại

**Authentication**: Required (JWT token)

**Response**:

```json
{
  "code": 1000,
  "result": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "Nguyễn Văn A",
    "firstname": "Văn A",
    "lastname": "Nguyễn",
    "dateOfBirth": "2000-01-01",
    "role": {
      "id": "uuid",
      "name": "USER",
      "description": "Người dùng thông thường"
    }
  }
}
```

**Thông tin KHÔNG trả về**:

- ❌ `password` (bảo mật)
- ❌ `roleId` (chỉ trả về object `role`)

**Thông tin trả về**:

- ✅ `id`, `email`, `username`
- ✅ `firstname`, `lastname`, `dateOfBirth`
- ✅ `role` (object với id, name, description)

### 2. POST /users/change-password

**Purpose**: Đổi mật khẩu

**Authentication**: Required (JWT token)

**Request Body**:

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

**Validation**:

- ✅ Mật khẩu hiện tại phải đúng
- ✅ Mật khẩu mới phải >= 6 ký tự
- ✅ Mật khẩu mới không được trùng mật khẩu cũ

**Response**:

```json
{
  "code": 1000,
  "result": {
    "message": "Đổi mật khẩu thành công"
  }
}
```

## Authentication Flow

```
Client Request
  │
  │ Header: Authorization: Bearer <token>
  │
  ▼
┌─────────────────────────────────────────┐
│  Middleware: authenticateToken          │
│  1. Lấy token từ header                 │
│  2. Verify token với JWT_SECRET         │
│  3. Tìm user từ database                │
│  4. Gắn user vào req.user               │
└─────────────────────────────────────────┘
  │
  │ req.user = { id, email, username, ... }
  │
  ▼
┌─────────────────────────────────────────┐
│  Controller                             │
│  - Sử dụng req.user.id                  │
│  - Gọi service                          │
└─────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────┐
│  Service                                │
│  - Business logic                       │
│  - Database operations                  │
└─────────────────────────────────────────┘
  │
  ▼
Response to Client
```

## Error Handling

### Authentication Errors

**1200 - UNAUTHORIZED** (Thiếu token)

```json
{
  "code": 1200,
  "message": "Token không được cung cấp"
}
```

**1202 - INVALID_TOKEN** (Token không hợp lệ)

```json
{
  "code": 1202,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

**1100 - USER_NOT_FOUND** (User không tồn tại)

```json
{
  "code": 1100,
  "message": "Không tìm thấy người dùng"
}
```

### Change Password Errors

**1004 - MISSING_REQUIRED_FIELDS**

```json
{
  "code": 1004,
  "message": "Mật khẩu hiện tại và mật khẩu mới là bắt buộc"
}
```

**1003 - PASSWORD_TOO_SHORT**

```json
{
  "code": 1003,
  "message": "Mật khẩu mới phải có ít nhất 6 ký tự"
}
```

**1006 - CURRENT_PASSWORD_INCORRECT**

```json
{
  "code": 1006,
  "message": "Mật khẩu hiện tại không đúng"
}
```

**1007 - NEW_PASSWORD_SAME_AS_OLD**

```json
{
  "code": 1007,
  "message": "Mật khẩu mới không được trùng với mật khẩu cũ"
}
```

## Security Features

### 1. Token-Based Authentication

- Tất cả endpoints đều yêu cầu valid JWT token
- Token được verify ở middleware level
- Token hết hạn hoặc không hợp lệ sẽ bị reject ngay

### 2. Password Security

- Password hiện tại được verify với bcrypt
- Password mới được hash với bcrypt (10 rounds)
- Password không bao giờ được trả về trong response

### 3. Data Privacy

- API `/me` chỉ trả về thông tin cần thiết
- Không trả về sensitive data (password, internal IDs)
- User chỉ có thể xem/sửa thông tin của chính mình

### 4. Validation

- Input validation ở controller level
- Business logic validation ở service level
- Error messages rõ ràng với error codes cụ thể

## Testing Guide

### Setup: Lấy Token

```bash
# 1. Đăng ký hoặc đăng nhập để lấy token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Lưu token từ response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Test 1: GET /users/me

```bash
# Success case
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer $TOKEN"

# Expected: 200 OK
# {
#   "code": 1000,
#   "result": {
#     "id": "...",
#     "email": "test@example.com",
#     ...
#   }
# }

# Error case - No token
curl -X GET http://localhost:3000/users/me

# Expected: 401 Unauthorized
# {
#   "code": 1200,
#   "message": "Token không được cung cấp"
# }

# Error case - Invalid token
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer invalid-token"

# Expected: 401 Unauthorized
# {
#   "code": 1202,
#   "message": "Token không hợp lệ hoặc đã hết hạn"
# }
```

### Test 2: POST /users/change-password

```bash
# Success case
curl -X POST http://localhost:3000/users/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'

# Expected: 200 OK
# {
#   "code": 1000,
#   "result": {
#     "message": "Đổi mật khẩu thành công"
#   }
# }

# Error case - Wrong current password
curl -X POST http://localhost:3000/users/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "wrongpassword",
    "newPassword": "newpassword456"
  }'

# Expected: 400 Bad Request
# {
#   "code": 1006,
#   "message": "Mật khẩu hiện tại không đúng"
# }

# Error case - New password same as old
curl -X POST http://localhost:3000/users/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "password123"
  }'

# Expected: 400 Bad Request
# {
#   "code": 1007,
#   "message": "Mật khẩu mới không được trùng với mật khẩu cũ"
# }

# Error case - Password too short
curl -X POST http://localhost:3000/users/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "123"
  }'

# Expected: 400 Bad Request
# {
#   "code": 1003,
#   "message": "Mật khẩu mới phải có ít nhất 6 ký tự"
# }
```

## Tuân thủ Rule.md

✅ **API Response Format**

- Success: `{ code: 1000, result: {...} }`
- Error: `{ code: xxxx, message: "..." }`

✅ **Authentication**

- Sử dụng JWT
- Token qua header: `Authorization: Bearer <token>`
- Middleware verify token và gắn user vào req.user

✅ **Cấu trúc thư mục**

- Routes: Chỉ định nghĩa route
- Controllers: Xử lý request/response
- Services: Business logic
- Middlewares: Authentication, validation

✅ **Quy ước code**

- async/await
- try/catch error handling
- Error codes cụ thể
- Không hardcode secrets

✅ **Security**

- Password được hash
- Token được verify
- Chỉ trả về thông tin cần thiết
- User chỉ truy cập được data của mình

## Next Steps (Gợi ý)

1. **Update Profile API**
   - PUT /users/me
   - Cho phép user cập nhật firstname, lastname, dateOfBirth
   - Không cho phép sửa email, role

2. **Logout API** (Optional)
   - POST /auth/logout
   - Blacklist token (cần Redis hoặc database)

3. **Refresh Token** (Optional)
   - POST /auth/refresh
   - Tạo access token mới từ refresh token

4. **Admin APIs**
   - GET /admin/users (list all users)
   - PUT /admin/users/:id/role (change user role)
   - Chỉ cho phép ADMIN role

## Tóm tắt

✅ **Đã hoàn thành**:

- Authentication middleware với JWT verification
- GET /users/me - Lấy thông tin user (chỉ thông tin cần thiết)
- POST /users/change-password - Đổi mật khẩu với validation đầy đủ
- Error codes cụ thể cho từng trường hợp
- Documentation đầy đủ
- Testing guide

✅ **Đặc điểm nổi bật**:

- API `/me` không trả về password, roleId
- Change password verify mật khẩu cũ trước khi đổi
- Mật khẩu mới không được trùng mật khẩu cũ
- Tất cả endpoints đều protected với JWT
- Error handling với error codes cụ thể
