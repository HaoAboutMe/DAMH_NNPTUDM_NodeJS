const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DoAn NodeJS API",
      version: "1.0.0",
      description:
        "API documentation cho dự án Node.js. Các endpoint cần xác thực hãy nhấn **Authorize** và nhập token theo dạng: `Bearer <token>`",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Nhập JWT token lấy từ endpoint /auth/login",
        },
      },
      schemas: {
        // ─── Request Bodies ───────────────────────────────────────────
        RegisterRequest: {
          type: "object",
          required: ["email", "username", "password", "dateOfBirth"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            username: { type: "string", example: "nguyenvana" },
            password: { type: "string", minLength: 6, example: "123456" },
            firstname: { type: "string", example: "Văn A", nullable: true },
            lastname: { type: "string", example: "Nguyễn", nullable: true },
            dateOfBirth: {
              type: "string",
              format: "date",
              example: "2000-01-15",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: { type: "string", example: "123456" },
          },
        },
        ChangePasswordRequest: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: { type: "string", example: "123456" },
            newPassword: {
              type: "string",
              minLength: 6,
              example: "newpass123",
            },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          properties: {
            username: {
              type: "string",
              example: "newusername",
              description: "Không được để trống nếu gửi",
            },
            firstname: { type: "string", example: "Văn B", nullable: true },
            lastname: { type: "string", example: "Trần", nullable: true },
            dateOfBirth: {
              type: "string",
              format: "date",
              example: "1999-05-20",
            },
          },
        },

        // ─── Response Objects ─────────────────────────────────────────
        UserObject: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            email: { type: "string", example: "user@example.com" },
            username: { type: "string", example: "nguyenvana" },
            firstname: { type: "string", example: "Văn A", nullable: true },
            lastname: { type: "string", example: "Nguyễn", nullable: true },
            dateOfBirth: {
              type: "string",
              format: "date",
              example: "2000-01-15",
            },
            roleName: { type: "string", example: "USER" },
          },
        },
        UserWithRole: {
          allOf: [
            { $ref: "#/components/schemas/UserObject" },
            {
              type: "object",
              properties: {
                role: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "USER" },
                    description: {
                      type: "string",
                      example: "Người dùng thông thường",
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },

    // ─── API Paths ──────────────────────────────────────────────────────
    paths: {
      // ── Auth ────────────────────────────────────────────────────────
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Đăng ký tài khoản mới",
          description:
            "Tạo tài khoản mới. Trả về thông tin user (không có token). Sau khi đăng ký, dùng `/auth/login` để lấy token.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Đăng ký thành công",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: {
                      id: "550e8400-e29b-41d4-a716-446655440000",
                      email: "user@example.com",
                      username: "nguyenvana",
                      firstname: "Văn A",
                      lastname: "Nguyễn",
                      dateOfBirth: "2000-01-15",
                      roleName: "USER",
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Đăng nhập",
          description:
            "Đăng nhập bằng email và password. Trả về thông tin user kèm **JWT token**. Copy token rồi nhấn **Authorize** để dùng cho các endpoint cần xác thực.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Đăng nhập thành công",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: {
                      user: {
                        id: "550e8400-e29b-41d4-a716-446655440000",
                        email: "user@example.com",
                        username: "nguyenvana",
                        firstname: "Văn A",
                        lastname: "Nguyễn",
                        dateOfBirth: "2000-01-15",
                        roleName: "USER",
                        role: {
                          name: "USER",
                          description: "Người dùng thông thường",
                        },
                      },
                      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ── Users ──────────────────────────────────────────────────────
      "/users/me": {
        get: {
          tags: ["Users"],
          summary: "Lấy thông tin cá nhân",
          description:
            "Lấy thông tin của user đang đăng nhập. **Yêu cầu Bearer Token.**",
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "Lấy thông tin thành công",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: {
                      id: "550e8400-e29b-41d4-a716-446655440000",
                      email: "user@example.com",
                      username: "nguyenvana",
                      firstname: "Văn A",
                      lastname: "Nguyễn",
                      dateOfBirth: "2000-01-15",
                      roleName: "USER",
                      role: {
                        name: "USER",
                        description: "Người dùng thông thường",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Cập nhật thông tin cá nhân",
          description:
            "Cập nhật thông tin của user đang đăng nhập. **Yêu cầu Bearer Token.**\n\n- Tất cả các trường đều **optional** — chỉ gửi trường nào muốn thay đổi\n- Ít nhất **1 trường** phải được gửi\n- Không thể thay đổi: `email`, `password`, `roleName`",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateProfileRequest" },
                examples: {
                  updateAll: {
                    summary: "Cập nhật tất cả trường",
                    value: {
                      username: "newusername",
                      firstname: "Văn B",
                      lastname: "Trần",
                      dateOfBirth: "1999-05-20",
                    },
                  },
                  updatePartial: {
                    summary: "Chỉ cập nhật username",
                    value: { username: "newusername" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description:
                "Cập nhật thành công — trả về thông tin user mới nhất",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: {
                      id: "550e8400-e29b-41d4-a716-446655440000",
                      email: "user@example.com",
                      username: "newusername",
                      firstname: "Văn B",
                      lastname: "Trần",
                      dateOfBirth: "1999-05-20",
                      roleName: "USER",
                      role: {
                        name: "USER",
                        description: "Người dùng thông thường",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/users/change-password": {
        post: {
          tags: ["Users"],
          summary: "Đổi mật khẩu",
          description:
            "Đổi mật khẩu của user đang đăng nhập. **Yêu cầu Bearer Token.**",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChangePasswordRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Đổi mật khẩu thành công",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    message: "Đổi mật khẩu thành công",
                  },
                },
              },
            },
          },
        },
      },

      // ── Admin ──────────────────────────────────────────────────────
      "/users": {
        get: {
          tags: ["Admin"],
          summary: "Lấy danh sách tất cả user",
          description:
            "Trả về toàn bộ danh sách user trong hệ thống. **Chỉ dành cho ADMIN.** Yêu cầu Bearer Token của tài khoản có role ADMIN.\n\n> Tài khoản ADMIN mặc định: `haoaboutme@gmail.com` / `admin`",
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "Lấy danh sách thành công",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: [
                      {
                        id: "550e8400-e29b-41d4-a716-446655440000",
                        email: "haoaboutme@gmail.com",
                        username: "Admin Hảo",
                        firstname: "Admin",
                        lastname: "Hảo",
                        dateOfBirth: "2026-01-01",
                        roleName: "ADMIN",
                        role: {
                          name: "ADMIN",
                          description: "Quản trị hệ thống",
                        },
                      },
                      {
                        id: "661f9511-f30c-52e5-b827-557766551111",
                        email: "user@example.com",
                        username: "nguyenvana",
                        firstname: "Văn A",
                        lastname: "Nguyễn",
                        dateOfBirth: "2000-01-15",
                        roleName: "USER",
                        role: {
                          name: "USER",
                          description: "Người dùng thông thường",
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
