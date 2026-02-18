# Tài Liệu Tổng Hợp Các Entity - Build PC Checker

## 📋 Tổng Quan

Tài liệu này tổng hợp tất cả các entity trong hệ thống Build PC Checker, phân loại theo cách thức tạo ID và mục đích sử dụng.

---

## 🔑 Phân Loại Theo Cách Tạo ID

### 1️⃣ Entity với ID do Người Dùng Nhập (Manual ID)

Đây là các entity **lookup/reference tables** - các bảng tra cứu với giá trị cố định, ID được định nghĩa trước.

| Entity | Table Name | ID Type | Ví Dụ ID | Mô Tả |
|--------|-----------|---------|-----------|-------|
| **CoolerType** | `cooler_type` | String | `AIR`, `AIO` | Loại tản nhiệt |
| **FormFactor** | `form_factor` | String | `FF_2_5`, `FF_3_5`, `M2_2280`, `M2_2260`, `M2_2242` | Kích thước/Hình dạng linh kiện |
| **InterfaceType** | `interface_type` | String | `SATA_3`, `SAS`, `PCIE_3`, `PCIE_4`, `PCIE_5` | Loại giao tiếp kết nối |
| **PcieConnector** | `pcie_connector` | String | `2X8PIN`, `3X8PIN`, `12VHPWR`, `16PIN` | Loại connector nguồn PCIe |
| **PcieVersion** | `pcie_version` | String | `PCIE_3`, `PCIE_4`, `PCIE_5` | Phiên bản PCIe |
| **RamType** | `ram_type` | String | `DDR4`, `DDR5` | Loại RAM |
| **Socket** | `socket` | String | `AM4`, `AM5`, `LGA1700` | Loại socket CPU |
| **SsdType** | `ssd_type` | String | `SATA`, `NVME` | Loại SSD |

#### 📝 Đặc Điểm:
- ✅ ID được định nghĩa trước bởi hệ thống
- ✅ Người dùng **PHẢI** nhập ID khi tạo mới
- ✅ ID thường là **hằng số** (constants) như enum
- ✅ Số lượng bản ghi **ít và cố định**
- ✅ Không dùng `@GeneratedValue`

#### 🔧 Request Mẫu:
```json
// Tạo SsdType
{
  "id": "NVME",
  "name": "NVMe"
}

// Tạo FormFactor
{
  "id": "M2_2280",
  "name": "M.2 2280"
}

// Tạo Socket
{
  "id": "AM5",
  "name": "AMD AM5"
}
```

---

### 2️⃣ Entity với ID Tự Động (Auto-Generated UUID)

Đây là các entity **data tables** - các bảng dữ liệu chính, ID được tự động sinh bởi hệ thống.

| Entity | Table Name | ID Type | Generation Strategy | Mô Tả |
|--------|-----------|---------|---------------------|-------|
| **Case (PcCase)** | `pc_case` | String (UUID) | `GenerationType.UUID` | Vỏ case máy tính |
| **Cooler** | `cooler` | String (UUID) | `GenerationType.UUID` | Tản nhiệt CPU |
| **Cpu** | `cpu` | String (UUID) | `GenerationType.UUID` | Bộ vi xử lý |
| **Hdd** | `hdd` | String (UUID) | `GenerationType.UUID` | Ổ cứng HDD |
| **Mainboard** | `mainboard` | String (UUID) | `GenerationType.UUID` | Bo mạch chủ |
| **Psu** | `psu` | String (UUID) | `GenerationType.UUID` | Nguồn máy tính |
| **Ram** | `ram` | String (UUID) | `GenerationType.UUID` | Bộ nhớ RAM |
| **Ssd** | `ssd` | String (UUID) | `GenerationType.UUID` | Ổ cứng SSD |
| **Vga** | `vga` | String (UUID) | `GenerationType.UUID` | Card đồ họa |

#### 📝 Đặc Điểm:
- ✅ ID được **tự động sinh** bởi database
- ✅ Người dùng **KHÔNG** nhập ID khi tạo
- ✅ Số lượng bản ghi **nhiều và thay đổi**
- ✅ Sử dụng annotation `@GeneratedValue(strategy = GenerationType.UUID)`

