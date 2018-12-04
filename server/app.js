const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const assetPath = require('./asset_path.js');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const orsRouter = require("./routes/ors");
const directionsRouter = require("./routes/directions");


//const bl72_parseur = require('./my_modules/bl72_parseur');
const graph = require('./my_modules/graph');

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
app.use(
  sassMiddleware({
    src: path.join(serverRoot, "public"),
    dest: path.join(serverRoot, "public"),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../../dist")));

//TODO chargement graphe en mémoire
//bl72_parseur.parse()
graph.parse();

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
