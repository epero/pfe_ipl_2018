const graphMod = require("./graph");
const config = require("../config.json");

const calculate = coordinates => {
  if (!graphMod.graph) {
    throw new Error(config.error._501);
  }

  let graph = graphMod.graph;

  let distances = new Map();
  let etiqProv = new Set();

  let etiqDef = new Set();
  let arbre = new Map();

  const source = coordinates.source_long + " " + coordinates.source_lat;
  const destination = coordinates.dest_long + " " + coordinates.dest_lat;
  distances[source] = 0;
  etiqDef.add(source);
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
    let min;
    for (let ccc of etiqProv) {
      if (!min || distances[ccc] < distances[min]) {
        min = ccc;
      }
    }
    current = min;

    etiqProv.delete(current);
    etiqDef.add(current);
  }

  if (found) {
    return build_path_from_tree(arbre, source, destination);
  }
  throw new Error(config.error._412);
};

const build_path_from_tree = (tree, source, destination) => {
  let path = [];

  let currentSource = destination;
  while (currentSource !== source) {
    path.unshift(currentSource);
    currentSource = tree.get(currentSource);
  }
  path.unshift(source);
  return path;
};

exports.calculate = calculate;
