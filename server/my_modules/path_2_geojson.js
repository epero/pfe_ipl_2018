const graphMod = require("./graph");
const icr_2_color = require("./icr_2_color");

const convert = path => {
  if (!graphMod.graph) {
    throw new Error(config.error._501);
  }

  let routes = graphMod.routes;
  let graph = graphMod.graph;

  let geoJsonOutput = {
    type: "FeatureCollection",
    features: [[]]
  };

  /**
   * Algorithme s’assure que lorsque plusieurs icr se partagent plusieurs segments consécutifs,
   * un nombre minimisé d’icr sont attribués à l’ensemble du morceau de chemin.
   * Par exemple, la rue de la loi est traversé par l’icr 2, 3 et 4.
   * Afin de proposer à l’utilisateur le chemin le plus simple et homogène,
   * plutôt que lui proposer l’icr 2 suivi par le 4 suivi par le 2,
   * on lui dit d’employer l’icr 2 pendant tout ce morceau de chemin.
   */
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

  /**
   * Construction du geojson + Attribution de l'icr, duration et distance à chaque morceau du chemin
   */
  geoJsonOutput.features.push({
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: []
    },
    properties: {
      icr: choosenIcr[0],
      color: icr_2_color.get(choosenIcr[0])
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
          color: icr_2_color.get(choosenIcr[i])
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
    previousCoor = nextCoor;
  }
  currentFeature.properties["distance"] = currDistanceMeters;
  currentFeature.properties["duration"] = currDuration;
  return geoJsonOutput;
};

exports.convert = convert;
