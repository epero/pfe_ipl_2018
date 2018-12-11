const express = require("express");
const router = express.Router();
const fs = require("fs");

const graph = require("../my_modules/graph");
const ors = require("../my_modules/ors");
const coordinatesMod = require("../my_modules/coordinates");

router.post("/", async function(req, res, next) {
  /**
   * req.body.coordinates expected format: [[longitude,latitude], [longitude,latitude]]
   * ex: [[4.353434, 50.850575], [4.450772, 50.849415]]
   */
  let json = req.body.coordinates;
  find_directions(json)
    .then(geoJsonIcr => {
      res.json(geoJsonIcr);
    })
    .catch(error => {
      console.log(error);
      if (error.message === "invalid_user_input") {
        res.status(412).send(error);
      } else {
        res.status(500).send(error);
      }
    });
});

const find_directions = async coordinates => {
  /**
   * req.body.coordinates expected format: [[longitude,latitude], [longitude,latitude]]
   * ex: [[4.353434, 50.850575], [4.450772, 50.849415]]
   */
  //MIN LONG: 4.259079821011285
  //MAX LONG: 4.481428372975057
  //MIN LAT: 50.76388473111428
  //MAX LAT: 50.914058111020985
  const min_long = 4.259079821011285;
  const max_long = 4.481428372975057;
  const min_lat = 50.76388473111428;
  const max_lat = 50.914058111020985;
  if (
    !coordinates ||
    coordinates.length !== 2 ||
    coordinates[0].length !== 2 ||
    coordinates[1].length !== 2 ||
    isNaN(coordinates[0][0]) ||
    isNaN(coordinates[0][1]) ||
    isNaN(coordinates[1][0]) ||
    isNaN(coordinates[1][1])
  ) {
    throw new Error("invalid_user_input");
  }
  coordinates[0][0] = String(coordinates[0][0]);
  coordinates[0][1] = String(coordinates[0][1]);
  coordinates[1][0] = String(coordinates[1][0]);
  coordinates[1][1] = String(coordinates[1][1]);

  if (
    coordinates[0][0] < min_long ||
    coordinates[0][0] > max_long ||
    coordinates[1][0] < min_long ||
    coordinates[1][0] > max_long
  ) {
    throw new Error("invalid_user_input");
  }
  if (
    coordinates[0][1] < min_lat ||
    coordinates[0][1] > max_lat ||
    coordinates[1][1] < min_lat ||
    coordinates[1][1] > max_lat
  ) {
    throw new Error("invalid_user_input");
  }

  //checker si source et destination sont les mêmes
  if (
    coordinates[0][0] === coordinates[1][0] &&
    coordinates[0][1] === coordinates[1][1]
  ) {
    throw new Error("invalid_user_input");
  }
  //checker si distance entre source et

  console.log(
    "DS" +
      coordinatesMod.metersBetweenCoordinates(
        coordinates[0][0],
        coordinates[0][1],
        coordinates[1][0],
        coordinates[1][1]
      )
  );
  if (
    coordinatesMod.metersBetweenCoordinates(
      coordinates[0][0],
      coordinates[0][1],
      coordinates[1][0],
      coordinates[1][1]
    ) < 200
  ) {
    let geoJsonShortDistance = await ors.calculate(coordinates);
    geoJsonShortDistance.features[0].properties.icr = "ors";
    geoJsonShortDistance.features[0].properties.color = "#0000FF";
    return geoJsonShortDistance;
  }
  let json = coordinates;
  console.log(json);
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
  console.log(
    "FOR SHORTEST PATH : " +
      [
        startIcr.coordinates[0],
        startIcr.coordinates[1],
        endIcr.coordinates[0],
        endIcr.coordinates[1]
      ]
  );
  let geoJsonIcr = graph.calculate({
    source_long: startIcr.coordinates[0],
    source_lat: startIcr.coordinates[1],
    dest_long: endIcr.coordinates[0],
    dest_lat: endIcr.coordinates[1]
  });
  //ASYNC
  /*fs.writeFile(
    `./geojsons/francois-chapelle-icr-test.json`,
    JSON.stringify(geoJsonIcr, null, 2),
    "utf-8",
    err => {
      if (err) throw err;
    }
  );*/
  /*fs.writeFile(
    `./geojsons/timmer_arnold_icr_test.json`,
    JSON.stringify(geoJsonIcr, null, 2),
    "utf-8",
    err => {
      if (err) throw err;
    }
  );*/
  //res.json(geoJsonIcr);
  geoJsonIcr.features[0] = geoJsonStart;
  geoJsonIcr.features.push(geoJsonEnd);
  //ASYNC
  /*fs.writeFile(
    `./geojsons/francois-chapelle-test.json`,
    JSON.stringify(geoJsonIcr, null, 2),
    "utf-8",
    err => {
      if (err) throw err;
    }
  );*/
  //res.json(geoJsonIcr);
  /*fs.writeFile(
    `./geojsons/timmer_arnold_test.json`,
    JSON.stringify(geoJsonIcr, null, 2),
    "utf-8",
    err => {
      if (err) throw err;
    }
  );*/
  return geoJsonIcr;
};
module.exports = router;
module.exports.find_directions = find_directions;
