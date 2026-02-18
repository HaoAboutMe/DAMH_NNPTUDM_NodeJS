# Cập nhật Error Handling System

## Tổng quan thay đổi

Đã cập nhật hệ thống error handling theo yêu cầu mới:

- **Mỗi lỗi có error code riêng** (1001, 1002, 1003, ...) thay vì dùng chung 9999
- **Response format mới**:
  - Success: chỉ có `code` và `result` (không có `message`)
  - Error: chỉ có `code` và `message` (không có `result`)

## Files đã cập nhật

### 1. `/utils/errorCodes.js` (MỚI)

**Mục đích**: Định nghĩa tất cả error codes và messages

```javascript
const ErrorCodes = {
  SUCCESS: 1000,
  EMAIL_ALREADY_EXISTS: 1001,
  INVALID_EMAIL_FORMAT: 1002,
  PASSWORD_TOO_SHORT: 1003,
  MISSING_REQUIRED_FIELDS: 1004,
  INVALID_CREDENTIALS: 1005,
  // ... more codes
  INTERNAL_SERVER_ERROR: 9999,
};
```

**Error Codes hiện tại**:

- `1000`: Success
- `1001`: Email đã được sử dụng
- `1002`: Email không hợp lệ
- `1003`: Mật khẩu phải có ít nhất 6 ký tự
- `1004`: Thiếu thông tin bắt buộc
- `1005`: Email hoặc mật khẩu không đúng
- `9999`: Lỗi hệ thống

### 2. `/utils/response.js`

**Thay đổi**:

**Success Response** (trước):

```javascript
{
  code: 1000,
  message: "",  // ❌ Đã xóa
  result: {}
}
```

**Success Response** (sau):

```javascript
{
  code: 1000,
  result: {}    // ✅ Chỉ có code và result
}
```

**Error Response** (trước):

```javascript
{
  code: 9999,
  message: "...",
  result: {}    // ❌ Đã xóa
}
```

**Error Response** (sau):

```javascript
{
  code: 1001,   // ✅ Error code cụ thể
  message: "..." // ✅ Chỉ có code và message
}
```

### 3. `/utils/authService.js`

**Thay đổi**:

- Thêm class `AppError` để throw error với error code cụ thể
- Cập nhật các error throws:

```javascript
// Trước
throw new Error("Email đã được sử dụng");

// Sau
throw new AppError(
  "Email đã được sử dụng",
  ErrorCodes.EMAIL_ALREADY_EXISTS, // 1001
);
```

### 4. `/controllers/authController.js`

**Thay đổi**:

- Import `ErrorCodes`
- Sử dụng error codes cụ thể cho từng validation:

```javascript
// Email không hợp lệ
errorResponse(res, "Email không hợp lệ", ErrorCodes.INVALID_EMAIL_FORMAT, 400);
// Code: 1002

// Password quá ngắn
errorResponse(
  res,
  "Mật khẩu phải có ít nhất 6 ký tự",
  ErrorCodes.PASSWORD_TOO_SHORT,
  400,
);
// Code: 1003

// Thiếu thông tin
errorResponse(
  res,
  "Email, username, password và ngày sinh là bắt buộc",
  ErrorCodes.MISSING_REQUIRED_FIELDS,
  400,
);
// Code: 1004
```

- Xử lý AppError trong catch block:

```javascript
catch (error) {
  // Nếu là AppError, sử dụng error code từ error
  if (error.code) {
    return errorResponse(res, error.message, error.code, 400);
  }
  // Lỗi không xác định
  return errorResponse(res, error.message || "Lỗi hệ thống", ErrorCodes.INTERNAL_SERVER_ERROR, 500);
}
```

### 5. `/rule.md`

**Cập nhật**: Thêm error codes vào quy tắc API Response format

### 6. `/AUTH_API.md`

**Cập nhật**:

- Response format examples
- Error codes table
- Ví dụ cho từng loại error

## Response Examples

### ✅ Success - Đăng ký thành công

```json
{
  "code": 1000,
  "result": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      ...
    },
    "token": "jwt-token"
  }
}
```

### ❌ Error - Email đã tồn tại (1001)

