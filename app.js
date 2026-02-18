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
  Role,
  RolePermission,
  User,
  Permission,
} = require("./schemas");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

sequelize
  .authenticate()
  .then(async () => {
    console.log("DB connected");
    await Permission.sync({ alter: true });
    await Role.sync({ alter: true });
    await RolePermission.sync({ alter: true });
    await User.sync({ alter: true });
    console.log("DB synced");
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
