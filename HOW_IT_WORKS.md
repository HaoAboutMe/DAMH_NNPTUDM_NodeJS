# 🚀 Cách Hoạt Động Của Dự Án Node.js Này

> Tài liệu này dành cho người **lần đầu học Node.js**, giải thích từng bước từ khi khởi động server đến khi xử lý một request từ client.

---

## 📁 Cấu Trúc Thư Mục

```
DoAn_NodeJS/
│
├── bin/
│   └── www                  ← ① ĐIỂM KHỞI ĐỘNG - file chạy đầu tiên
│
├── app.js                   ← ② CẤU HÌNH ỨNG DỤNG - thiết lập Express
│
├── .env                     ← Biến môi trường (DB, JWT secret, port...)
├── package.json             ← Danh sách thư viện và script chạy
│
├── schemas/                 ← Định nghĩa bảng trong Database
│   ├── index.js             ← Kết nối DB + gộp tất cả model
│   ├── user.schema.js       ← Bảng users
│   ├── role.schema.js       ← Bảng roles
│   ├── permission.schema.js ← Bảng permissions
│   └── seed.js              ← Tạo dữ liệu mẫu ban đầu
│
├── routes/                  ← Định nghĩa URL nào gọi hàm nào
│   ├── index.js             ← Route "/"
│   ├── auth.js              ← Route "/auth/..."
│   └── users.js             ← Route "/users/..."
│
├── middlewares/             ← Bộ lọc trung gian (chạy trước controller)
│   └── auth.middleware.js   ← Kiểm tra JWT token
│
├── controllers/             ← Nhận request, trả response
│   ├── authController.js    ← Xử lý đăng ký, đăng nhập
│   └── userController.js    ← Xử lý thông tin user
│
├── services/                ← Logic nghiệp vụ chính
│   ├── authService.js       ← Logic đăng ký, đăng nhập
│   └── userService.js       ← Logic lấy profile, đổi mật khẩu
│
└── utils/                   ← Công cụ dùng chung
    ├── jwt.js               ← Tạo và kiểm tra JWT token
    ├── response.js          ← Format JSON trả về
    └── errorCodes.js        ← Danh sách mã lỗi
```

---

## ① Bước 1: Khởi Động Server — `bin/www`

Khi bạn chạy lệnh `npm start`, Node.js sẽ chạy file **`bin/www`** đầu tiên.

```
npm start  →  nodemon ./bin/www
```

File này làm 3 việc:

1. **Import `app.js`** để lấy cấu hình ứng dụng
2. **Tạo HTTP server** từ app đó
3. **Lắng nghe** trên cổng (mặc định: `3000`)

```
Client (Postman/Browser)
        ↓
   PORT 3000
        ↓
   bin/www  →  tạo HTTP server  →  chuyển cho app.js xử lý
```

> 💡 **Tương tự như**: Mở cửa hàng lúc 8 giờ sáng — `bin/www` là người mở cửa.

---

## ② Bước 2: Cấu Hình Ứng Dụng — `app.js`

`app.js` là **trung tâm điều phối** của toàn bộ ứng dụng. Nó chạy ngay khi `bin/www` import nó.

### Những việc `app.js` làm theo thứ tự:

```javascript
// 1. Đọc biến môi trường từ file .env
require("dotenv").config();

// 2. Tạo ứng dụng Express
var app = express();

// 3. Kết nối Database và đồng bộ bảng
sequelize.authenticate().then(async () => {
  await Permission.sync({ alter: true }); // Tạo/cập nhật bảng permissions
  await Role.sync({ alter: true }); // Tạo/cập nhật bảng roles
  await RolePermission.sync({ alter: true });
  await User.sync({ alter: true }); // Tạo/cập nhật bảng users
  await seed(); // Tạo dữ liệu mẫu nếu chưa có
});

// 4. Đăng ký Middleware toàn cục
app.use(express.json()); // Cho phép đọc JSON từ request body
app.use(cookieParser()); // Đọc cookie

// 5. Đăng ký Routes (URL mapping)
app.use("/", indexRouter); // Tất cả URL bắt đầu bằng "/"
app.use("/users", usersRouter); // Tất cả URL bắt đầu bằng "/users"
app.use("/auth", authRouter); // Tất cả URL bắt đầu bằng "/auth"
```

