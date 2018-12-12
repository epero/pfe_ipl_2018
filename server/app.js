const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const assetPath = require("./asset_path.js");

const config = require("./config.json");

const indexRouter = require("./routes/index");
const testRouter = require("./routes/test");
const directionsRouter = require("./routes/directions");

const graph = require("./my_modules/graph");

const projectRoot = path.join(__dirname, "../..");
const serverRoot = path.join(__dirname, ".");

const app = express();

app.locals.assetPath = assetPath;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../../dist")));

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  let allowedOrigins = ["http://localhost:8080", "http://localhost:8100"];
  let origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//Set up the icr graph
graph.convert(config.icr_search.geojson);

//Set up out api paths
app.use("/", indexRouter);
app.use("/api/test", testRouter);
app.use("/api/directions", directionsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.json(err);
  //res.render("error");
});

module.exports = app;
