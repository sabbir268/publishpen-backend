const express = require("express");
const path = require("path");
const fs = require("fs");
const join = require("path").join;
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const models = join(__dirname, "./models");

// const indexRouter = require("./routes/index");
// const usersRouter = require("./routes/users");

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

// app.use("/api/", indexRouter);
// app.use("/api/users", usersRouter);

module.exports = app;