> 💡 **Tương tự như**: Bản đồ của cửa hàng — chỉ đường cho khách hàng đến đúng quầy.

---

## ③ Bước 3: Database — `schemas/`

Trước khi server nhận request, nó cần biết **cấu trúc dữ liệu** trong MySQL.

### `schemas/index.js` — Kết nối Database

```javascript
// Kết nối MySQL bằng thông tin từ .env
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
});

// Nạp các model (bảng)
const User = require("./user.schema")(sequelize);
const Role = require("./role.schema")(sequelize);
```

### `schemas/user.schema.js` — Định nghĩa bảng `users`

```javascript
// Đây là "bản thiết kế" của bảng users trong MySQL
const User = sequelize.define("User", {
  id:          UUID (khóa chính, tự sinh),
  email:       STRING (bắt buộc, duy nhất),
  username:    STRING (bắt buộc),
  firstname:   STRING (tùy chọn),
  lastname:    STRING (tùy chọn),
  password:    STRING (bắt buộc, đã hash),
  dateOfBirth: DATEONLY (bắt buộc),
  roleName:    STRING (khóa ngoại → bảng roles),
});
```

> 💡 **Sequelize** là ORM — thay vì viết SQL thủ công, bạn dùng JavaScript để thao tác DB.

---

## ④ Bước 4: Routes — `routes/`

Routes là **bảng chỉ đường**: URL nào → gọi hàm nào.

### Ví dụ: `routes/auth.js`

```javascript
router.post("/register", registerController);
// Khi client gửi POST đến /auth/register → gọi hàm registerController

router.post("/login", loginController);
// Khi client gửi POST đến /auth/login → gọi hàm loginController
```

### Ví dụ: `routes/users.js`

```javascript
router.get("/me", authenticateToken, getMeController);
// Khi client gửi GET đến /users/me:
//   Bước 1: chạy authenticateToken (kiểm tra token)
//   Bước 2: nếu hợp lệ → chạy getMeController
```

> 💡 **Lưu ý**: Route `/users/me` có **2 hàm** — `authenticateToken` là middleware chạy trước, `getMeController` chạy sau. Đây là cơ chế bảo vệ route.

---

## ⑤ Bước 5: Middleware — `middlewares/auth.middleware.js`

Middleware là **bộ lọc trung gian** — chạy giữa request và controller.

### `auth.middleware.js` — Kiểm tra JWT Token

```
Client gửi request có header: "Authorization: Bearer <token>"
                    ↓
         authenticateToken chạy:
         1. Lấy token từ header
         2. Verify token bằng JWT_SECRET
         3. Tìm user trong DB theo userId trong token
         4. Gắn thông tin user vào req.user
         5. Gọi next() → chuyển sang controller
                    ↓
              Controller chạy
              (đã có req.user sẵn)
```

Nếu token sai hoặc hết hạn → trả lỗi 401, **không** cho vào controller.

> 💡 **Tương tự như**: Bảo vệ ở cửa — kiểm tra thẻ trước khi cho vào.

---

## ⑥ Bước 6: Controllers — `controllers/`

Controller là **người tiếp nhận** request từ client và **trả response** về.

### Ví dụ: `authController.js` — Đăng ký

```javascript
const registerController = async (req, res) => {
  // 1. Lấy dữ liệu từ request body
  const { email, username, password, ... } = req.body;

  // 2. Validate dữ liệu đầu vào
  if (!email || !username || !password) {
    return errorResponse(res, "Thiếu thông tin", ...);
  }

  // 3. Gọi Service để xử lý logic
  const result = await authService.register({ email, username, password, ... });

  // 4. Trả response về client
  return successResponse(res, result, 201);
};
```

> 💡 **Controller KHÔNG tự xử lý logic** — nó chỉ nhận dữ liệu, validate cơ bản, rồi giao cho **Service**.

---

## ⑦ Bước 7: Services — `services/`

Service chứa **toàn bộ logic nghiệp vụ** — phần phức tạp nhất.

### Ví dụ: `authService.js` — Hàm `register`

