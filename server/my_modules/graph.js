//var geojson  = require('../icr-2017-01-01');
//var geojson = require('../latlong_icr');
//var geojson = require('../icr-test-with-intersections')
var geojson = require("../icr-2017-01-01_mine");
//const SortedSet = require("collections/sorted-set");
//const SSet = require('sorted-set')
var fs = require("fs");
let graph = null;
let sorted_longitudes = null;
let sorted_latitudes = null;

const parse = () => {
  graph = {};
  sorted_longitudes = new Set();
  sorted_latitudes = new Set();

  let features = geojson.features;
  for (let index = 0; index < features.length; index++) {
    let arrayCoordinates = features[index].geometry.coordinates;
    if (features[index].geometry.type === "LineString") {
      coordinates_2_graph(features[index].properties.name, arrayCoordinates);
    } else if (features[index].geometry.type === "MultiLineString") {
      arrayCoordinates.forEach((coordinates, i1) => {
        coordinates_2_graph(features[index].properties.name, coordinates);
      });
    } else {
      graph = null;
      console.log("Unknown feature type");
      return;
    }
  }
  sorted_longitudes = Array.from(sorted_longitudes).sort(
    (a, b) => a.longitude - b.longitude
  );
  sorted_latitudes = Array.from(sorted_latitudes).sort(
    (a, b) => a.latitude - b.latitude
  );
  exports.graph = graph;
};

const coordinates_2_graph = (icr, coordinates) => {
  coordinates.forEach((coordinate, i2) => {
    if (coordinates[i2 + 1]) {
      let currDistance = Math.sqrt(
        (coordinate[0] - coordinates[i2 + 1][0]) *
        (coordinate[0] - coordinates[i2 + 1][0]) +
        (coordinate[1] - coordinates[i2 + 1][1]) *
        (coordinate[1] - coordinates[i2 + 1][1])
      );

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
        icr: icr
      });

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
        icr: icr
      });
    }
  });
};

const calculate = coordinates => {
  let distances = new Map();
  let etiqProv = new Set();

  let etiqDef = new Set();
  let arbre = new Map();

  const source = coordinates.source_long + " " + coordinates.source_lat;
  const destination = coordinates.dest_long + " " + coordinates.dest_lat;
  distances[source] = 0;
  etiqDef.add(source); //REVOIR
  let current = source;
  let found = true;

  while (current !== destination) {
    for (let i = 0; i < graph[current].length; i++) {
      let outRoute = graph[current][i];
      let currentDestination = outRoute.longitude + " " + outRoute.latitude;
      if (!etiqDef.has(currentDestination)) {
        let currentDistance = distances[current] + outRoute.distance;
        if (!etiqProv.has(currentDestination)) {
          distances[currentDestination] = currentDistance;
          etiqProv.add(currentDestination);
          arbre.set(currentDestination, current);
        } else if (distances[currentDestination] > currentDistance) {
          distances[currentDestination] = currentDistance;
          etiqProv.add(currentDestination);
          arbre.set(currentDestination, current);
        }
      }
    }

    if (etiqProv.size === 0) {
      found = false;
      break;
    }
    let sorted = Array.from(etiqProv).sort((a, b) => {
      if (distances[a] === distances[b]) return a - b;
      return distances[a] - distances[b];
    });
    current = sorted[0];
    etiqProv.delete(current);
    etiqDef.add(current);
  }

  if (found) {
    let shortestPath = [];

    let currentSource = destination;
    while (currentSource !== source) {
      shortestPath.unshift(currentSource);
      currentSource = arbre.get(currentSource);
    }
    shortestPath.unshift(source);
    return path_to_geojson(shortestPath);
  }
  console.log("FOUND : " + found);
};

const path_to_geojson = path => {
  let geoJsonOutput = {
    type: "FeatureCollection",
    features: [
      []
    ]
  };

  let possIcr = new Array(path.length - 1);

  for (let i = 0; i < path.length - 1; i++) {
    possIcr[i] = new Set();
    let route = path[i];
    let nextRoute = path[i + 1];

    for (let j = 0; j < graph[route].length; j++) {
      if (nextRoute === graph[route][j].destination) {
        possIcr[i].add(graph[route][j].icr);
      }
    }

    let samePrev = new Set();
    for (let curIcr of possIcr[i]) {
      if (i > 0 && possIcr[i - 1].has(curIcr)) {
        samePrev.add(curIcr);
      }
    }
    if (samePrev.size > 0) {
      possIcr[i] = samePrev;
    }
  }

  let choosenIcr = new Array(possIcr.length);

  for (let i = possIcr.length - 1; i >= 0; i--) {
    let currPossIcr = possIcr[i];
    if (currPossIcr.size === 1) {
      choosenIcr[i] = Array.from(currPossIcr)[0];
    } else if (i < possIcr.length - 1 && currPossIcr.has(choosenIcr[i + 1])) {
      choosenIcr[i] = choosenIcr[i + 1];
    } else {
      choosenIcr[i] = Array.from(currPossIcr)[0];
    }
  }

  geoJsonOutput.features.push({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: []
    },
    properties: {
      name: choosenIcr[0]
    }
  });
  let featuresInd = 1;
  let currentFeature = geoJsonOutput.features[featuresInd];
  currentFeature.geometry.coordinates.push([
    parseFloat(path[0].split(" ")[0]),
    parseFloat(path[0].split(" ")[1])
  ]);

  let previousCoor;
  for (let i = 0; i < choosenIcr.length; i++) {
    let nextCoor = [
      parseFloat(path[i + 1].split(" ")[0]),
      parseFloat(path[i + 1].split(" ")[1])
    ];
    if (choosenIcr[i] === currentFeature.properties.name) {
      currentFeature.geometry.coordinates.push(nextCoor);
    } else {
      geoJsonOutput.features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: []
        },
        properties: {
          name: choosenIcr[i]
        }
      });
      featuresInd++;
      currentFeature = geoJsonOutput.features[featuresInd];
      currentFeature.geometry.coordinates.push(previousCoor);
      currentFeature.geometry.coordinates.push(nextCoor);
    }
    previousCoor = nextCoor;
  }
  /*fs.writeFile(
    "./exemple2017.json",
    JSON.stringify(geoJsonOutput, null, 2),
    "utf-8"
  );*/
  return geoJsonOutput;
};

