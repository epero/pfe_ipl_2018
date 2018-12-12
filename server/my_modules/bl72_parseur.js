var bl72ToLatLng = require("bl72tolatlng");
var fs = require("fs");

/**
 * Convert the belgian lambert coordinates to longitude /latitude format within a geojson file
 */
const parse = source_file => {
  let pathname = `../geojsons/${source_file}`;
  let file = require(pathname);
  let features = file.features;
  features.forEach(feature => {
    let arrayCoordinates = feature.geometry.coordinates;
    arrayCoordinates.forEach((coordinates, i1) => {
      coordinates.forEach((coordinate, i2) => {
        let latlong = bl72ToLatLng(coordinate[0], coordinate[1]);
        coordinate[1] = latlong.latitude;
        coordinate[0] = latlong.longitude;
        console.log(coordinate[1]);
      });
    });
  });
  fs.writeFileSync(
    `./geojsons/${source_file}`,
    JSON.stringify(file, null, 2),
    "utf-8",
    err => {
      if (err) throw err;
    }
  );
  return source_file;
};

exports.parse = parse;
