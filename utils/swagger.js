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

        LookupCreateRequest: {
          type: "object",
          required: ["id", "name"],
          properties: {
            id: {
              type: "string",
              example: "NVME",
              description: "ID hằng số viết hoa, do người dùng nhập",
            },
            name: {
              type: "string",
              example: "NVMe SSD",
              description: "Tên hiển thị",
            },
          },
        },
        LookupUpdateRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              example: "NVMe SSD (Updated)",
              description: "Tên hiển thị mới",
            },
          },
        },

        // ─── PC Parts Request Schemas ─────────────────────────────────
        PcCaseRequest: {
          type: "object",
          required: ["name", "size", "maxVgaLengthMm", "maxCoolerHeightMm"],
          properties: {
            name: { type: "string", example: "Lian Li PC-O11D" },
            size: {
              type: "string",
              enum: ["ATX", "mATX", "ITX"],
              example: "ATX",
            },
            maxVgaLengthMm: {
              type: "integer",
              example: 420,
              description: "mm",
            },
            maxCoolerHeightMm: {
              type: "integer",
              example: 167,
              description: "mm",
            },
            maxRadiatorSize: {
              type: "integer",
              nullable: true,
              example: 360,
              description: "mm (120/240/360)",
            },
            drive35Slot: { type: "integer", example: 2, default: 0 },
            drive25Slot: { type: "integer", example: 4, default: 0 },
            description: {
              type: "string",
              nullable: true,
              example: "Case mid-tower ATX cao cấp",
            },
          },
        },
        CoolerRequest: {
          type: "object",
          required: ["name", "coolerTypeId", "tdpSupport"],
          properties: {
            name: { type: "string", example: "Noctua NH-D15" },
            coolerTypeId: {
              type: "string",
              enum: ["AIR", "AIO"],
              example: "AIR",
            },
            radiatorSize: {
              type: "integer",
              nullable: true,
              example: null,
              description: "mm — null nếu AIR",
            },
            heightMm: {
              type: "integer",
              nullable: true,
              example: 165,
              description: "mm — null nếu AIO",
            },
            tdpSupport: {
              type: "integer",
              example: 250,
              description: "Watt TDP tối đa",
            },
            description: { type: "string", nullable: true, example: null },
          },
        },
        CpuRequest: {
          type: "object",
          required: ["name", "socketId", "vrmMin", "tdp", "pcieVersionId"],
          properties: {
            name: { type: "string", example: "AMD Ryzen 9 7950X" },
            socketId: {
              type: "string",
              enum: ["AM4", "AM5", "LGA1700"],
              example: "AM5",
            },
            vrmMin: {
              type: "integer",
              example: 16,
              description: "Số phase VRM tối thiểu",
            },
            igpu: { type: "boolean", example: false, default: false },
            tdp: { type: "integer", example: 170, description: "Watt" },
            pcieVersionId: {
              type: "string",
              enum: ["PCIE_3", "PCIE_4", "PCIE_5"],
              example: "PCIE_5",
            },
            score: {
              type: "integer",
              example: 95000,
              default: 0,
              description: "Điểm benchmark",
            },
            description: { type: "string", nullable: true, example: null },
          },
        },
        HddRequest: {
          type: "object",
          required: [
            "name",
            "formFactorId",
            "interfaceTypeId",
            "capacity",
            "tdp",
          ],
          properties: {
            name: { type: "string", example: "Seagate Barracuda 2TB" },
            formFactorId: {
              type: "string",
              enum: ["FF_2_5", "FF_3_5"],
              example: "FF_3_5",
            },
            interfaceTypeId: {
              type: "string",
              enum: ["SATA_3", "SAS"],
              example: "SATA_3",
            },
            capacity: { type: "integer", example: 2000, description: "GB" },
            tdp: { type: "integer", example: 6, description: "Watt" },
            description: { type: "string", nullable: true, example: null },
          },
        },
        MainboardRequest: {
          type: "object",
          required: [
            "name",
            "socketId",
            "vrmPhase",
            "cpuTdpSupport",
            "ramTypeId",
            "ramBusMax",
            "ramSlot",
            "ramMaxCapacity",
            "size",
            "pcieVgaVersionId",
          ],
          properties: {
            name: { type: "string", example: "ASUS ROG Crosshair X670E" },
            socketId: {
              type: "string",
              enum: ["AM4", "AM5", "LGA1700"],
              example: "AM5",
            },
            vrmPhase: { type: "integer", example: 24 },
            cpuTdpSupport: {
              type: "integer",
              example: 230,
              description: "Watt",
            },
            ramTypeId: {
              type: "string",
              enum: ["DDR4", "DDR5"],
              example: "DDR5",
            },
            ramBusMax: { type: "integer", example: 6400, description: "MHz" },
            ramSlot: { type: "integer", example: 4 },
            ramMaxCapacity: {
              type: "integer",
              example: 128,
              description: "GB",
            },
            size: {
              type: "string",
              enum: ["ATX", "mATX", "ITX"],
              example: "ATX",
            },
            pcieVgaVersionId: {
              type: "string",
              enum: ["PCIE_3", "PCIE_4", "PCIE_5"],
              example: "PCIE_5",
            },
            m2Slot: { type: "integer", example: 5, default: 0 },
            sataSlot: { type: "integer", example: 6, default: 0 },
            description: { type: "string", nullable: true, example: null },
          },
        },
        PsuRequest: {
          type: "object",
          required: ["name", "wattage", "efficiency"],
          properties: {
            name: { type: "string", example: "Corsair RM1000x" },
            wattage: { type: "integer", example: 1000, description: "Watt" },
            efficiency: {
              type: "string",
              example: "80+ Gold",
              description: "80+ Bronze | Gold | Platinum | Titanium",
            },
            pcieConnectorId: {
              type: "string",
              nullable: true,
              enum: ["2X8PIN", "3X8PIN", "12VHPWR", "16PIN"],
              example: "12VHPWR",
            },
            sataConnector: { type: "integer", example: 12, default: 0 },
            description: { type: "string", nullable: true, example: null },
          },
        },
        RamRequest: {
          type: "object",
          required: [
            "name",
            "ramTypeId",
            "ramBus",
            "ramCas",
            "capacityPerStick",
            "tdp",
          ],
          properties: {
            name: {
              type: "string",
              example: "G.Skill Trident Z5 RGB 32GB DDR5-6000",
            },
            ramTypeId: {
              type: "string",
              enum: ["DDR4", "DDR5"],
              example: "DDR5",
            },
            ramBus: { type: "integer", example: 6000, description: "MHz" },
            ramCas: {
              type: "integer",
              example: 30,
              description: "CAS Latency",
            },
            capacityPerStick: {
              type: "integer",
              example: 16,
              description: "GB mỗi thanh",
            },
            quantity: {
              type: "integer",
              example: 2,
              default: 1,
              description: "Số thanh trong kit",
            },
            tdp: { type: "integer", example: 5, description: "Watt" },
            description: { type: "string", nullable: true, example: null },
          },
        },
        SsdRequest: {
          type: "object",
          required: [
            "name",
            "ssdTypeId",
            "formFactorId",
            "interfaceTypeId",
            "capacity",
            "tdp",
          ],
          properties: {
            name: { type: "string", example: "Samsung 990 Pro 2TB" },
            ssdTypeId: {
              type: "string",
              enum: ["SATA", "NVME"],
              example: "NVME",
            },
            formFactorId: {
              type: "string",
              enum: ["FF_2_5", "M2_2280", "M2_2260", "M2_2242"],
              example: "M2_2280",
            },
            interfaceTypeId: {
              type: "string",
              enum: ["SATA_3", "PCIE_3", "PCIE_4", "PCIE_5"],
              example: "PCIE_4",
            },
            capacity: { type: "integer", example: 2000, description: "GB" },
            tdp: { type: "integer", example: 7, description: "Watt" },
            description: { type: "string", nullable: true, example: null },
          },
        },
        VgaRequest: {
          type: "object",
          required: [
            "name",
            "lengthMm",
            "tdp",
            "pcieVersionId",
            "powerConnector",
          ],
          properties: {
            name: { type: "string", example: "NVIDIA RTX 4090" },
            lengthMm: {
              type: "integer",
              example: 336,
              description: "Chiều dài card (mm)",
            },
            tdp: { type: "integer", example: 450, description: "Watt" },
            pcieVersionId: {
              type: "string",
              enum: ["PCIE_3", "PCIE_4", "PCIE_5"],
              example: "PCIE_4",
            },
            powerConnector: {
              type: "string",
              example: "12VHPWR",
              description: "Mô tả connector nguồn",
            },
            score: {
              type: "integer",
              example: 30000,
              default: 0,
              description: "Điểm benchmark",
            },
            description: { type: "string", nullable: true, example: null },
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
      // ── PC Parts — Identity (Lookup Tables) ───────────────────────
      "/pc-parts/identity/{resource}": {
        get: {
          tags: ["PC Parts - Identity"],
          summary: "Lấy danh sách lookup table",
          description:
            "Lấy toàn bộ bản ghi của một lookup table. **Không cần xác thực.**\n\n**Các resource hợp lệ:**\n- `cooler-types` — Loại tản nhiệt (AIR, AIO)\n- `form-factors` — Form factor ổ cứng (FF_2_5, M2_2280...)\n- `interface-types` — Loại giao tiếp (SATA_3, PCIE_4...)\n- `pcie-connectors` — Connector nguồn PCIe (2X8PIN, 12VHPWR...)\n- `pcie-versions` — Phiên bản PCIe (PCIE_3, PCIE_4, PCIE_5)\n- `ram-types` — Loại RAM (DDR4, DDR5)\n- `sockets` — Socket CPU (AM4, AM5, LGA1700)\n- `ssd-types` — Loại SSD (SATA, NVME)",
          parameters: [
            {
              name: "resource",
              in: "path",
              required: true,
              schema: {
                type: "string",
                enum: [
                  "cooler-types",
                  "form-factors",
                  "interface-types",
                  "pcie-connectors",
                  "pcie-versions",
                  "ram-types",
                  "sockets",
                  "ssd-types",
                ],
              },
              example: "ssd-types",
            },
          ],
          responses: {
            200: {
              description: "Lấy danh sách thành công",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: [
                      { id: "SATA", name: "SATA SSD" },
                      { id: "NVME", name: "NVMe SSD" },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["PC Parts - Identity"],
          summary: "Thêm mới vào lookup table [ADMIN]",
          description:
            "Tạo một bản ghi mới. **Chỉ ADMIN.** ID do người dùng nhập, thường là hằng số viết hoa.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "resource",
              in: "path",
              required: true,
              schema: {
                type: "string",
                enum: [
                  "cooler-types",
                  "form-factors",
                  "interface-types",
                  "pcie-connectors",
                  "pcie-versions",
                  "ram-types",
                  "sockets",
                  "ssd-types",
                ],
              },
              example: "ssd-types",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LookupCreateRequest" },
                examples: {
                  ssdType: {
                    summary: "Thêm SSD Type",
                    value: { id: "NVME", name: "NVMe SSD" },
                  },
                  socket: {
                    summary: "Thêm Socket",
                    value: {
                      id: "LGA1851",
                      name: "Intel LGA1851 (Arrow Lake)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Tạo thành công",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: { id: "NVME", name: "NVMe SSD" },
                  },
                },
              },
            },
          },
        },
      },

      "/pc-parts/identity/{resource}/{id}": {
        get: {
          tags: ["PC Parts - Identity"],
          summary: "Lấy chi tiết một bản ghi",
          description: "Lấy một bản ghi theo ID. **Không cần xác thực.**",
          parameters: [
            {
              name: "resource",
              in: "path",
              required: true,
              schema: {
                type: "string",
                enum: [
                  "cooler-types",
                  "form-factors",
                  "interface-types",
                  "pcie-connectors",
                  "pcie-versions",
                  "ram-types",
                  "sockets",
                  "ssd-types",
                ],
              },
              example: "sockets",
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "AM5",
            },
          ],
          responses: {
            200: {
              description: "Lấy thành công",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: { id: "AM5", name: "AMD AM5 (Ryzen 7000+)" },
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ["PC Parts - Identity"],
          summary: "Cập nhật name [ADMIN]",
          description:
            "Cập nhật tên hiển thị của bản ghi. **Không thể đổi ID.** Chỉ ADMIN.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "resource",
              in: "path",
              required: true,
              schema: {
                type: "string",
                enum: [
                  "cooler-types",
                  "form-factors",
                  "interface-types",
                  "pcie-connectors",
                  "pcie-versions",
                  "ram-types",
                  "sockets",
                  "ssd-types",
                ],
              },
              example: "sockets",
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "AM5",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LookupUpdateRequest" },
                example: { name: "AMD AM5 (Ryzen 7000 / 9000)" },
              },
            },
          },
          responses: {
            200: {
              description: "Cập nhật thành công",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: { id: "AM5", name: "AMD AM5 (Ryzen 7000 / 9000)" },
                  },
                },
              },
            },
          },
        },
        delete: {
          tags: ["PC Parts - Identity"],
          summary: "Xóa bản ghi [ADMIN]",
          description:
            "Xóa một bản ghi. **Sẽ thất bại nếu đang được linh kiện khác tham chiếu.** Chỉ ADMIN.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "resource",
              in: "path",
              required: true,
              schema: {
                type: "string",
                enum: [
                  "cooler-types",
                  "form-factors",
                  "interface-types",
                  "pcie-connectors",
                  "pcie-versions",
                  "ram-types",
                  "sockets",
                  "ssd-types",
                ],
              },
              example: "ssd-types",
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "NVME",
            },
          ],
          responses: {
            200: {
              description: "Xóa thành công",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: { message: "Xóa thành công" },
                  },
                },
              },
            },
          },
        },
      },
      // ── PC Parts — Cases ───────────────────────────────────────────
      "/pc-parts/cases": {
        get: {
          tags: ["PC Parts - Cases"],
          summary: "Lấy danh sách case",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: [
                      {
                        id: "uuid",
                        name: "Lian Li PC-O11D",
                        size: "ATX",
                        maxVgaLengthMm: 420,
                        maxCoolerHeightMm: 167,
                        maxRadiatorSize: 360,
                        drive35Slot: 2,
                        drive25Slot: 4,
                        description: null,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["PC Parts - Cases"],
          summary: "Thêm case [ADMIN]",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PcCaseRequest" },
                example: {
                  name: "Lian Li PC-O11D",
                  size: "ATX",
                  maxVgaLengthMm: 420,
                  maxCoolerHeightMm: 167,
                  maxRadiatorSize: 360,
                  drive35Slot: 2,
                  drive25Slot: 4,
                  description: "Case mid-tower ATX cao cấp",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Tạo thành công",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: { id: "uuid", name: "Lian Li PC-O11D" },
                  },
                },
              },
            },
          },
        },
      },
      "/pc-parts/cases/{id}": {
        get: {
          tags: ["PC Parts - Cases"],
          summary: "Lấy chi tiết case",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
        put: {
          tags: ["PC Parts - Cases"],
          summary: "Cập nhật case [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PcCaseRequest" },
              },
            },
          },
          responses: { 200: { description: "Cập nhật thành công" } },
        },
        delete: {
          tags: ["PC Parts - Cases"],
          summary: "Xóa case [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "Xóa thành công" } },
        },
      },

      // ── PC Parts — Coolers ─────────────────────────────────────────
      "/pc-parts/coolers": {
        get: {
          tags: ["PC Parts - Coolers"],
          summary: "Lấy danh sách tản nhiệt",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: [
                      {
                        id: "uuid",
                        name: "Noctua NH-D15",
                        coolerTypeId: "AIR",
                        heightMm: 165,
                        radiatorSize: null,
                        tdpSupport: 250,
                        description: null,
                        coolerType: { id: "AIR", name: "Air Cooler" },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["PC Parts - Coolers"],
          summary: "Thêm tản nhiệt [ADMIN]",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CoolerRequest" },
                examples: {
                  air: {
                    summary: "Tản khí",
                    value: {
                      name: "Noctua NH-D15",
                      coolerTypeId: "AIR",
                      heightMm: 165,
                      radiatorSize: null,
                      tdpSupport: 250,
                      description: "Tản nhiệt khí 2 tháp, hỗ trợ TDP 250W",
                    },
                  },
                  aio: {
                    summary: "Tản nước AIO",
                    value: {
                      name: "Corsair H150i Elite",
                      coolerTypeId: "AIO",
                      heightMm: null,
                      radiatorSize: 360,
                      tdpSupport: 350,
                      description:
                        "Tản nước AIO 360mm, RGB, hỗ trợ AM5 và LGA1700",
                    },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Tạo thành công" } },
        },
      },
      "/pc-parts/coolers/{id}": {
        get: {
          tags: ["PC Parts - Coolers"],
          summary: "Lấy chi tiết tản nhiệt",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
        put: {
          tags: ["PC Parts - Coolers"],
          summary: "Cập nhật tản nhiệt [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CoolerRequest" },
              },
            },
          },
          responses: { 200: { description: "OK" } },
        },
        delete: {
          tags: ["PC Parts - Coolers"],
          summary: "Xóa tản nhiệt [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
      },

      // ── PC Parts — CPUs ────────────────────────────────────────────
      "/pc-parts/cpus": {
        get: {
          tags: ["PC Parts - CPUs"],
          summary: "Lấy danh sách CPU",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: [
                      {
                        id: "uuid",
                        name: "AMD Ryzen 9 7950X",
                        socketId: "AM5",
                        vrmMin: 16,
                        igpu: false,
                        tdp: 170,
                        pcieVersionId: "PCIE_5",
                        score: 95000,
                        description: null,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["PC Parts - CPUs"],
          summary: "Thêm CPU [ADMIN]",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CpuRequest" },
                examples: {
                  amd: {
                    summary: "AMD CPU",
                    value: {
                      name: "AMD Ryzen 9 7950X",
                      socketId: "AM5",
                      vrmMin: 16,
                      igpu: false,
                      tdp: 170,
                      pcieVersionId: "PCIE_5",
                      score: 95000,
                      description:
                        "CPU AMD Ryzen 9 7950X 16 nhân 32 luồng, socket AM5",
                    },
                  },
                  intel: {
                    summary: "Intel CPU",
                    value: {
                      name: "Intel Core i9-14900K",
                      socketId: "LGA1700",
                      vrmMin: 20,
                      igpu: true,
                      tdp: 125,
                      pcieVersionId: "PCIE_5",
                      score: 90000,
                      description:
                        "CPU Intel Core i9-14900K 24 nhân, có iGPU UHD 770",
                    },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Tạo thành công" } },
        },
      },
      "/pc-parts/cpus/{id}": {
        get: {
          tags: ["PC Parts - CPUs"],
          summary: "Lấy chi tiết CPU",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
        put: {
          tags: ["PC Parts - CPUs"],
          summary: "Cập nhật CPU [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CpuRequest" },
              },
            },
          },
          responses: { 200: { description: "OK" } },
        },
        delete: {
          tags: ["PC Parts - CPUs"],
          summary: "Xóa CPU [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
      },

      // ── PC Parts — HDDs ────────────────────────────────────────────
      "/pc-parts/hdds": {
        get: {
          tags: ["PC Parts - HDDs"],
          summary: "Lấy danh sách HDD",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: [
                      {
                        id: "uuid",
                        name: "Seagate Barracuda 2TB",
                        formFactorId: "FF_3_5",
                        interfaceTypeId: "SATA_3",
                        capacity: 2000,
                        tdp: 6,
                        description: null,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["PC Parts - HDDs"],
          summary: "Thêm HDD [ADMIN]",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HddRequest" },
                example: {
                  name: "Seagate Barracuda 2TB",
                  formFactorId: "FF_3_5",
                  interfaceTypeId: "SATA_3",
                  capacity: 2000,
                  tdp: 6,
                  description: "HDD 3.5 inch 7200RPM",
                },
              },
            },
          },
          responses: { 201: { description: "Tạo thành công" } },
        },
      },
      "/pc-parts/hdds/{id}": {
        get: {
          tags: ["PC Parts - HDDs"],
          summary: "Lấy chi tiết HDD",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
        put: {
          tags: ["PC Parts - HDDs"],
          summary: "Cập nhật HDD [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HddRequest" },
              },
            },
          },
          responses: { 200: { description: "OK" } },
        },
        delete: {
          tags: ["PC Parts - HDDs"],
          summary: "Xóa HDD [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
      },

      // ── PC Parts — Mainboards ──────────────────────────────────────
      "/pc-parts/mainboards": {
        get: {
          tags: ["PC Parts - Mainboards"],
          summary: "Lấy danh sách mainboard",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: [
                      {
                        id: "uuid",
                        name: "ASUS ROG Crosshair X670E",
                        socketId: "AM5",
                        vrmPhase: 24,
                        cpuTdpSupport: 230,
                        ramTypeId: "DDR5",
                        ramBusMax: 6400,
                        ramSlot: 4,
                        ramMaxCapacity: 128,
                        size: "ATX",
                        pcieVgaVersionId: "PCIE_5",
                        m2Slot: 5,
                        sataSlot: 6,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["PC Parts - Mainboards"],
          summary: "Thêm mainboard [ADMIN]",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MainboardRequest" },
                example: {
                  name: "ASUS ROG Crosshair X670E",
                  socketId: "AM5",
                  vrmPhase: 24,
                  cpuTdpSupport: 230,
                  ramTypeId: "DDR5",
                  ramBusMax: 6400,
                  ramSlot: 4,
                  ramMaxCapacity: 128,
                  size: "ATX",
                  pcieVgaVersionId: "PCIE_5",
                  m2Slot: 5,
                  sataSlot: 6,
                  description:
                    "Mainboard AMD X670E cao cấp, 24 pha VRM, 5 khe M.2",
                },
              },
            },
          },
          responses: { 201: { description: "Tạo thành công" } },
        },
      },
      "/pc-parts/mainboards/{id}": {
        get: {
          tags: ["PC Parts - Mainboards"],
          summary: "Lấy chi tiết mainboard",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
        put: {
          tags: ["PC Parts - Mainboards"],
          summary: "Cập nhật mainboard [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MainboardRequest" },
              },
            },
          },
          responses: { 200: { description: "OK" } },
        },
        delete: {
          tags: ["PC Parts - Mainboards"],
          summary: "Xóa mainboard [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
      },

      // ── PC Parts — PSUs ────────────────────────────────────────────
      "/pc-parts/psus": {
        get: {
          tags: ["PC Parts - PSUs"],
          summary: "Lấy danh sách PSU",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: [
                      {
                        id: "uuid",
                        name: "Corsair RM1000x",
                        wattage: 1000,
                        efficiency: "80+ Gold",
                        pcieConnectorId: "12VHPWR",
                        sataConnector: 12,
                        description: null,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["PC Parts - PSUs"],
          summary: "Thêm PSU [ADMIN]",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PsuRequest" },
                examples: {
                  withPcie: {
                    summary: "PSU có PCIe connector",
                    value: {
                      name: "Corsair RM1000x",
                      wattage: 1000,
                      efficiency: "80+ Gold",
                      pcieConnectorId: "12VHPWR",
                      sataConnector: 12,
                      description:
                        "PSU 1000W 80+ Gold, connector 12VHPWR cho RTX 4090",
                    },
                  },
                  noPcie: {
                    summary: "PSU không có PCIe connector",
                    value: {
                      name: "Seasonic Focus GX-650",
                      wattage: 650,
                      efficiency: "80+ Gold",
                      pcieConnectorId: null,
                      sataConnector: 8,
                      description:
                        "PSU 650W 80+ Gold, phù hợp build không cần GPU rời",
                    },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Tạo thành công" } },
        },
      },
      "/pc-parts/psus/{id}": {
        get: {
          tags: ["PC Parts - PSUs"],
          summary: "Lấy chi tiết PSU",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
        put: {
          tags: ["PC Parts - PSUs"],
          summary: "Cập nhật PSU [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PsuRequest" },
              },
            },
          },
          responses: { 200: { description: "OK" } },
        },
        delete: {
          tags: ["PC Parts - PSUs"],
          summary: "Xóa PSU [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
      },

      // ── PC Parts — RAMs ────────────────────────────────────────────
      "/pc-parts/rams": {
        get: {
          tags: ["PC Parts - RAMs"],
          summary: "Lấy danh sách RAM",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: [
                      {
                        id: "uuid",
                        name: "G.Skill Trident Z5 RGB 32GB DDR5-6000",
                        ramTypeId: "DDR5",
                        ramBus: 6000,
                        ramCas: 30,
                        capacityPerStick: 16,
                        quantity: 2,
                        tdp: 5,
                        description: null,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["PC Parts - RAMs"],
          summary: "Thêm RAM [ADMIN]",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RamRequest" },
                example: {
                  name: "G.Skill Trident Z5 RGB 32GB DDR5-6000",
                  ramTypeId: "DDR5",
                  ramBus: 6000,
                  ramCas: 30,
                  capacityPerStick: 16,
                  quantity: 2,
                  tdp: 5,
                  description: "RAM DDR5 6000MHz CL30, kit 2×16GB, RGB",
                },
              },
            },
          },
          responses: { 201: { description: "Tạo thành công" } },
        },
      },
      "/pc-parts/rams/{id}": {
        get: {
          tags: ["PC Parts - RAMs"],
          summary: "Lấy chi tiết RAM",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
        put: {
          tags: ["PC Parts - RAMs"],
          summary: "Cập nhật RAM [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RamRequest" },
              },
            },
          },
          responses: { 200: { description: "OK" } },
        },
        delete: {
          tags: ["PC Parts - RAMs"],
          summary: "Xóa RAM [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
      },

      // ── PC Parts — SSDs ────────────────────────────────────────────
      "/pc-parts/ssds": {
        get: {
          tags: ["PC Parts - SSDs"],
          summary: "Lấy danh sách SSD",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: [
                      {
                        id: "uuid",
                        name: "Samsung 990 Pro 2TB",
                        ssdTypeId: "NVME",
                        formFactorId: "M2_2280",
                        interfaceTypeId: "PCIE_4",
                        capacity: 2000,
                        tdp: 7,
                        description: null,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["PC Parts - SSDs"],
          summary: "Thêm SSD [ADMIN]",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SsdRequest" },
                examples: {
                  nvme: {
                    summary: "NVMe SSD",
                    value: {
                      name: "Samsung 990 Pro 2TB",
                      ssdTypeId: "NVME",
                      formFactorId: "M2_2280",
                      interfaceTypeId: "PCIE_4",
                      capacity: 2000,
                      tdp: 7,
                      description: "SSD NVMe PCIe 4.0, tốc độ đọc 7450 MB/s",
                    },
                  },
                  sata: {
                    summary: "SATA SSD",
                    value: {
                      name: "Samsung 870 EVO 1TB",
                      ssdTypeId: "SATA",
                      formFactorId: "FF_2_5",
                      interfaceTypeId: "SATA_3",
                      capacity: 1000,
                      tdp: 3,
                      description: "SSD SATA 2.5 inch, tốc độ đọc 560 MB/s",
                    },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Tạo thành công" } },
        },
      },
      "/pc-parts/ssds/{id}": {
        get: {
          tags: ["PC Parts - SSDs"],
          summary: "Lấy chi tiết SSD",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
        put: {
          tags: ["PC Parts - SSDs"],
          summary: "Cập nhật SSD [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SsdRequest" },
              },
            },
          },
          responses: { 200: { description: "OK" } },
        },
        delete: {
          tags: ["PC Parts - SSDs"],
          summary: "Xóa SSD [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
      },

      // ── PC Parts — VGAs ────────────────────────────────────────────
      "/pc-parts/vgas": {
        get: {
          tags: ["PC Parts - VGAs"],
          summary: "Lấy danh sách VGA",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  example: {
                    code: 1000,
                    result: [
                      {
                        id: "uuid",
                        name: "NVIDIA RTX 4090",
                        lengthMm: 336,
                        tdp: 450,
                        pcieVersionId: "PCIE_4",
                        powerConnector: "12VHPWR",
                        score: 30000,
                        description: null,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["PC Parts - VGAs"],
          summary: "Thêm VGA [ADMIN]",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VgaRequest" },
                examples: {
                  nvidia: {
                    summary: "NVIDIA GPU",
                    value: {
                      name: "NVIDIA RTX 4090",
                      lengthMm: 336,
                      tdp: 450,
                      pcieVersionId: "PCIE_4",
                      powerConnector: "12VHPWR",
                      score: 30000,
                      description:
                        "GPU NVIDIA Ada Lovelace, 24GB GDDR6X, flagship 2023",
                    },
                  },
                  amd: {
                    summary: "AMD GPU",
                    value: {
                      name: "AMD RX 7900 XTX",
                      lengthMm: 287,
                      tdp: 355,
                      pcieVersionId: "PCIE_4",
                      powerConnector: "2X8PIN",
                      score: 25000,
                      description:
                        "GPU AMD RDNA 3, 24GB GDDR6, flagship AMD 2023",
                    },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Tạo thành công" } },
        },
      },
      "/pc-parts/vgas/{id}": {
        get: {
          tags: ["PC Parts - VGAs"],
          summary: "Lấy chi tiết VGA",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
        put: {
          tags: ["PC Parts - VGAs"],
          summary: "Cập nhật VGA [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VgaRequest" },
              },
            },
          },
          responses: { 200: { description: "OK" } },
        },
        delete: {
          tags: ["PC Parts - VGAs"],
          summary: "Xóa VGA [ADMIN]",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: { 200: { description: "OK" } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