```javascript
const register = async (userData) => {
  // 1. Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new AppError("Email đã dùng", ...);

  // 2. Tìm hoặc tạo role USER mặc định
  let userRole = await Role.findOne({ where: { name: "USER" } });

  // 3. Hash password (không lưu mật khẩu thô)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Tạo user trong DB
  const newUser = await User.create({ email, username, hashedPassword, ... });

  // 5. Trả về thông tin user (không có password, không có token)
  return { id, email, username, ... };
};
```

### Ví dụ: `authService.js` — Hàm `login`

```javascript
const login = async (email, password) => {
  // 1. Tìm user theo email
  const user = await User.findOne({ where: { email } });
  if (!user) throw new AppError("Sai email/mật khẩu", ...);

  // 2. So sánh password với hash trong DB
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new AppError("Sai email/mật khẩu", ...);

  // 3. Tạo JWT token
  const token = generateToken({ userId: user.id, email, roleName });

  // 4. Trả về user + token
  return { user: { id, email, ... }, token };
};
```

> 💡 **Service KHÔNG biết gì về HTTP** — nó chỉ nhận dữ liệu thuần, xử lý, và trả kết quả.

---

## ⑧ Bước 8: Utils — `utils/`

Các công cụ dùng chung cho toàn bộ ứng dụng.

### `utils/jwt.js` — Tạo và kiểm tra Token

```javascript
// Tạo token (khi đăng nhập thành công)
generateToken({ userId, email, roleName });
// → Trả về chuỗi token như: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Kiểm tra token (khi gọi API cần xác thực)
verifyToken(token);
// → Trả về { userId, email, roleName } nếu hợp lệ
// → Trả về null nếu sai hoặc hết hạn
```

### `utils/response.js` — Format JSON trả về

```javascript
// Thành công có dữ liệu
successResponse(res, data, 200);
// → { "code": 1000, "result": { ...data } }

// Thành công chỉ có message
successMessageResponse(res, "Đổi mật khẩu thành công", 200);
// → { "code": 1000, "message": "Đổi mật khẩu thành công" }

// Lỗi
errorResponse(res, "Email đã tồn tại", 9001, 400);
// → { "code": 9001, "message": "Email đã tồn tại" }
```

---

## 🔄 Luồng Hoạt Động Hoàn Chỉnh

### Ví dụ 1: Đăng ký tài khoản

```
Client gửi: POST /auth/register
Body: { email, username, password, dateOfBirth }

    ↓ app.js nhận request, chuyển đến authRouter

    ↓ routes/auth.js: router.post("/register", registerController)

    ↓ controllers/authController.js:
      - Validate email, password, username...
      - Gọi authService.register(...)

    ↓ services/authService.js:
      - Kiểm tra email trùng → nếu trùng throw lỗi
      - Hash password bằng bcrypt
      - Tạo user trong MySQL
      - Trả về thông tin user

    ↓ controllers/authController.js:
      - Nhận kết quả từ service
      - Gọi successResponse(res, result, 201)

    ↓ Client nhận:
{
  "code": 1000,
  "result": {
    "id": "uuid-...",
    "email": "user@example.com",
    "username": "user123",
    "roleName": "USER"
  }
}
```

---

### Ví dụ 2: Lấy thông tin cá nhân (cần đăng nhập)

```
Client gửi: GET /users/me
Header: Authorization: Bearer <token>

    ↓ app.js nhận request, chuyển đến usersRouter

    ↓ routes/users.js: router.get("/me", authenticateToken, getMeController)

    ↓ middlewares/auth.middleware.js (authenticateToken):
      - Lấy token từ header
      - Verify token → lấy được { userId, email, roleName }
      - Tìm user trong DB theo userId
      - Gắn vào req.user
      - Gọi next() → tiếp tục

    ↓ controllers/userController.js (getMeController):
      - Lấy userId từ req.user.id
      - Gọi userService.getUserProfile(userId)

    ↓ services/userService.js:
      - Tìm user trong DB kèm thông tin role
      - Trả về thông tin user (không có password)

    ↓ Client nhận:
{
  "code": 1000,
  "result": {
    "id": "uuid-...",
    "email": "user@example.com",
    "role": { "name": "USER", "description": "Người dùng thông thường" }
  }
}
```