#### 🔧 Request Mẫu:
```json
// Tạo SSD - KHÔNG cần trường id
{
  "name": "Samsung 980 PRO 1TB",
  "ssdTypeId": "NVME",
  "formFactorId": "M2_2280",
  "interfaceTypeId": "PCIE_4",
  "capacity": 1000,
  "tdp": 7,
  "description": "High-speed NVMe SSD with PCIe 4.0"
}

// Tạo HDD - KHÔNG cần trường id
{
  "name": "Seagate Barracuda 2TB",
  "formFactorId": "FF_3_5",
  "interfaceTypeId": "SATA_3",
  "capacity": 2000,
  "tdp": 6,
  "description": "7200 RPM HDD"
}
```

---

## 🗂️ Chi Tiết Các Entity

### 🔵 Nhóm Linh Kiện Lưu Trữ (Storage Components)

#### 1. **SSD** (Solid State Drive)
- **ID:** Auto-generated UUID
- **Bảng:** `ssd`
- **Quan hệ:**
  - `ssdType` → **SsdType** (SATA/NVME) [Manual ID]
  - `formFactor` → **FormFactor** (2.5", M.2) [Manual ID]
  - `interfaceType` → **InterfaceType** (SATA_3, PCIE_3/4/5) [Manual ID]
  
```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
String id;
String name;
@ManyToOne SsdType ssdType;
@ManyToOne FormFactor formFactor;
@ManyToOne InterfaceType interfaceType;
Integer capacity;  // GB
Integer tdp;       // W
String description;
```

#### 2. **HDD** (Hard Disk Drive)
- **ID:** Auto-generated UUID
- **Bảng:** `hdd`
- **Quan hệ:**
  - `formFactor` → **FormFactor** (3.5", 2.5") [Manual ID]
  - `interfaceType` → **InterfaceType** (SATA_3, SAS) [Manual ID]

```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
String id;
String name;
@ManyToOne FormFactor formFactor;
@ManyToOne InterfaceType interfaceType;
Integer capacity;  // GB
Integer tdp;       // W
String description;
```

---

### 🔵 Nhóm Bảng Tra Cứu Lưu Trữ (Storage Lookup Tables)

#### 3. **SsdType**
- **ID:** Manual (User Input)
- **Bảng:** `ssd_type`
- **Giá trị:** `SATA`, `NVME`

```java
@Id
String id;
String name;
```

#### 4. **FormFactor** 
- **ID:** Manual (User Input)
- **Bảng:** `form_factor`
- **Giá trị:** `FF_2_5`, `FF_3_5`, `M2_2280`, `M2_2260`, `M2_2242`

```java
@Id
String id;
String name;
```

#### 5. **InterfaceType**
- **ID:** Manual (User Input)
- **Bảng:** `interface_type`
- **Giá trị:** `SATA_3`, `SAS`, `PCIE_3`, `PCIE_4`, `PCIE_5`

```java
@Id
String id;
String name;
```

---

### 🔵 Nhóm Linh Kiện Case & Cooling

#### 6. **PcCase** (Case)
- **ID:** Auto-generated UUID
- **Bảng:** `pc_case`

```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
String id;
String name;
String size;                // ATX / mATX / ITX
Integer maxVgaLengthMm;
Integer maxCoolerHeightMm;
Integer maxRadiatorSize;
Integer drive35Slot;
Integer drive25Slot;
String description;
```

#### 7. **Cooler**
- **ID:** Auto-generated UUID
- **Bảng:** `cooler`
- **Quan hệ:**
  - `coolerType` → **CoolerType** (AIR/AIO) [Manual ID]

```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
String id;
String name;
@ManyToOne CoolerType coolerType;
Integer radiatorSize;  // 120/240/360 (nullable cho tản khí)
Integer heightMm;      // chiều cao tản khí
Integer tdpSupport;    // W
String description;
```

#### 8. **CoolerType**
- **ID:** Manual (User Input)
- **Bảng:** `cooler_type`
- **Giá trị:** `AIR`, `AIO`

```java
@Id
String id;
String name;
```

---

### 🔵 Nhóm Linh Kiện CPU & Mainboard

#### 9. **Cpu**
- **ID:** Auto-generated UUID
- **Bảng:** `cpu`
- **Quan hệ:**
  - `socket` → **Socket** [Manual ID]
  - `pcieVersion` → **PcieVersion** [Manual ID]

```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
String id;
String name;
@ManyToOne Socket socket;
Integer vrmMin;
Boolean igpu;
Integer tdp;
@ManyToOne PcieVersion pcieVersion;
Integer score;
String description;
```

#### 10. **Mainboard**
- **ID:** Auto-generated UUID
- **Bảng:** `mainboard`
- **Quan hệ:**
  - `socket` → **Socket** [Manual ID]
  - `ramType` → **RamType** [Manual ID]
  - `pcieVgaVersion` → **PcieVersion** [Manual ID]

```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
String id;
String name;
@ManyToOne Socket socket;
Integer vrmPhase;
Integer cpuTdpSupport;
@ManyToOne RamType ramType;
Integer ramBusMax;
Integer ramSlot;
Integer ramMaxCapacity;
String size;
@ManyToOne PcieVersion pcieVgaVersion;
Integer m2Slot;
Integer sataSlot;
String description;
```

#### 11. **Socket**
- **ID:** Manual (User Input)
- **Bảng:** `socket`
- **Giá trị:** `AM4`, `AM5`, `LGA1700`

```java
@Id
String id;
String name;
```

---

### 🔵 Nhóm Linh Kiện RAM

#### 12. **Ram**
- **ID:** Auto-generated UUID
- **Bảng:** `ram`
- **Quan hệ:**
  - `ramType` → **RamType** [Manual ID]

```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
String id;
String name;
@ManyToOne RamType ramType;
Integer ramBus;
Integer ramCas;
Integer capacityPerStick;
Integer quantity;
Integer tdp;
String description;
```

#### 13. **RamType**
- **ID:** Manual (User Input)
- **Bảng:** `ram_type`
- **Giá trị:** `DDR4`, `DDR5`

```java
@Id
String id;
String name;
```

---

### 🔵 Nhóm Linh Kiện PSU & VGA

#### 14. **Psu** (Power Supply Unit)
- **ID:** Auto-generated UUID
- **Bảng:** `psu`
- **Quan hệ:**
  - `pcieConnector` → **PcieConnector** (nullable) [Manual ID]

```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
String id;
String name;
Integer wattage;              // W
String efficiency;            // 80+ Bronze / Gold / Platinum
@ManyToOne PcieConnector pcieConnector;  // nullable
Integer sataConnector;
String description;
```

#### 15. **Vga** (Graphics Card)
- **ID:** Auto-generated UUID
- **Bảng:** `vga`
- **Quan hệ:**
  - `pcieVersion` → **PcieVersion** [Manual ID]

```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
String id;
String name;
Integer lengthMm;
Integer tdp;
@ManyToOne PcieVersion pcieVersion;
String powerConnector;
Integer score;
String description;
```

#### 16. **PcieConnector**
- **ID:** Manual (User Input)
- **Bảng:** `pcie_connector`
- **Giá trị:** `2X8PIN`, `3X8PIN`, `12VHPWR`, `16PIN`

```java
@Id
String id;
String name;
```

#### 17. **PcieVersion**
- **ID:** Manual (User Input)
- **Bảng:** `pcie_version`
- **Giá trị:** `PCIE_3`, `PCIE_4`, `PCIE_5`

```java
@Id
String id;
String name;
```

---

## 📊 Bảng Tổng Hợp

### ✅ Entities với Manual ID (8 entities)

| # | Entity | ID Examples | Endpoint Pattern |
|---|--------|-------------|------------------|
| 1 | CoolerType | `AIR`, `AIO` | `/identity/cooler-types` |
| 2 | FormFactor | `FF_2_5`, `M2_2280` | `/identity/form-factors` |
| 3 | InterfaceType | `SATA_3`, `PCIE_4` | `/identity/interface-types` |
| 4 | PcieConnector | `2X8PIN`, `12VHPWR` | `/identity/pcie-connectors` |
| 5 | PcieVersion | `PCIE_3`, `PCIE_4` | `/identity/pcie-versions` |
| 6 | RamType | `DDR4`, `DDR5` | `/identity/ram-types` |
| 7 | Socket | `AM4`, `AM5` | `/identity/sockets` |
| 8 | SsdType | `SATA`, `NVME` | `/identity/ssd-types` |

### ✅ Entities với Auto-Generated UUID (9 entities)

| # | Entity | Endpoint Pattern |
|---|--------|------------------|
| 1 | Case (PcCase) | `/pc-parts/cases` |
| 2 | Cooler | `/pc-parts/coolers` |
| 3 | Cpu | `/pc-parts/cpus` |
| 4 | Hdd | `/pc-parts/hdds` |
| 5 | Mainboard | `/pc-parts/mainboards` |
| 6 | Psu | `/pc-parts/psus` |
| 7 | Ram | `/pc-parts/rams` |
| 8 | Ssd | `/pc-parts/ssds` |
| 9 | Vga | `/pc-parts/vgas` |

---

## 🎯 Quy Tắc Sử Dụng

### 📌 Khi Tạo Lookup Tables (Manual ID)

```json
POST /identity/ssd-types
{
  "id": "NVME",        // ✅ BẮT BUỘC nhập ID
  "name": "NVMe"
}
```

### 📌 Khi Tạo Data Tables (Auto UUID)

```json
POST /pc-parts/ssds
{
  // ❌ KHÔNG nhập trường "id"
  "name": "Samsung 980 PRO",
  "ssdTypeId": "NVME",           // ✅ Tham chiếu đến lookup table
  "formFactorId": "M2_2280",     // ✅ Tham chiếu đến lookup table
  "interfaceTypeId": "PCIE_4",   // ✅ Tham chiếu đến lookup table
  "capacity": 1000,
  "tdp": 7
}

// Response sẽ có id tự động:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",  // ✅ UUID tự động
  "name": "Samsung 980 PRO",
  ...
}
```

---

## 🔗 Mối Quan Hệ Giữa Các Entity

### 📦 Storage Components
```
SSD ──┬──> SsdType (Manual ID)
      ├──> FormFactor (Manual ID)
      └──> InterfaceType (Manual ID)

HDD ──┬──> FormFactor (Manual ID)
      └──> InterfaceType (Manual ID)
```

### 💨 Cooling Components
```
Cooler ──> CoolerType (Manual ID)
```

### 🖥️ Core Components
```
CPU ──┬──> Socket (Manual ID)
      └──> PcieVersion (Manual ID)

Mainboard ──┬──> Socket (Manual ID)
            ├──> RamType (Manual ID)
            └──> PcieVersion (Manual ID)

Ram ──> RamType (Manual ID)
```

### ⚡ Power & Graphics
```
PSU ──> PcieConnector (Manual ID, nullable)

VGA ──> PcieVersion (Manual ID)
```

---

## 📝 Lưu Ý Quan Trọng

### ⚠️ Thứ Tự Khởi Tạo Dữ Liệu

1. **Bước 1:** Tạo tất cả Lookup Tables (Manual ID) trước
   - CoolerType, FormFactor, InterfaceType
   - PcieConnector, PcieVersion, RamType
   - Socket, SsdType

2. **Bước 2:** Tạo Data Tables (Auto UUID) sau
   - Case, Cooler, Cpu, Hdd
   - Mainboard, Psu, Ram, Ssd, Vga

### 🔒 Ràng Buộc (Constraints)

- Các trường có `@ManyToOne` với `nullable = false` **BẮT BUỘC** phải có giá trị
- Chỉ `PSU.pcieConnector` là nullable (một số PSU không có PCIe connector)
- Tất cả các `name` fields đều `nullable = false`

### 🚫 Lỗi Thường Gặp

1. **"Column 'form_factor_id' cannot be null"**
   - ❌ Thiếu trường `formFactorId` trong request
   - ✅ Đảm bảo tất cả foreign keys có giá trị hợp lệ

2. **"SSD_TYPE_ALREADY_EXISTS"**
   - ❌ Đang tạo lookup table với ID đã tồn tại
   - ✅ Kiểm tra ID trước khi tạo

3. **"Cannot add or update a child row: a foreign key constraint fails"**
   - ❌ Đang tham chiếu đến ID không tồn tại
   - ✅ Tạo lookup table trước khi tham chiếu

---

## 📚 Tài Liệu Liên Quan

- `FORM_FACTOR_README.md` - Chi tiết về Form Factor entity
- `INTERFACE_TYPE_API_EXAMPLES.md` - Ví dụ API Interface Type
- `POSTMAN_TESTING_GUIDE.md` - Hướng dẫn test API với Postman
- `Entity.md` - Thiết kế ban đầu của entities

---

## 📅 Lịch Sử Thay Đổi

- **2026-02-14:** Chuyển đổi HddInterface và SsdInterface thành InterfaceType
- **2026-02-14:** Chuyển đổi String formFactor thành entity FormFactor
- **2026-02-13:** Tái cấu trúc HDD và SSD entities

---

**Ngày cập nhật:** 2026-02-18
**Phiên bản:** 1.0

