var express = require("express");
var router = express.Router();

const ors = require("../my_modules/ors");

router.post("/", function(req, res, next) {
  /**
   * req.body.coordinates expected format: [[longitude,latitude], [longitude,latitude]]
   * ex: [[4.353434, 50.850575], [4.450772, 50.849415]]
   */
  
  var json=req.body.coordinates
  ors
    .calculate(json)
    .then(geojson => {
      res.json(geojson);
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;
