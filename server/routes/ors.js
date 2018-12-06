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
    .then(route => {
      let enhancedRoute={};
      enhancedRoute.geojson=route;
      enhancedRoute.start=json[0];
      enhancedRoute.end=json[1];
      res.json(enhancedRoute);
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;
