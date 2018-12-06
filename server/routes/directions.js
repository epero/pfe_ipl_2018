var express = require("express");
var router = express.Router();

const graph = require("../my_modules/graph");

router.get("/", function(req, res, next) {
  res.json(graph.calculate(req.query));
});

module.exports = router;
