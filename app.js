const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("express-handlebars");
const session = require("express-session");
const fileUpload = require("express-fileupload");

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const secretRouter = require("./routes/secret");
const { connect } = require("./config/connection");

const app = express();

// view engine setup

app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    // defaultView: 'layouts',
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.set('etag', false)

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(
  session({
    secret: "key",
    cookie:{
      maxAge:864000
    }
  })
);
connect((err) => {
  if (err) console.log("Error occured", err);
  else console.log("Database connected");
});

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/secret", secretRouter);

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
