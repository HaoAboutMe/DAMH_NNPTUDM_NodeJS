require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");
const seed = require("./schemas/seed");
const {
  sequelize,
  // Auth / User
  Role,
  RolePermission,
  User,
  Permission,
  // Lookup Tables (không có FK — sync trước)
  CoolerType,
  FormFactor,
  InterfaceType,
  PcieConnector,
  PcieVersion,
  RamType,
  Socket,
  SsdType,
  // Data Tables (có FK — sync sau)
  PcCase,
  Cooler,
  Cpu,
  Hdd,
  Mainboard,
  Psu,
  Ram,
  Ssd,
  Vga,
} = require("./schemas");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var pcPartsIdentityRouter = require("./routes/pcparts_identity");
// PC Parts — Data Tables
var pcCaseRouter = require("./routes/pc_case");
var coolerRouter = require("./routes/cooler");
var cpuRouter = require("./routes/cpu");
var hddRouter = require("./routes/hdd");
var mainboardRouter = require("./routes/mainboard");
var psuRouter = require("./routes/psu");
var ramRouter = require("./routes/ram");
var ssdRouter = require("./routes/ssd");
var vgaRouter = require("./routes/vga");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

sequelize
  .authenticate()
  .then(async () => {
    console.log("DB connected");

    // ── Bước 1: Auth tables ───────────────────────────────────────────
    // Dùng sync() không có alter — chỉ CREATE TABLE IF NOT EXISTS
    // Tránh lỗi ER_TOO_MANY_KEYS (MySQL giới hạn 64 indexes/bảng)
    await Permission.sync();
    await Role.sync();
    await RolePermission.sync();
    await User.sync();

    // ── Bước 2: PC Parts — Lookup Tables (Manual ID, không có FK) ─────
    await CoolerType.sync();
    await FormFactor.sync();
    await InterfaceType.sync();
    await PcieConnector.sync();
    await PcieVersion.sync();
    await RamType.sync();
    await Socket.sync();
    await SsdType.sync();

    // ── Bước 3: PC Parts — Data Tables (Auto UUID, có FK) ────────────
    await PcCase.sync();
    await Cooler.sync();
    await Cpu.sync();
    await Hdd.sync();
    await Mainboard.sync();
    await Psu.sync();
    await Ram.sync();
    await Ssd.sync();
    await Vga.sync();

    console.log("DB synced — all PC Part tables created");
    await seed();
  })
  .catch(console.error);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/pc-parts/identity", pcPartsIdentityRouter);
// PC Parts — Data Tables
app.use("/pc-parts/cases", pcCaseRouter);
app.use("/pc-parts/coolers", coolerRouter);
app.use("/pc-parts/cpus", cpuRouter);
app.use("/pc-parts/hdds", hddRouter);
app.use("/pc-parts/mainboards", mainboardRouter);
app.use("/pc-parts/psus", psuRouter);
app.use("/pc-parts/rams", ramRouter);
app.use("/pc-parts/ssds", ssdRouter);
app.use("/pc-parts/vgas", vgaRouter);

// Swagger UI — truy cập tại http://localhost:3000/api-docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "DoAn NodeJS API Docs",
    swaggerOptions: {
      persistAuthorization: true, // Giữ token sau khi refresh trang
    },
  }),
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