const closestEntryToNetwork = (coordinate, range, precision) => {
  let src_long = coordinate[0];
  let src_lat = coordinate[1];
  //console.log("REceived : " + src_long + "  " + src_lat);
  //const precision = 7;
  //const range = 100;
  let regexLong = new RegExp("^" + src_long.substring(0, precision));
  let regexLat = new RegExp("^" + src_lat.substring(0, precision));
  //console.log("REGEX LONG  : " + regexLong);
  //console.log("REGEX LAT : " + regexLat);
  //let search_ind = ~~(src_long.length / 2);

  let search_ind_long = Math.floor(sorted_longitudes.length / 2);
  let search_ind_min = 0;
  let search_ind_max = sorted_longitudes.length - 1;
  let search_long = sorted_longitudes[search_ind_long];

  while (!String(search_long.longitude).match(regexLong)) {
    if (search_long.longitude > src_long) {
      search_ind_max = search_ind_long;
      //console.log();
    } else {
      search_ind_min = search_ind_long;
    }
    search_ind_long = Math.floor((search_ind_max + search_ind_min) / 2);
    //console.log("MAX : " + search_ind_max);
    //console.log("MIN : " + search_ind_min);
    //console.log(search_ind_long);
    //console.log(search_long);
    search_long = sorted_longitudes[search_ind_long];
  }

  let search_ind_lat = Math.floor(sorted_latitudes.length / 2);
  search_ind_min = 0;
  search_ind_max = sorted_latitudes.length - 1;
  let search_lat = sorted_latitudes[search_ind_lat];

  while (!String(search_lat.latitude).match(regexLat)) {
    if (search_lat.latitude > src_lat) {
      search_ind_max = search_ind_lat;
    } else {
      search_ind_min = search_ind_lat;
    }
    search_ind_lat = Math.floor((search_ind_max + search_ind_min) / 2);
    //console.log(search_ind_long);
    search_lat = sorted_latitudes[search_ind_lat];
  }

  //console.log("FOUND FOR LONGITUDE : " + search_long.longitude);
  //console.log("FOUND FOR LATITUDE : " + search_lat.latitude);

  let search_ind_long_min = search_ind_long - range;
  if (search_ind_long_min < 0) search_ind_long_min = 0;
  let search_ind_long_max = search_ind_long + range;
  if (search_ind_long_max >= sorted_longitudes.length)
    search_ind_long_max = sorted_longitudes.length - 1;

  let potentialLongitudes = sorted_longitudes.slice(
    search_ind_long_min,
    search_ind_long_max
  );
  //  .map(a => `${a.longitude} ${a.latitude}`);

  let search_ind_lat_min = search_ind_lat - range;
  if (search_ind_lat_min < 0) search_ind_lat_min = 0;
  let search_ind_lat_max = search_ind_lat + range;
  if (search_ind_lat_max >= sorted_latitudes.length)
    search_ind_lat_max = sorted_latitudes.length - 1;
  let potentialLatitudes = sorted_latitudes
    .slice(search_ind_lat_min, search_ind_lat_max)
    .map(a => `${a.longitude} ${a.latitude}`);

  potentialLatitudes = new Set(potentialLatitudes);

  let potentialEntries = potentialLongitudes.filter(value =>
    potentialLatitudes.has(`${value.longitude} ${value.latitude}`)
  );
  //console.log(potentialEntries);
  if (potentialEntries.length === 0) {
    console.log("No entry found ... Searching within a bigger range");
    return closestEntryToNetwork(coordinate, range * 2, precision);
  }

  let minDistance;
  let minIndex;
  for (let index = 0; index < potentialEntries.length; index++) {
    //console.log(potentialEntries[index]);
    let currDistance = Math.sqrt(
      (src_long - potentialEntries[index].longitude) *
      (src_long - potentialEntries[index].longitude) +
      (src_lat - potentialEntries[index].latitude) *
      (src_lat - potentialEntries[index].latitude)
    );
    if (!minDistance || currDistance < minDistance) {
      minDistance = currDistance;
      minIndex = index;
    }
    console.log("CLOSEST entry : " + potentialEntries[minIndex]);
    return [
      potentialEntries[minIndex].longitude,
      potentialEntries[minIndex].latitude
    ];
  }
};

//const binary_search = (arr, source, )

exports.graph = null;
exports.parse = parse;
exports.calculate = calculate;
exports.closestEntryToNetwork = closestEntryToNetwork;