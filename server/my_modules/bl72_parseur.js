var bl72ToLatLng = require( "bl72tolatlng" );
var fs = require('fs');
var obj  = require('../icr-2016-01-01')


const parse = () => {
  let features = obj.features;
  features.forEach((feature) => {
    let arrayCoordinates = feature.geometry.coordinates
    arrayCoordinates.forEach((coordinates, i1) => {
        coordinates.forEach((coordinate, i2) => {
          console.log(coordinate[0])
          console.log(coordinate[1])
          let latlong = bl72ToLatLng(coordinate[0], coordinate[1])

          coordinate[1] = latlong.latitude
          coordinate[0] = latlong.longitude
        })
    })
  })
  fs.writeFile('./latlong_icr.json', JSON.stringify(obj, null, 2) , 'utf-8');
};

exports.parse = parse;
