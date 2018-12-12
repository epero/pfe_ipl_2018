var geojson = require("../geojsons/icr-with-colors");
const irc_2_color = require("./icr_2_color");
const coordinatesMod = require("./coordinates");
const binary_heap = require("./binary_heap");

var fs = require("fs");
let graph = null;
let sorted_longitudes = null;
let sorted_latitudes = null;
let routes = null;

const init = () => {
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

const calculate = coordinates => {
  let distances = new Map();
  let etiqProv = new Set();

  /*binary_heap.init((a, b) => {
    console.log("lalala");
    if (distances[a] === distances[b]) return a - b;
    if (distances[a] - distances[b] < 0) return true;
    return false;
  });*/

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

          //binary_heap.insert(currentDestination);

          arbre.set(currentDestination, current);
        } else if (distances[currentDestination] > currentDistance) {
          distances[currentDestination] = currentDistance;
          etiqProv.add(currentDestination);

          //binary_heap.insert(currentDestination);

          arbre.set(currentDestination, current);
        }
      }
    }

    if (etiqProv.size === 0) {
      found = false;
      break;
    }
    /*let sorted = Array.from(etiqProv).sort((a, b) => {
      if (distances[a] === distances[b]) return a - b;
      return distances[a] - distances[b];
    });*/
    let min;
    for (let ccc of etiqProv) {
      if (!min || distances[ccc] < distances[min]) {
        min = ccc;
      }
    }
    current = min;
    /*console.log("checkst");
    while (!binary_heap.isEmpty()) {
      console.log("mah : " + distances[binary_heap.delMax()]);
    }
    console.log("checkend");*/

    //let currBis = binary_heap.delMax();

    /*while (etiqDef.has(currBis)) {
      console.log("DELETE");
      currBis = binary_heap.delMax();
    }*/
    //console.log("CURRENT : " + current);
    //console.log("CURRENT DIS : " + distances[current]);
    //console.log("CURRBISS : " + currBis);

    //console.log("CURRBISS DIS : " + distances[currBis]);
    //current = sorted[0];
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
  //console.log("FOUND : " + found);
};

const path_to_geojson = path => {
  let geoJsonOutput = {
    type: "FeatureCollection",
    features: [[]]
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
      icr: choosenIcr[0],
      color: irc_2_color.get(choosenIcr[0])
    }
  });
  let featuresInd = 1;
  let currentFeature = geoJsonOutput.features[featuresInd];
  let currDistanceMeters = 0;
  let currDuration = 0;

  currentFeature.geometry.coordinates.push([
    parseFloat(path[0].split(" ")[0]),
    parseFloat(path[0].split(" ")[1])
  ]);

  let previousCoor = [
    parseFloat(path[0].split(" ")[0]),
    parseFloat(path[0].split(" ")[1])
  ];
  for (let i = 0; i < choosenIcr.length; i++) {
    let nextCoor = [
      parseFloat(path[i + 1].split(" ")[0]),
      parseFloat(path[i + 1].split(" ")[1])
    ];
    currDistanceMeters +=
      routes[
        previousCoor[0] +
          " " +
          previousCoor[1] +
          " - " +
          nextCoor[0] +
          " " +
          nextCoor[1]
      ].distanceMeters;
    currDuration +=
      routes[
        previousCoor[0] +
          " " +
          previousCoor[1] +
          " - " +
          nextCoor[0] +
          " " +
          nextCoor[1]
      ].duration;
    if (choosenIcr[i] === currentFeature.properties.icr) {
      currentFeature.geometry.coordinates.push(nextCoor);
    } else {
      currentFeature.properties["distance"] = currDistanceMeters;
      currentFeature.properties["duration"] = currDuration;

      geoJsonOutput.features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: []
        },
        properties: {
          icr: choosenIcr[i],
          color: irc_2_color.get(choosenIcr[i])
        }
      });
      featuresInd++;
      currentFeature = geoJsonOutput.features[featuresInd];
      currentFeature.geometry.coordinates.push(previousCoor);
      currentFeature.geometry.coordinates.push(nextCoor);
      currDistanceMeters =
        routes[
          previousCoor[0] +
            " " +
            previousCoor[1] +
            " - " +
            nextCoor[0] +
            " " +
            nextCoor[1]
        ].distanceMeters;
      currDuration =
        routes[
          previousCoor[0] +
            " " +
            previousCoor[1] +
            " - " +
            nextCoor[0] +
            " " +
            nextCoor[1]
        ].duration;
    }
    //console.log("DISTANCE : " + currDistanceMeters);
    previousCoor = nextCoor;
  }
  currentFeature.properties["distance"] = currDistanceMeters;
  currentFeature.properties["duration"] = currDuration;
  return geoJsonOutput;
};

