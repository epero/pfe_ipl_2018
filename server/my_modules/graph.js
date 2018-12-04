var geojson  = require('../latlong_icr');
const SortedSet = require("collections/sorted-set");
var fs = require('fs');
let graph = null;


const parse = () => {
  graph = {};
  let features = geojson.features;
  features.forEach((feature) => {
    let arrayCoordinates = feature.geometry.coordinates
    arrayCoordinates.forEach((coordinates, i1) => {

        coordinates.forEach((coordinate, i2) => {
          if(coordinates[i2+1]){
            if(!graph[coordinate[0] + " " + coordinate[1]]){
              graph[coordinate[0] + " " + coordinate[1]] = []
            }
            graph[coordinate[0] + " " + coordinate[1]].push({
              "longitude" : coordinates[i2+1][0],
              "latitude" : coordinates[i2+1][1],
              "distance" : Math.sqrt( (coordinate[0]-coordinates[i2+1][0])*(coordinate[0]-coordinates[i2+1][0]) + (coordinate[1]-coordinates[i2+1][1])*(coordinate[1]-coordinates[i2+1][1]) ),
              "icr": feature.properties.icr,
              "part": feature.properties.part,
              "balises" : feature.properties.balises,
              "id" : feature.id
            })
            if(!graph[coordinates[i2+1][0] + " " + coordinates[i2+1][1]]){
              graph[coordinates[i2+1][0] + " " + coordinates[i2+1][1]] = []
            }
            graph[coordinates[i2+1][0] + " " + coordinates[i2+1][1]].push({
              "longitude" : coordinate[0],
              "latitude" : coordinate[1],
              "distance" : Math.sqrt( (coordinate[0]-coordinates[i2+1][0])*(coordinate[0]-coordinates[i2+1][0]) + (coordinate[1]-coordinates[i2+1][1])*(coordinate[1]-coordinates[i2+1][1]) ),
              "icr": feature.properties.icr,
              "part": feature.properties.part,
              "balises" : feature.properties.balises,
              "id" : feature.id
            })
          }
        })
    })
  })
  exports.graph = graph
};

const calculate = (coordinates) => {
  let distances = new Map();
  let etiqProv = new SortedSet(null, (a,b) => a === b, (a,b) => distances[a] < distances[b] );
  let etiqDef = new Set();
  let arbre = new Map();

  const source = coordinates.source_long + " " + coordinates.source_lat;
  const destination = coordinates.dest_long + " " + coordinates.dest_lat;
  distances[source] = 0;
  etiqDef.add(source)//REVOIR
  //etiqProv.push(source)
  let current = source;
  let found = true;

  while(current !== destination){
    graph[current].forEach((outRoute) => {
      let currentDestination = outRoute.longitude + " " + outRoute.latitude

      if(!etiqDef.has(currentDestination)){

        let currentDistance = distances[current] + outRoute.distance;
        if (!etiqProv.contains(currentDestination)) {
            distances[currentDestination] = currentDistance
            etiqProv.push(currentDestination);
            arbre.set(currentDestination, current);
          }

        else if (distances[currentDestination] > currentDistance) {
          etiqProv.delete(currentDestination);
          distances[currentDestination] = currentDistance
          etiqProv.push(currentDestination);
          arbre.set(currentDestination, current);
        }
      }

    })

    if (etiqProv.length===0) {
      found = false;
      break;
    }
    current = etiqProv.pop();
    //console.log(distances[current])
    etiqDef.add(current);
  }

  if(found){
    let shortestPath = []

    let currentSource = destination
    while(currentSource !== source){
      shortestPath.unshift(currentSource)
      currentSource = arbre.get(currentSource)
    }
    shortestPath.unshift(source)
    route_to_geojson(shortestPath);
  }

  console.log("FOUND : " + found);
}

const route_to_geojson = (path) => {
  //console.log(path);
  let jsonn = {
      "type": "FeatureCollection",
      "totalFeatures": 156,
      "features": [
        {
          "type": "Feature",
          "id": "icr.20",
          "geometry": {
            "type": "MultiLineString",
            "coordinates": [[
            //TODO
            ]]
          },
          "geometry_name": "wkb_geometry",
          "properties": {
            "ogc_fid": 158,
            "icr": "SZ",
            "part": null,
            "balises": 0
          }
        }
      ],
      "crs": {
        "type": "name",
        "properties": {
          "name": "urn:ogc:def:crs:EPSG::31370"
        }
      }
    }

    path.forEach((route) => {
      let taby = [parseFloat(route.split(' ')[0]), parseFloat(route.split(' ')[1])]
      console.log(taby)
      //console.log(jsonn.features[0].geometry.coordinates[0])
      jsonn.features[0].geometry.coordinates[0].push(taby)
    });

    fs.writeFile('./exemple.json', JSON.stringify(jsonn, null, 2) , 'utf-8');

}

exports.graph = null;
exports.parse = parse;
exports.calculate = calculate;

