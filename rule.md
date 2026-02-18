AI PROJECT RULE – PC BUILD CHECKER (NodeJS)

1. Tổng quan dự án

Dự án: Website Build PC Checker

Mục tiêu: Quản lý người dùng, xác thực, phân quyền; về sau mở rộng kiểm tra tương thích linh kiện PC

Backend: NodeJS + Express

Database: MySQL

Kiến trúc: RESTful API

Authentication: JWT (Access Token, có thể mở rộng Refresh Token)

2. Quy tắc bắt buộc khi sinh code

AI Agent khi sinh code PHẢI TUÂN THEO các quy tắc sau:

2.1 API Response format (BẮT BUỘC)

Mọi API trả về đúng cấu trúc sau, không được tự ý thay đổi:

**Success Response (với data):**

```json
{
  "code": 1000,
  "result": {}
}
```

**Success Response (chỉ có message):**

```json
{
  "code": 1000,
  "message": "Thông báo thành công"
}
```

**Error Response:**

```json
{
  "code": 1001,
  "message": "Mô tả lỗi"
}
```

Quy ước:

- **code = 1000**: Thành công
  - Nếu trả về data: có `code` và `result`
  - Nếu chỉ thông báo: có `code` và `message`
  - VD: Đổi mật khẩu thành công → `{ code: 1000, message: "..." }`
  - VD: Lấy thông tin user → `{ code: 1000, result: {...} }`

- **code khác 1000**: Lỗi
  - Response chỉ có `code` và `message`
  - Không có field `result`

**Error Codes:**

- 1000: Success
- 1001: Email đã được sử dụng
- 1002: Email không hợp lệ
- 1003: Mật khẩu quá ngắn
- 1004: Thiếu thông tin bắt buộc
- 1005: Thông tin đăng nhập không đúng
- 9999: Lỗi hệ thống (Internal Server Error)

Không được trả response raw kiểu:

```json
{ "data": ... }
{ "error": ... }
```

3. Quy ước Authentication & Authorization

Sử dụng JWT

Token được gửi qua header:

Authorization: Bearer <token>

Middleware xác thực:

Check token hợp lệ

Decode userId, role

Gắn user vào req.user

4. Design Pattern nghiệp vụ

Áp dụng mô hình:

User -> Role -> (Permission - optional)

Quy ước:

User chỉ có 1 Role

Role có thể có nhiều Permission (có thể chưa implement ngay)

Không hardcode quyền trong controller

5. Các chức năng hiện tại (KHÔNG TỰ Ý MỞ RỘNG)

Chỉ code các chức năng sau nếu không có yêu cầu thêm:

5.1 Authentication

Đăng ký

Đăng nhập

Đăng xuất (client-side token invalid / blacklist nếu có)

5.2 User

Lấy thông tin cá nhân (profile)

Cập nhật thông tin cá nhân

Không cho sửa role bằng API user thường

6. Cấu trúc thư mục (PHẢI TUÂN THEO)

Dựa trên project hiện tại:

/bin -> server start
/routes -> định nghĩa route
/schemas -> validate request / schema dữ liệu
/utils -> helper, response builder, jwt utils
app.js -> config express, middleware

Quy ước:

Route chỉ điều hướng, không chứa business logic

Logic xử lý nằm trong service hoặc utils

Không viết toàn bộ logic trong app.js

7. Quy ước code

Sử dụng async/await

Bắt lỗi bằng try/catch

Lỗi phải trả về đúng API Response format

Không console.log trong production code

Không hardcode secret key → dùng process.env

8. Nguyên tắc khi AI Agent hỗ trợ

AI Agent:

Không tự ý đổi kiến trúc

Không thêm framework lạ

Không rewrite toàn bộ project nếu không được yêu cầu

Ưu tiên code rõ ràng, dễ đọc, dễ maintain

Nếu thiếu thông tin → hỏi lại, không tự đoán

9. Mục tiêu dài hạn (chỉ để định hướng)

Mở rộng kiểm tra tương thích linh kiện PC

Tách module linh kiện: CPU, Mainboard, RAM, GPU, PSU…

Có thể thêm Permission sau, nhưng không ép buộc hiện tại
