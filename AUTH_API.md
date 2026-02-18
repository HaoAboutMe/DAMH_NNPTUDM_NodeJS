# Authentication API Documentation

## Tổng quan

API Authentication cho phép đăng ký và đăng nhập người dùng. Tất cả response đều tuân theo format chuẩn trong `rule.md`.

## API Response Format

### Success Response (code = 1000)

```json
{
  "code": 1000,
  "result": {}
}
```

### Error Response (code khác 1000)

```json
{
  "code": 1001,
  "message": "Mô tả lỗi"
}
```

## Error Codes

| Code | Mô tả                            |
| ---- | -------------------------------- |
| 1000 | Success                          |
| 1001 | Email đã được sử dụng            |
| 1002 | Email không hợp lệ               |
| 1003 | Mật khẩu phải có ít nhất 6 ký tự |
| 1004 | Thiếu thông tin bắt buộc         |
| 1005 | Email hoặc mật khẩu không đúng   |
| 9999 | Lỗi hệ thống                     |

## Endpoints

### 1. Đăng ký User

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "Nguyễn Văn A",
  "password": "password123",
  "firstname": "Văn A",
  "lastname": "Nguyễn",
  "dateOfBirth": "2000-01-01"
}
```

**Required Fields:**

- `email` (string): Email hợp lệ
- `username` (string): Tên người dùng
- `password` (string): Mật khẩu (tối thiểu 6 ký tự)
- `dateOfBirth` (string): Ngày sinh (format: YYYY-MM-DD)

**Optional Fields:**

- `firstname` (string): Tên
- `lastname` (string): Họ

**Success Response (201):**

```json
{
  "code": 1000,
  "result": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "username": "Nguyễn Văn A",
      "firstname": "Văn A",
      "lastname": "Nguyễn",
      "dateOfBirth": "2000-01-01",
      "roleId": "uuid-string"
    },
    "token": "jwt-token-string"
  }
}
```

**Error Response Examples:**

```json
// Code 1004 - Missing required fields
{
  "code": 1004,
  "message": "Email, username, password và ngày sinh là bắt buộc"
}

// Code 1002 - Invalid email format
{
  "code": 1002,
  "message": "Email không hợp lệ"
}

// Code 1003 - Password too short
{
  "code": 1003,
  "message": "Mật khẩu phải có ít nhất 6 ký tự"
}

// Code 1001 - Email already exists
{
  "code": 1001,
  "message": "Email đã được sử dụng"
}
```

**Notes:**

- User mới được tạo sẽ tự động có role `USER`
- Password được hash bằng bcrypt trước khi lưu
- Token JWT được tạo tự động sau khi đăng ký thành công

---

### 2. Đăng nhập

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Required Fields:**

- `email` (string): Email
- `password` (string): Mật khẩu

**Success Response (200):**

```json
{
  "code": 1000,
  "result": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "username": "Nguyễn Văn A",
      "firstname": "Văn A",
      "lastname": "Nguyễn",
      "dateOfBirth": "2000-01-01",
      "roleId": "uuid-string",
      "role": {
        "id": "uuid-string",
        "name": "USER",
        "description": "Người dùng thông thường"
      }
    },
    "token": "jwt-token-string"
  }
}
```

**Error Response Examples:**

```json
// Code 1004 - Missing required fields
{
  "code": 1004,
  "message": "Email và password là bắt buộc"
}

// Code 1005 - Invalid credentials
{
  "code": 1005,
  "message": "Email hoặc mật khẩu không đúng"
}
```

**Notes:**

- Token JWT được trả về sau khi đăng nhập thành công
- Token chứa thông tin: `userId`, `email`, `roleId`
- Token có thời gian hết hạn (mặc định 24h)

---

## Sử dụng JWT Token

Sau khi đăng ký hoặc đăng nhập thành công, client nhận được JWT token. Token này cần được gửi kèm trong header của các request tiếp theo:

```
Authorization: Bearer <token>
```

**Token Payload:**

```json
{
  "userId": "uuid-string",
  "email": "user@example.com",
  "roleId": "uuid-string",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## Testing với cURL

### Đăng ký:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "Test User",
    "password": "password123",
    "dateOfBirth": "2000-01-01"
  }'
```

### Đăng nhập:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Cấu trúc File

```
/controllers
  └── authController.js      # Controller xử lý request
/routes
  └── auth.js                # Định nghĩa routes
/utils
  ├── authService.js         # Business logic
  ├── jwt.js                 # JWT utilities
  └── response.js            # Response builder
/schemas
  ├── user.schema.js         # User model
  ├── role.schema.js         # Role model
  └── seed.js                # Database seeding
```

---

## Environment Variables

Cần thiết lập trong file `.env`:

```
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

---

## Roles

Hệ thống có 2 roles mặc định:

1. **ADMIN**: Quản trị hệ thống (được tạo qua seed)
2. **USER**: Người dùng thông thường (mặc định cho user đăng ký)

User đăng ký mới sẽ tự động được gán role `USER`.
