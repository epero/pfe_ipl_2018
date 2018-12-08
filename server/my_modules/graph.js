//var geojson  = require('../icr-2017-01-01');
//var geojson = require('../latlong_icr');
//var geojson = require('../icr-test-with-intersections')
var geojson = require('../icr-2017-01-01_mine')
//const SortedSet = require("collections/sorted-set");
//const SSet = require('sorted-set')
var fs = require('fs');
let graph = null;


const parse = () => {
  graph = {};
  let features = geojson.features;
  features.forEach((feature) => {
    let arrayCoordinates = feature.geometry.coordinates
    if(feature.geometry.type==="LineString"){
      arrayCoordinates.forEach((coordinate, i2) => {
        if(arrayCoordinates[i2+1]){
          if(!graph[coordinate[0] + " " + coordinate[1]]){
            graph[coordinate[0] + " " + coordinate[1]] = []
          }
          graph[coordinate[0] + " " + coordinate[1]].push({
            "longitude" : arrayCoordinates[i2+1][0],
            "latitude" : arrayCoordinates[i2+1][1],
            "destination" : `${arrayCoordinates[i2+1][0]} ${arrayCoordinates[i2+1][1]}`,
            "distance" : Math.sqrt( (coordinate[0]-arrayCoordinates[i2+1][0])*(coordinate[0]-arrayCoordinates[i2+1][0]) + (coordinate[1]-arrayCoordinates[i2+1][1])*(coordinate[1]-arrayCoordinates[i2+1][1]) ),
            "icr": feature.properties.name,
            //"part": feature.properties.part,
            //"balises" : feature.properties.balises,
            //"id" : feature.id
          })
          if(!graph[arrayCoordinates[i2+1][0] + " " + arrayCoordinates[i2+1][1]]){
            graph[arrayCoordinates[i2+1][0] + " " + arrayCoordinates[i2+1][1]] = []
          }
          graph[arrayCoordinates[i2+1][0] + " " + arrayCoordinates[i2+1][1]].push({
            "longitude" : coordinate[0],
            "latitude" : coordinate[1],
            "destination" : `${coordinate[0]} ${coordinate[1]}`,
            "distance" : Math.sqrt( (coordinate[0]-arrayCoordinates[i2+1][0])*(coordinate[0]-arrayCoordinates[i2+1][0]) + (coordinate[1]-arrayCoordinates[i2+1][1])*(coordinate[1]-arrayCoordinates[i2+1][1]) ),
            "icr": feature.properties.name,
            //"part": feature.properties.part,
            //"balises" : feature.properties.balises,
            //"id" : feature.id
          })
        }
      })
    }
    else{
      arrayCoordinates.forEach((coordinates, i1) => {

        coordinates.forEach((coordinate, i2) => {
          if(coordinates[i2+1]){
            if(!graph[coordinate[0] + " " + coordinate[1]]){
              graph[coordinate[0] + " " + coordinate[1]] = []
            }
            graph[coordinate[0] + " " + coordinate[1]].push({
              "longitude" : coordinates[i2+1][0],
              "latitude" : coordinates[i2+1][1],
              "destination" : `${coordinates[i2+1][0]} ${coordinates[i2+1][1]}`,
              "distance" : Math.sqrt( (coordinate[0]-coordinates[i2+1][0])*(coordinate[0]-coordinates[i2+1][0]) + (coordinate[1]-coordinates[i2+1][1])*(coordinate[1]-coordinates[i2+1][1]) ),
              "icr": feature.properties.name,
              //"part": feature.properties.part,
              //"balises" : feature.properties.balises,
              //"id" : feature.id
            })
            if(!graph[coordinates[i2+1][0] + " " + coordinates[i2+1][1]]){
              graph[coordinates[i2+1][0] + " " + coordinates[i2+1][1]] = []
            }
            graph[coordinates[i2+1][0] + " " + coordinates[i2+1][1]].push({
              "longitude" : coordinate[0],
              "latitude" : coordinate[1],
              "destination" : `${coordinate[0]} ${coordinate[1]}`,
              "distance" : Math.sqrt( (coordinate[0]-coordinates[i2+1][0])*(coordinate[0]-coordinates[i2+1][0]) + (coordinate[1]-coordinates[i2+1][1])*(coordinate[1]-coordinates[i2+1][1]) ),
              "icr": feature.properties.name,
              //"part": feature.properties.part,
              //"balises" : feature.properties.balises,
              //"id" : feature.id
            })
          }
        })
      })
    }

  })
  exports.graph = graph
};

