const config = require("../config.json");
let geojson;
const coordinatesMod = require("./coordinates");

/**
 * Data Structures
 */
//Tableau associatif qui garde pour chaque coordonnée du réseau les
//arcs incidents pour atteindre ses coordonnées adjacents
let graph = null;
let sorted_longitudes = null;
let sorted_latitudes = null;
//Tableau qui retient pour chaque arc, sa distance et sa duration
let routes = null;

/**
 * Convert geojson data into data structures
 */
const convert = geojson_file => {
  geojson = require(`../geojsons/${config.icr_search.geojson}`);
  graph = {};
  routes = {};
  sorted_longitudes = new Set();
  sorted_latitudes = new Set();

  let features = geojson.features;

  for (let index = 0; index < features.length; index++) {
    let arrayCoordinates = features[index].geometry.coordinates;

    if (features[index].geometry.type === "LineString") {
      coordinates_2_graph(features[index].properties.icr, arrayCoordinates);
    } else if (features[index].geometry.type === "MultiLineString") {
      arrayCoordinates.forEach((coordinates, i1) => {
        coordinates_2_graph(features[index].properties.icr, coordinates);
      });
    } else {
      graph = null;
      throw new Error(config.error._501);
    }
  }
  sorted_longitudes = Array.from(sorted_longitudes).sort(
    (a, b) => a.longitude - b.longitude
  );
  sorted_latitudes = Array.from(sorted_latitudes).sort(
    (a, b) => a.latitude - b.latitude
  );
  exports.graph = graph;
  exports.sorted_latitudes = sorted_latitudes;
  exports.sorted_longitudes = sorted_longitudes;
  exports.routes = routes;
};

/**
 * Update the graph with a new icr path
 */
const coordinates_2_graph = (icr, coordinates) => {
  coordinates.forEach((coordinate, i2) => {
    if (coordinates[i2 + 1]) {
      let currDistance = Math.sqrt(
        (coordinate[0] - coordinates[i2 + 1][0]) *
          (coordinate[0] - coordinates[i2 + 1][0]) +
          (coordinate[1] - coordinates[i2 + 1][1]) *
            (coordinate[1] - coordinates[i2 + 1][1])
      );

      let distanceMeters = coordinatesMod.metersBetweenCoordinates(
        coordinate[0],
        coordinate[1],
        coordinates[i2 + 1][0],
        coordinates[i2 + 1][1]
      );

      let routeDuration = (distanceMeters / 1000 / 18) * 60;

      if (!graph[coordinate[0] + " " + coordinate[1]]) {
        graph[coordinate[0] + " " + coordinate[1]] = [];
        sorted_longitudes.add({
          longitude: coordinate[0],
          latitude: coordinate[1]
        });
        sorted_latitudes.add({
          longitude: coordinate[0],
          latitude: coordinate[1]
        });
      }
      graph[coordinate[0] + " " + coordinate[1]].push({
        longitude: coordinates[i2 + 1][0],
        latitude: coordinates[i2 + 1][1],
        destination: `${coordinates[i2 + 1][0]} ${coordinates[i2 + 1][1]}`,
        distance: currDistance,
        distanceMeters: distanceMeters,
        icr: icr
      });

      if (
        !routes[
          coordinate[0] +
            " " +
            coordinate[1] +
            " - " +
            coordinates[i2 + 1][0] +
            " " +
            coordinates[i2 + 1][1]
        ]
      ) {
        routes[
          coordinate[0] +
            " " +
            coordinate[1] +
            " - " +
            coordinates[i2 + 1][0] +
            " " +
            coordinates[i2 + 1][1]
        ] = {
          distance: currDistance,
          distanceMeters: distanceMeters,
          duration: routeDuration
        };
        routes[
          coordinates[i2 + 1][0] +
            " " +
            coordinates[i2 + 1][1] +
            " - " +
            coordinate[0] +
            " " +
            coordinate[1]
        ] = {
          distance: currDistance,
          distanceMeters: distanceMeters,
          duration: routeDuration
        };
      }

      if (!graph[coordinates[i2 + 1][0] + " " + coordinates[i2 + 1][1]]) {
        graph[coordinates[i2 + 1][0] + " " + coordinates[i2 + 1][1]] = [];
        sorted_longitudes.add({
          longitude: coordinates[i2 + 1][0],
          latitude: coordinates[i2 + 1][1]
        });
        sorted_latitudes.add({
          longitude: coordinates[i2 + 1][0],
          latitude: coordinates[i2 + 1][1]
        });
      }
      graph[coordinates[i2 + 1][0] + " " + coordinates[i2 + 1][1]].push({
        longitude: coordinate[0],
        latitude: coordinate[1],
        destination: `${coordinate[0]} ${coordinate[1]}`,
        distance: currDistance,
        distanceMeters: distanceMeters,
        icr: icr
      });
    }
  });
};

exports.graph = null;
exports.convert = convert;
exports.sorted_longitudes = null;
exports.sorted_latitudes = null;
exports.routes = null;
