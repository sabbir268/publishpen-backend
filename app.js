const express = require("express");
const path = require("path");
const fs = require("fs");
const join = require("path").join;
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const appError = require("./utils/appError");
const errorHandle = require("./utils/errorHandle");

const models = join(__dirname, "./models");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

// Bootstrap models
fs.readdirSync(models)
    .filter((file) => ~file.search(/^[^.].*\.js$/))
    .forEach((file) => require(join(models, file)));

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api", authRouter);
app.use("/api/user", usersRouter);

module.exports = app;

console.log("App initiated...");

app.all("*", (req, res, next) => {
    next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandle);