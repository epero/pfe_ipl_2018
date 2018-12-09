const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const assetPath = require('./asset_path.js');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const orsRouter = require("./routes/ors");
const directionsRouter = require("./routes/directions");


//const bl72_parseur = require('./my_modules/bl72_parseur');
const graph = require('./my_modules/graph');
const find_intersections = require('./my_modules/find_intersections');

const projectRoot = path.join(__dirname, '../..');
const serverRoot = path.join(__dirname, '.');

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

//TODO chargement graphe en mémoire
//bl72_parseur.parse()
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

graph.parse();
//find_intersections.parse();

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/ors-directions", orsRouter);
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
  res.render("error");
});


module.exports = app;
