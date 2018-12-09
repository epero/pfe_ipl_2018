var express = require("express");
var router = express.Router();
var fs = require("fs");

var graph = require("../my_modules/graph");
const ors = require("../my_modules/ors");

router.post("/", async function (req, res, next) {
  /**
   * req.body.coordinates expected format: [[longitude,latitude], [longitude,latitude]]
   * ex: [[4.353434, 50.850575], [4.450772, 50.849415]]
   */
  try {
    var json = req.body.coordinates;
    let startIcr = graph.closestEntryToNetwork(json[0], 100, 5);
    let endIcr = graph.closestEntryToNetwork(json[1], 100, 5);
    let geoJsonStart = await ors.calculate([json[0], startIcr]);
    geoJsonStart = geoJsonStart.features[0];
    geoJsonStart.properties.name = "ors";
    let geoJsonEnd = await ors.calculate([endIcr, json[1]]);
    geoJsonEnd = geoJsonEnd.features[0];
    geoJsonEnd.properties.name = "ors";
    let geoJsonIcr = graph.calculate({
      source_long: startIcr[0],
      source_lat: startIcr[1],
      dest_long: endIcr[0],
      dest_lat: endIcr[1]
    });
    geoJsonIcr.features[0] = geoJsonStart;
    geoJsonIcr.features.push(geoJsonEnd);
    res.json(geoJsonIcr);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;