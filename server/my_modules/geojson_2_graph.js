var geojson  = require('../latlong_icr');

const parse = () => {
  graph = {};
  let features = geojson.features;
  features.forEach((feature) => {
    let arrayCoordinates = feature.geometry.coordinates
    arrayCoordinates.forEach((coordinates, i1) => {

        coordinates.forEach((coordinate, i2) => {
          //console.log(i2);


          //console.log(coordinates[i2])
          if(coordinates[i2+1]){
            //console.log("yes")
            //console.log(graph[coordinate[0] + " " + coordinate[1]]);

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
  //console.log(graph)
};

exports.graph = null;
exports.parse = parse;

