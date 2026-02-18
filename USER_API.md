# User API Documentation

## Tổng quan

API User cho phép người dùng xem thông tin cá nhân và đổi mật khẩu. Tất cả endpoints đều yêu cầu authentication.

## Authentication Required

Tất cả API trong phần này yêu cầu JWT token trong header:

```
Authorization: Bearer <token>
```

## Error Codes

| Code | Mô tả                                         |
| ---- | --------------------------------------------- |
| 1000 | Success                                       |
| 1003 | Mật khẩu phải có ít nhất 6 ký tự              |
| 1004 | Thiếu thông tin bắt buộc                      |
| 1006 | Mật khẩu hiện tại không đúng                  |
| 1007 | Mật khẩu mới không được trùng với mật khẩu cũ |
| 1100 | Không tìm thấy người dùng                     |
| 1200 | Chưa xác thực (thiếu token)                   |
| 1202 | Token không hợp lệ hoặc đã hết hạn            |
| 9999 | Lỗi hệ thống                                  |

## Endpoints

### 1. Lấy thông tin user hiện tại (Me)

**Endpoint:** `GET /users/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "code": 1000,
  "result": {
    "id": "uuid-string",
    "email": "user@example.com",
    "username": "Nguyễn Văn A",
    "firstname": "Văn A",
    "lastname": "Nguyễn",
    "dateOfBirth": "2000-01-01",
    "role": {
      "id": "uuid-string",
      "name": "USER",
      "description": "Người dùng thông thường"
    }
  }
}
```

**Error Response Examples:**

```json
// Code 1200 - Thiếu token
{
  "code": 1200,
  "message": "Token không được cung cấp"
}

// Code 1202 - Token không hợp lệ
{
  "code": 1202,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}

// Code 1100 - User không tồn tại
{
  "code": 1100,
  "message": "Không tìm thấy người dùng"
}
```

**Notes:**

- API chỉ trả về thông tin cần thiết cho người dùng
- **Không trả về** `password`, `roleId` (chỉ trả về object `role`)
- Thông tin được lấy từ JWT token đã được xác thực

---

### 2. Đổi mật khẩu

**Endpoint:** `POST /users/change-password`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Required Fields:**

- `currentPassword` (string): Mật khẩu hiện tại
- `newPassword` (string): Mật khẩu mới (tối thiểu 6 ký tự)

**Success Response (200):**

```json
{
  "code": 1000,
  "message": "Đổi mật khẩu thành công"
}
```

**Error Response Examples:**

```json
// Code 1004 - Thiếu thông tin
{
  "code": 1004,
  "message": "Mật khẩu hiện tại và mật khẩu mới là bắt buộc"
}

// Code 1003 - Password quá ngắn
{
  "code": 1003,
  "message": "Mật khẩu mới phải có ít nhất 6 ký tự"
}

// Code 1006 - Mật khẩu hiện tại sai
{
  "code": 1006,
  "message": "Mật khẩu hiện tại không đúng"
}

// Code 1007 - Mật khẩu mới trùng mật khẩu cũ
{
  "code": 1007,
  "message": "Mật khẩu mới không được trùng với mật khẩu cũ"
}

// Code 1200 - Thiếu token
{
  "code": 1200,
  "message": "Token không được cung cấp"
}

// Code 1202 - Token không hợp lệ
{
  "code": 1202,
  "message": "Token không hợp lệ hoặc đã hết hạn"
}
```

**Validation Rules:**

- Mật khẩu mới phải có ít nhất 6 ký tự
- Mật khẩu hiện tại phải đúng
- Mật khẩu mới không được trùng với mật khẩu cũ
- Mật khẩu mới được hash bằng bcrypt trước khi lưu

**Notes:**

- Sau khi đổi mật khẩu thành công, token hiện tại vẫn còn hiệu lực
- User có thể tiếp tục sử dụng token cũ cho đến khi hết hạn
- Nếu muốn force logout, client nên xóa token sau khi đổi mật khẩu

---

## Testing với cURL

### 1. Lấy thông tin user (Me)

```bash
# Lấy token từ login trước
TOKEN="your-jwt-token-here"

curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Đổi mật khẩu

```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/users/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

---

## Complete Flow Example

### 1. Đăng ký user mới

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "Test User",
    "password": "password123",
    "dateOfBirth": "2000-01-01"
  }'

# Response: { "code": 1000, "result": { "user": {...}, "token": "..." } }
# Lưu token để sử dụng
```

### 2. Lấy thông tin user

```bash
TOKEN="token-from-step-1"

curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer $TOKEN"

# Response: { "code": 1000, "result": { "id": "...", "email": "...", ... } }
```

### 3. Đổi mật khẩu

```bash
curl -X POST http://localhost:3000/users/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'

# Response: { "code": 1000, "message": "Đổi mật khẩu thành công" }
```

### 4. Đăng nhập với mật khẩu mới

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "newpassword456"
  }'

# Response: { "code": 1000, "result": { "user": {...}, "token": "new-token" } }
```

---

## Cấu trúc File

```
/controllers
  └── userController.js         # Controller xử lý request
/routes
  └── users.js                  # Định nghĩa routes
/middlewares
  └── auth.middleware.js        # Authentication middleware
/utils
  └── userService.js            # Business logic
```

---

## Security Notes

1. **Token Required**: Tất cả endpoints đều yêu cầu valid JWT token
2. **Password Validation**:
   - Mật khẩu hiện tại được verify trước khi cho phép đổi
   - Mật khẩu mới không được trùng mật khẩu cũ
   - Mật khẩu mới được hash trước khi lưu
3. **User Info Protection**:
   - API `/me` chỉ trả về thông tin cần thiết
   - Password không bao giờ được trả về trong response
   - roleId không được trả về (chỉ trả về object role)
4. **Token Verification**:
   - Token được verify ở middleware trước khi vào controller
   - Token hết hạn sẽ bị reject
   - Token không hợp lệ sẽ bị reject

---

## Response Format Summary

### Success Response (with data)

```json
{
  "code": 1000,
  "result": { ... }
}
```

### Success Response (with message only)

```json
{
  "code": 1000,
  "message": "Thông báo thành công"
}
```

### Error Response

```json
{
  "code": 1006,
  "message": "Mô tả lỗi"
}
```

**Lưu ý:**

- Success response có thể có `result` (data) hoặc `message` (thông báo)
- Error response chỉ có `code` và `message`