const closestEntryToNetwork = (coordinate, range, precision) => {
  let src_long = coordinate[0];
  let src_lat = coordinate[1];

  let regexLong = new RegExp("^" + src_long.substring(0, precision));
  let regexLat = new RegExp("^" + src_lat.substring(0, precision));

  let limits_longitude = binary_search(
    sorted_longitudes,
    src_long,
    regexLong,
    "longitude",
    range
  );

  if (limits_longitude === -1) {
    console.log("No entry found ... Searching within a shorter precision");
    return closestEntryToNetwork(coordinate, range * 2, precision - 1);
  }

  let limits_latitudes = binary_search(
    sorted_latitudes,
    src_lat,
    regexLat,
    "latitude",
    range
  );

  if (limits_latitudes === -1) {
    console.log("No entry found ... Searching within a shorter precision");
    return closestEntryToNetwork(coordinate, range * 2, precision - 1);
  }

  let potentialLongitudes = sorted_longitudes.slice(
    limits_longitude.min,
    limits_longitude.max
  );

  let potentialLatitudes = sorted_latitudes
    .slice(limits_latitudes.min, limits_latitudes.max)
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
  }
  //console.log("CLOSEST entry : " + potentialEntries[minIndex]);
  return {
    coordinates: [
      potentialEntries[minIndex].longitude,
      potentialEntries[minIndex].latitude
    ],
    distance: minDistance
  };
};

const closestEntryToNetworkSlow = coordinate => {
  let src_long = coordinate[0];
  let src_lat = coordinate[1];
  let minDistance;
  let minIndex;
  for (let index = 0; index < sorted_latitudes.length; index++) {
    let currDistance = Math.sqrt(
      (src_long - sorted_latitudes[index].longitude) *
        (src_long - sorted_latitudes[index].longitude) +
        (src_lat - sorted_latitudes[index].latitude) *
          (src_lat - sorted_latitudes[index].latitude)
    );
    if (!minDistance || currDistance < minDistance) {
      minDistance = currDistance;
      minIndex = index;
    }
  }
  return {
    coordinates: [
      sorted_latitudes[minIndex].longitude,
      sorted_latitudes[minIndex].latitude
    ],
    distance: minDistance
  };
};

const binary_search = (arr, source, regex, coord_type, range) => {
  let pointer_ind = Math.floor(arr.length / 2);
  let pointer_ind_min = 0;
  let previous_ind;
  let pointer_ind_max = arr.length - 1;
  let pointer = arr[pointer_ind];

  while (!String(pointer[coord_type]).match(regex)) {
    if (pointer[coord_type] > source) {
      pointer_ind_max = pointer_ind;
    } else {
      pointer_ind_min = pointer_ind;
    }
    previous_ind = pointer_ind;
    pointer_ind = Math.floor((pointer_ind_max + pointer_ind_min) / 2);
    if (previous_ind === pointer_ind) {
      return -1;
    }
    pointer = arr[pointer_ind];
  }

  pointer_ind_min = pointer_ind - range;
  if (pointer_ind_min < 0) pointer_ind_min = 0;
  pointer_ind_max = pointer_ind + range;
  if (pointer_ind_max >= arr.length) pointer_ind_max = arr.length - 1;

  return { min: pointer_ind_min, max: pointer_ind_max };
};

exports.graph = null;
exports.init = init;
exports.calculate = calculate;
exports.closestEntryToNetwork = closestEntryToNetwork;
exports.closestEntryToNetworkSlow = closestEntryToNetworkSlow;