```json
{
  "code": 1001,
  "message": "Email đã được sử dụng"
}
```

### ❌ Error - Email không hợp lệ (1002)

```json
{
  "code": 1002,
  "message": "Email không hợp lệ"
}
```

### ❌ Error - Password quá ngắn (1003)

```json
{
  "code": 1003,
  "message": "Mật khẩu phải có ít nhất 6 ký tự"
}
```

### ❌ Error - Thiếu thông tin (1004)

```json
{
  "code": 1004,
  "message": "Email, username, password và ngày sinh là bắt buộc"
}
```

### ❌ Error - Sai thông tin đăng nhập (1005)

```json
{
  "code": 1005,
  "message": "Email hoặc mật khẩu không đúng"
}
```

### ❌ Error - Lỗi hệ thống (9999)

```json
{
  "code": 9999,
  "message": "Lỗi hệ thống"
}
```

## Cách thêm Error Code mới

### Bước 1: Thêm vào `/utils/errorCodes.js`

```javascript
const ErrorCodes = {
  // ... existing codes
  NEW_ERROR_CODE: 1006, // Số tiếp theo
};

const ErrorMessages = {
  // ... existing messages
  [ErrorCodes.NEW_ERROR_CODE]: "Mô tả lỗi mới",
};
```

### Bước 2: Sử dụng trong Service

```javascript
throw new AppError("Mô tả lỗi mới", ErrorCodes.NEW_ERROR_CODE);
```

### Bước 3: Hoặc sử dụng trực tiếp trong Controller

```javascript
return errorResponse(res, "Mô tả lỗi mới", ErrorCodes.NEW_ERROR_CODE, 400);
```

## Lợi ích của hệ thống mới

1. **Dễ debug**: Client biết chính xác lỗi gì xảy ra qua error code
2. **Dễ maintain**: Tất cả error codes tập trung ở một file
3. **Consistent**: Response format nhất quán
4. **Scalable**: Dễ dàng thêm error codes mới
5. **Clean**: Success response không có field thừa, error response không có field thừa

## Testing

### Test Success Response

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "Test User",
    "password": "password123",
    "dateOfBirth": "2000-01-01"
  }'

# Response:
# {
#   "code": 1000,
#   "result": { "user": {...}, "token": "..." }
# }
```

### Test Error 1001 - Email đã tồn tại

```bash
# Đăng ký lại cùng email
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "Test User 2",
    "password": "password123",
    "dateOfBirth": "2000-01-01"
  }'

# Response:
# {
#   "code": 1001,
#   "message": "Email đã được sử dụng"
# }
```

### Test Error 1002 - Email không hợp lệ

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "username": "Test User",
    "password": "password123",
    "dateOfBirth": "2000-01-01"
  }'

# Response:
# {
#   "code": 1002,
#   "message": "Email không hợp lệ"
# }
```

### Test Error 1003 - Password quá ngắn

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "username": "Test User",
    "password": "123",
    "dateOfBirth": "2000-01-01"
  }'

# Response:
# {
#   "code": 1003,
#   "message": "Mật khẩu phải có ít nhất 6 ký tự"
# }
```

### Test Error 1004 - Thiếu thông tin

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Response:
# {
#   "code": 1004,
#   "message": "Email, username, password và ngày sinh là bắt buộc"
# }
```

### Test Error 1005 - Sai thông tin đăng nhập

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }'

# Response:
# {
#   "code": 1005,
#   "message": "Email hoặc mật khẩu không đúng"
# }
```

## Tóm tắt

✅ **Đã hoàn thành**:

- Tạo hệ thống error codes với mã cụ thể cho từng lỗi
- Cập nhật response format (success không có message, error không có result)
- Cập nhật tất cả controllers và services
- Cập nhật documentation (rule.md, AUTH_API.md)
- Tạo class AppError để throw error với code

✅ **Tuân thủ yêu cầu**:

- Không phải lỗi nào cũng là 9999
- Mỗi lỗi có code riêng: 1001, 1002, 1003, ...
- Success response: `{ code: 1000, result: {...} }`
- Error response: `{ code: 1001, message: "..." }`
