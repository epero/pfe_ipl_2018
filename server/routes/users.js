var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  req.body.info = "users";
  res.json(req.body);
});

module.exports = router;
