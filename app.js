const express = require("express");
const path = require("path");
const fs = require("fs");
const join = require("path").join;
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const appError = require("./utils/appError");
const HttpException = require("./utils/httpException");
const errorHandle = require("./utils/errorHandle");

const models = join(__dirname, "./models");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/category");

// Bootstrap models
fs.readdirSync(models)
    .filter((file) => ~file.search(/^[^.].*\.js$/))
    .forEach((file) => require(join(models, file)));

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.set('view engine', 'html');
// app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/category", categoryRouter);

module.exports = app;

console.log("App initiated...");

app.all("*", (req, res, next) => {
    const err = new HttpException(404, "failed", "Endpoint not found");
    next(err);
});
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    console.log(err);
    // render the error page
    // res.status(err.status || 500);
    res.send(err.message);
});

// app.use(errorHandle);