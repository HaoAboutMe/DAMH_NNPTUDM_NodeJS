# Authentication Implementation Summary

## Tổng quan

Đã hoàn thành implementation cho chức năng Authentication (Đăng ký user) theo yêu cầu trong `rule.md`.

## Các file đã tạo/chỉnh sửa

### 1. Files mới tạo:

#### Controllers

- **`/controllers/authController.js`**
  - `registerController`: Xử lý đăng ký user mới
  - `loginController`: Xử lý đăng nhập
  - Validation đầu vào (email format, password length, required fields)
  - Sử dụng response format chuẩn theo rule.md

#### Routes

- **`/routes/auth.js`**
  - `POST /auth/register`: Endpoint đăng ký
  - `POST /auth/login`: Endpoint đăng nhập

#### Utils

- **`/utils/response.js`**
  - `successResponse()`: Trả về response thành công (code: 1000)
  - `errorResponse()`: Trả về response lỗi (code: 9999)
  - Tuân thủ 100% API Response format trong rule.md

- **`/utils/jwt.js`**
  - `generateToken()`: Tạo JWT token
  - `verifyToken()`: Verify JWT token
  - Sử dụng JWT_SECRET từ .env

- **`/utils/authService.js`**
  - `register()`: Business logic đăng ký user
  - `login()`: Business logic đăng nhập
  - Hash password với bcrypt
  - Tự động gán role USER cho user mới
  - Tạo JWT token sau khi đăng ký/đăng nhập thành công

#### Documentation

- **`/AUTH_API.md`**
  - Tài liệu chi tiết về API Authentication
  - Request/Response examples
  - Testing instructions

### 2. Files đã chỉnh sửa:

#### `/app.js`

- Import `authRouter`
- Thêm route `/auth` vào Express app

#### `/schemas/seed.js`

- Thêm tạo role `USER` (mặc định cho user đăng ký)
- Role `ADMIN` vẫn được giữ nguyên

#### `/package.json`

- Thêm dependency `jsonwebtoken: ^9.0.2`

## Tính năng đã implement

### ✅ Đăng ký User (POST /auth/register)

- Nhận thông tin: email, username, password, firstname, lastname, dateOfBirth
- Validation:
  - Email phải hợp lệ
  - Password tối thiểu 6 ký tự
  - Email, username, password, dateOfBirth là bắt buộc
- Kiểm tra email đã tồn tại
- Hash password với bcrypt (10 rounds)
- **Tự động gán role USER** cho user mới
- Trả về thông tin user (không bao gồm password) và JWT token
- Response format đúng chuẩn rule.md

### ✅ Đăng nhập (POST /auth/login)

- Nhận email và password
- Validate credentials
- So sánh password với bcrypt
- Trả về user info (bao gồm role) và JWT token
- Response format đúng chuẩn rule.md

### ✅ JWT Token

- Payload chứa: userId, email, roleId
- Expires: 24h (mặc định, có thể config qua .env)
- Secret key từ .env (JWT_SECRET)

## Tuân thủ Rule.md

### ✅ API Response Format

```json
{
  "code": 1000,
  "message": "",
  "result": {}
}
```

- code = 1000: Thành công
- code = 9999: Lỗi
- message: Chỉ hiện khi có lỗi

### ✅ Authentication & Authorization

- Sử dụng JWT
- Token format: `Authorization: Bearer <token>`
- Token payload chứa userId, roleId, email

### ✅ Design Pattern

- User -> Role (1-1)
- User mới mặc định có role USER
- Không hardcode quyền trong controller

### ✅ Cấu trúc thư mục

- `/routes`: Chỉ định nghĩa route
- `/controllers`: Xử lý request/response
- `/utils`: Business logic (authService), helpers (jwt, response)
- `/schemas`: Database models

### ✅ Quy ước code

- Sử dụng async/await
- Try/catch để bắt lỗi
- Lỗi trả về đúng API Response format
- Không hardcode secret key (dùng process.env)

## Roles trong hệ thống

1. **ADMIN**: Quản trị hệ thống (tạo qua seed)
   - Email: haoaboutme@gmail.com
   - Password: admin

2. **USER**: Người dùng thông thường
   - **Mặc định cho user đăng ký mới**
   - Được tạo tự động trong seed.js

## Cách sử dụng

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy server

```bash
npm start
```

### 3. Test API

#### Đăng ký user mới:

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

#### Đăng nhập:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Environment Variables cần thiết

Trong file `.env`:

```
JWT_SECRET=a20d5975b67b1d53ef3004df85f6604a8282188ffbadf2a725705ce949a2d472
JWT_EXPIRES_IN=24h
```

## Next Steps (Gợi ý cho tương lai)

1. **Middleware Authentication**
   - Tạo middleware để verify JWT token
   - Gắn user info vào req.user

2. **Middleware Authorization**
   - Kiểm tra permissions của user
   - Restrict access theo role

3. **User Profile APIs**
   - GET /users/profile: Lấy thông tin cá nhân
   - PUT /users/profile: Cập nhật thông tin cá nhân

4. **Refresh Token** (optional)
   - Implement refresh token mechanism
   - Tăng security

5. **Password Reset** (optional)
   - Forgot password
   - Reset password với email verification

## Lưu ý

- ✅ User mới đăng ký **TỰ ĐỘNG có role USER**
- ✅ Password được hash trước khi lưu vào database
- ✅ Token được tạo tự động sau đăng ký/đăng nhập
- ✅ Response format tuân thủ 100% rule.md
- ✅ Không có business logic trong routes
- ✅ Không hardcode secret keys