const calculate = (coordinates) => {
  let distances = new Map();
  let etiqProv = new Set();

  let etiqDef = new Set();
  let arbre = new Map();

  const source = coordinates.source_long + " " + coordinates.source_lat;
  const destination = coordinates.dest_long + " " + coordinates.dest_lat;
  distances[source] = 0;
  etiqDef.add(source)//REVOIR
  let current = source;
  let found = true;

  while(current !== destination){
    //graph[current].forEach((outRoute) => {
    //console.log("GRAPH : " + graph[current]);
    for (let i = 0; i < graph[current].length; i++) {
      let outRoute = graph[current][i]
      let currentDestination = outRoute.longitude + " " + outRoute.latitude
      if(!etiqDef.has(currentDestination)){
        let currentDistance = distances[current] + outRoute.distance;
        if (!etiqProv.has(currentDestination)) {
            distances[currentDestination] = currentDistance
            etiqProv.add(currentDestination);
            arbre.set(currentDestination, current);
          }

        else if (distances[currentDestination] > currentDistance) {
          distances[currentDestination] = currentDistance
          etiqProv.add(currentDestination);
          arbre.set(currentDestination, current);
        }
      }
    }
    //})

    if (etiqProv.size===0) {
      found = false;
      break;
    }
    let sorted = Array.from(etiqProv).sort((a, b) => {
      if(distances[a] === distances[b])
        return a -b
      return distances[a] - distances[b]
    });
    current = sorted[0];
    //console.log(distances[sorted[0]] + ", " + distances[sorted[1]], ", " + distances[sorted[2]])
    //console.log("DISTANCE : "  + distances[sorted[0]])
    etiqProv.delete(current);
    etiqDef.add(current);
    //console.log(current);
  }

  if(found){
    //console.log("OTHER DISTANCE : " + distances["4.371281 50.826905"])
    //console.log("DISTANCE : " + distances[current]);
    let shortestPath = []

    let currentSource = destination
    while(currentSource !== source){
      shortestPath.unshift(currentSource)
      currentSource = arbre.get(currentSource)
    }
    shortestPath.unshift(source)
    path_to_geojson(shortestPath);
  }

  console.log("FOUND : " + found);
}