---

## 📋 Thứ Tự Tạo File Khi Xây Dựng Dự Án Từ Đầu

Nếu bạn muốn tự xây dựng lại dự án này từ đầu, hãy làm theo thứ tự sau:

```
Bước 1: Khởi tạo dự án
  └── npm init / npx express-generator
  └── Cài thư viện: npm install express sequelize mysql2 bcrypt jsonwebtoken dotenv

Bước 2: Cấu hình môi trường
  └── .env  (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET)

Bước 3: Tạo Database Models
  └── schemas/index.js          ← Kết nối DB
  └── schemas/role.schema.js    ← Bảng roles
  └── schemas/permission.schema.js
  └── schemas/user.schema.js    ← Bảng users (phụ thuộc role)
  └── schemas/seed.js           ← Dữ liệu mẫu

Bước 4: Tạo Utilities
  └── utils/errorCodes.js       ← Mã lỗi
  └── utils/jwt.js              ← Hàm tạo/verify token
  └── utils/response.js         ← Format response

Bước 5: Tạo Services (logic nghiệp vụ)
  └── services/authService.js   ← Logic đăng ký, đăng nhập
  └── services/userService.js   ← Logic profile, đổi mật khẩu

Bước 6: Tạo Middlewares
  └── middlewares/auth.middleware.js  ← Kiểm tra token

Bước 7: Tạo Controllers
  └── controllers/authController.js  ← Nhận/trả request auth
  └── controllers/userController.js  ← Nhận/trả request user

Bước 8: Tạo Routes
  └── routes/auth.js    ← Map URL → controller
  └── routes/users.js   ← Map URL → controller

Bước 9: Cấu hình App
  └── app.js            ← Gộp tất cả lại

Bước 10: Entry Point
  └── bin/www           ← Khởi động server
```

---

## 🧠 Tóm Tắt Vai Trò Từng Tầng

| Tầng           | File               | Vai trò                                 | Biết về HTTP? |
| -------------- | ------------------ | --------------------------------------- | ------------- |
| **Entry**      | `bin/www`          | Khởi động server                        | ✅            |
| **App**        | `app.js`           | Cấu hình, kết nối DB, đăng ký route     | ✅            |
| **Route**      | `routes/*.js`      | Chỉ đường URL → Controller              | ✅            |
| **Middleware** | `middlewares/*.js` | Lọc/xử lý trước Controller              | ✅            |
| **Controller** | `controllers/*.js` | Nhận request, gọi Service, trả response | ✅            |
| **Service**    | `services/*.js`    | Toàn bộ logic nghiệp vụ                 | ❌            |
| **Schema**     | `schemas/*.js`     | Định nghĩa bảng DB                      | ❌            |
| **Utils**      | `utils/*.js`       | Công cụ dùng chung                      | ❌            |

> 💡 **Nguyên tắc quan trọng**: Tầng càng thấp thì càng **không biết gì về HTTP**. Service và Schema chỉ làm việc với dữ liệu thuần túy — điều này giúp code dễ test và tái sử dụng.

---

## 🔑 Các Khái Niệm Quan Trọng Cần Nhớ

| Khái niệm          | Giải thích đơn giản                                                 |
| ------------------ | ------------------------------------------------------------------- |
| **Express**        | Framework giúp tạo web server dễ dàng trong Node.js                 |
| **Middleware**     | Hàm chạy giữa request và response, có thể chặn hoặc cho đi tiếp     |
| **JWT Token**      | Chuỗi mã hóa chứa thông tin user, dùng để xác thực thay vì session  |
| **Sequelize**      | Thư viện giúp thao tác MySQL bằng JavaScript thay vì SQL            |
| **bcrypt**         | Thư viện hash (mã hóa một chiều) mật khẩu — không thể giải mã ngược |
| **dotenv**         | Đọc biến môi trường từ file `.env` vào `process.env`                |
| **module.exports** | Cách export hàm/object để file khác `require()` dùng                |
| **async/await**    | Cú pháp xử lý bất đồng bộ (đọc DB, gọi API...) trong JavaScript     |
