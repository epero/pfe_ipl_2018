var express = require("express");
var router = express.Router();
var fs = require("fs");

var graph = require("../my_modules/graph");
const ors = require("../my_modules/ors");

router.post("/", async function(req, res, next) {
  /**
   * req.body.coordinates expected format: [[longitude,latitude], [longitude,latitude]]
   * ex: [[4.353434, 50.850575], [4.450772, 50.849415]]
   */
  try {
    var json = req.body.coordinates;
    let startIcr = graph.closestEntryToNetwork(json[0], 400, 6);
    let endIcr = graph.closestEntryToNetwork(json[1], 400, 6);
    console.log("entry point in icr : " + startIcr.distance);
    console.log("exit icr point s: " + endIcr.distance);
    //let startTest = graph.closestEntryToNetworkSlow(json[0]);
    //let endTest = graph.closestEntryToNetworkSlow(json[1]);
    //console.log("entry point TEST in icr : " + startTest.distance);
    //console.log("exit icr point TEST: " + endTest.distance);

    let geoJsonStart = await ors.calculate([json[0], startIcr.coordinates]);
    geoJsonStart = geoJsonStart.features[0];
    //TODO a mettre dans module ors
    geoJsonStart.properties.icr = "ors";
    geoJsonStart.properties.color = "#0000FF";
    let geoJsonEnd = await ors.calculate([endIcr.coordinates, json[1]]);
    geoJsonEnd = geoJsonEnd.features[0];
    //TODO a mettre dans module ors
    geoJsonEnd.properties.icr = "ors";
    geoJsonEnd.properties.color = "#0000FF";
    let geoJsonIcr = graph.calculate({
      source_long: startIcr.coordinates[0],
      source_lat: startIcr.coordinates[1],
      dest_long: endIcr.coordinates[0],
      dest_lat: endIcr.coordinates[1]
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