const path_to_geojson = (path) => {
  //console.log(path);
  let geoJsonOutput = {
    "type": "FeatureCollection",
    //"totalFeatures": 156,
    "features": [],
    //"crs": {
    //  "type": "name",
    //  "properties": {
    //    "name": "urn:ogc:def:crs:EPSG::31370"
    //  }
    //}
  }

  /*let feature = {
    "type": "Feature",
    //"id": "icr.20",
    "geometry": {
      "type": "LineString",
      "coordinates": []
    },
    //"geometry_name": "wkb_geometry",
    "properties": {
      //"ogc_fid": 158,
      //"icr": "SZ",
      //"part": null,
      //"balises": 0
      "name": null
    }
  }*/


  //path.forEach((route) => {
  //let possIcr = new Array(path.length-1)
  let possIcr = new Array(path.length -1)

  for(let i = 0; i < path.length-1; i++){
    possIcr[i] = new Set();
    let route = path[i];
    let nextRoute = path[i+1];
    //let nextCoor = [parseFloat(nextRoute.split(' ')[0]), parseFloat(nextRoute.split(' ')[1])]

    //console.log("NEW ROUTE")
    //let possIcr = [];
    for(let j = 0; j< graph[route].length; j++){
      //console.log(nextRoute + " - "+ graph[route][j].destination)
      if(nextRoute === graph[route][j].destination){
        possIcr[i].add(graph[route][j].icr)
        //console.log("Added : " + possIcr[i].size)
      }
    }

    let samePrev = new Set();
    for (let curIcr of possIcr[i]){
      if(i>0 && possIcr[i-1].has(curIcr)){
        samePrev.add(curIcr);
      }
    }
    if(samePrev.size>0){
      possIcr[i] = samePrev;
    }
  }
  //HUHHUH??????
  //possIcr[path.length-1] = possIcr[path.length-2]

  let choosenIcr = new Array(possIcr.length)

  for(let i = possIcr.length -1 ; i >= 0; i--){
    let currPossIcr = possIcr[i];
    //console.log("SINGLE : " + Array.from(currPossIcr))
    if(currPossIcr.size === 1){
      //console.log(i)
      choosenIcr[i] = Array.from(currPossIcr)[0];
      //console.log("HI : " + choosenIcr[i])
    }
    else if ((i < (possIcr.length-1)) && currPossIcr.has(choosenIcr[i+1])){
      //console.log(i)
      choosenIcr[i] = choosenIcr[i+1];
     // console.log("HI2 : " + choosenIcr[i+1])
    }
    else{
      //console.log(i)
      choosenIcr[i] = Array.from(currPossIcr)[0];
      //console.log("HI3 : " + choosenIcr[i])
    }
  }

  geoJsonOutput.features.push({
    "type": "Feature",
    //"id": "icr.20",
    "geometry": {
      "type": "LineString",
      "coordinates": []
    },
    //"geometry_name": "wkb_geometry",
    "properties": {
      //"ogc_fid": 158,
      //"icr": "SZ",
      //"part": null,
      //"balises": 0
      "name": choosenIcr[0]
    }
  });
  let featuresInd = 0;
  let currentFeature = geoJsonOutput.features[featuresInd];
  currentFeature.geometry.coordinates.push([parseFloat(path[0].split(' ')[0]), parseFloat(path[0].split(' ')[1])])
  //currentFeature.properties.name = choosenIcr[0];
  //console.log(currentFeature);

  //geoJsonOutput.features.push(currentFeature);
  let previousCoor;
  for(let i = 0; i < choosenIcr.length; i++){
    // route = path[i+1];
    //let nextRoute = path[i+1];
    let nextCoor = [parseFloat(path[i+1].split(' ')[0]), parseFloat(path[i+1].split(' ')[1])]
    if(choosenIcr[i] === currentFeature.properties.name){
      currentFeature.geometry.coordinates.push(nextCoor)
    }
    else{
      //console.log(i);
      //console.log(choosenIcr[i-1]);
      //currentFeature = Object.assign({}, feature);
      geoJsonOutput.features.push({
        "type": "Feature",
        //"id": "icr.20",
        "geometry": {
          "type": "LineString",
          "coordinates": []
        },
        //"geometry_name": "wkb_geometry",
        "properties": {
          //"ogc_fid": 158,
          //"icr": "SZ",
          //"part": null,
          //"balises": 0
          "name": choosenIcr[i]
        }
      });
      featuresInd++;
      currentFeature = geoJsonOutput.features[featuresInd];
      //currentFeature.properties.name = choosenIcr[i-1];
      //console.log(currentFeature);
      currentFeature.geometry.coordinates.push(previousCoor)
      currentFeature.geometry.coordinates.push(nextCoor)
    }
    previousCoor = nextCoor;
  }
  //console.log(geoJsonOutput.features[0].properties)
  fs.writeFile('./exemple2017.json', JSON.stringify(geoJsonOutput, null, 2) , 'utf-8');

}

exports.graph = null;
exports.parse = parse;
exports.calculate = calculate;

