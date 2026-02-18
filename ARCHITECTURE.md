# Authentication Flow Architecture

## 1. Đăng ký User (Register Flow)

```
Client
  │
  │ POST /auth/register
  │ Body: { email, username, password, dateOfBirth, ... }
  │
  ▼
┌─────────────────────────────────────────────────────┐
│  routes/auth.js                                     │
│  - Nhận request                                     │
│  - Chuyển đến registerController                    │
└─────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────┐
│  controllers/authController.js                      │
│  - Validate input (email format, password length)   │
│  - Kiểm tra required fields                         │
│  - Gọi authService.register()                       │
└─────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────┐
│  utils/authService.js                               │
│  1. Kiểm tra email đã tồn tại                       │
│  2. Tìm/tạo role USER                               │
│  3. Hash password với bcrypt                        │
│  4. Tạo user mới trong database                     │
│  5. Generate JWT token                              │
│  6. Trả về user (không có password) + token         │
└─────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────┐
│  utils/response.js                                  │
│  - Format response theo rule.md                     │
│  - { code: 1000, message: "", result: {...} }      │
└─────────────────────────────────────────────────────┘
  │
  ▼
Client nhận:
{
  "code": 1000,
  "message": "",
  "result": {
    "user": { id, email, username, ... },
    "token": "jwt-token-string"
  }
}
```

## 2. Đăng nhập (Login Flow)

```
Client
  │
  │ POST /auth/login
  │ Body: { email, password }
  │
  ▼
┌─────────────────────────────────────────────────────┐
│  routes/auth.js                                     │
│  - Nhận request                                     │
│  - Chuyển đến loginController                       │
└─────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────┐
│  controllers/authController.js                      │
│  - Validate input (email, password required)        │
│  - Gọi authService.login()                          │
└─────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────┐
│  utils/authService.js                               │
│  1. Tìm user theo email (include role)              │
│  2. Kiểm tra user tồn tại                           │
│  3. So sánh password với bcrypt.compare()           │
│  4. Generate JWT token                              │
│  5. Trả về user (không có password) + token         │
└─────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────┐
│  utils/response.js                                  │
│  - Format response theo rule.md                     │
│  - { code: 1000, message: "", result: {...} }      │
└─────────────────────────────────────────────────────┘
  │
  ▼
Client nhận:
{
  "code": 1000,
  "message": "",
  "result": {
    "user": {
      id, email, username, ...,
      role: { id, name, description }
    },
    "token": "jwt-token-string"
  }
}
```

## 3. Database Schema

```
┌─────────────────────────────────────────────────────┐
│  Table: roles                                       │
├─────────────────────────────────────────────────────┤
│  id (UUID, PK)                                      │
│  name (STRING, UNIQUE)                              │
│  description (STRING)                               │
└─────────────────────────────────────────────────────┘
  │
  │ 1
  │
  │ N
  ▼
┌─────────────────────────────────────────────────────┐
│  Table: users                                       │
├─────────────────────────────────────────────────────┤
│  id (UUID, PK)                                      │
│  email (STRING, UNIQUE)                             │
│  username (STRING)                                  │
│  firstname (STRING)                                 │
│  lastname (STRING)                                  │
│  password (STRING, HASHED)                          │
│  dateOfBirth (DATE)                                 │
│  roleId (UUID, FK -> roles.id)                      │
└─────────────────────────────────────────────────────┘
```

## 4. JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "userId": "uuid-string",
  "email": "user@example.com",
  "roleId": "uuid-string",
  "iat": 1234567890,
  "exp": 1234654290
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

## 5. File Structure

```
DoAn_NodeJS/
│
├── app.js                          # Express app config
│   └── app.use('/auth', authRouter)
│
├── routes/
│   └── auth.js                     # Route definitions
│       ├── POST /register
│       └── POST /login
│
├── controllers/
│   └── authController.js           # Request handlers
│       ├── registerController()
│       └── loginController()
│
├── utils/
│   ├── authService.js              # Business logic
│   │   ├── register()
│   │   └── login()
│   │
│   ├── jwt.js                      # JWT utilities
│   │   ├── generateToken()
│   │   └── verifyToken()
│   │
│   └── response.js                 # Response builder
│       ├── successResponse()
│       └── errorResponse()
│
├── schemas/
│   ├── user.schema.js              # User model
│   ├── role.schema.js              # Role model
│   └── seed.js                     # Database seeding
│       ├── Create ADMIN role
│       └── Create USER role
│
└── .env
    ├── JWT_SECRET
    └── JWT_EXPIRES_IN
```

## 6. Response Format (Theo rule.md)

### Success Response:

```json
{
  "code": 1000,
  "message": "",
  "result": {
    // Data here
  }
}
```

### Error Response:

```json
{
  "code": 9999,
  "message": "Mô tả lỗi cụ thể",
  "result": {}
}
```

## 7. Security Features

1. **Password Hashing**
   - Sử dụng bcrypt với 10 rounds
   - Password không bao giờ được lưu plain text
   - Password không được trả về trong response

2. **JWT Token**
   - Signed với secret key từ .env
   - Có thời gian hết hạn (24h mặc định)
   - Chứa thông tin cần thiết: userId, email, roleId

3. **Input Validation**
   - Email format validation
   - Password minimum length (6 chars)
   - Required fields checking
   - Email uniqueness check

4. **Role-Based Access**
   - User mới mặc định có role USER
   - Role được gán tự động, không cho phép user tự chọn
   - Chuẩn bị sẵn cho Authorization middleware

## 8. Error Handling

Tất cả errors được catch và format theo chuẩn:

```javascript
try {
  // Business logic
} catch (error) {
  return errorResponse(res, error.message, 9999, statusCode);
}
```

Response lỗi luôn có format:

```json
{
  "code": 9999,
  "message": "Mô tả lỗi",
  "result": {}
}
```
