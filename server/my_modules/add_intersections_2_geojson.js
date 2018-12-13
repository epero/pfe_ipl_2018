const fs = require("fs");
const coordinatesMod = require("./coordinates");
let file;

/**
 * Add missing intersections of icr paths in the geojson
 */

const parse = source_file => {
  let pathname;
  if (source_file) {
    pathname = `../geojsons/${source_file}`;
    file = require(pathname);
  }
  let features = file.features;
  for (let ii = 0; ii < features.length; ii++) {
    let feature = features[ii];
    let arrayCoordinates = feature.geometry.coordinates;
    if (feature.geometry.type === "LineString") {
      for (let i2 = 0; i2 < arrayCoordinates.length; i2++) {
        let coordinate = arrayCoordinates[i2];
        if (arrayCoordinates[i2 + 1]) {
          let result = compare_line_2_lines(
            coordinate[0],
            coordinate[1],
            arrayCoordinates[i2 + 1][0],
            arrayCoordinates[i2 + 1][1]
          );
          if (result) {
            arrayCoordinates.splice(i2 + 1, 0, [result.x, result.y]);
            parse();
          }
        }
      }
    } else {
      for (let i1 = 0; i1 < arrayCoordinates.length; i1++) {
        let coordinates = arrayCoordinates[i1];
        for (let i3 = 0; i3 < coordinates.length; i3++) {
          let coordinate = coordinates[i3];
          if (coordinates[i3 + 1]) {
            let result = compare_line_2_lines(
              coordinate[0],
              coordinate[1],
              coordinates[i3 + 1][0],
              coordinates[i3 + 1][1]
            );
            if (result) {
              coordinates.splice(i3 + 1, 0, [result.x, result.y]);
              parse();
            }
          }
        }
      }
    }
  }
  fs.writeFileSync(
    `./geojsons/icr-with-intersections.json`,
    JSON.stringify(file, null, 2),
    "utf-8",
    err => {
      if (err) throw err;
    }
  );
  return "icr-with-intersections.json";
};

const compare_line_2_lines = (lineStartX, lineStartY, lineEndX, lineEndY) => {
  let features = file.features;
  for (let iii = 0; iii < features.length; iii++) {
    let feature = features[iii];
    let arrayCoordinates = feature.geometry.coordinates;
    if (feature.geometry.type === "LineString") {
      for (let ii2 = 0; ii2 < arrayCoordinates.length; ii2++) {
        let coordinate = arrayCoordinates[ii2];
        if (arrayCoordinates[ii2 + 1]) {
          let result = coordinatesMod.checkSegmentIntersection(
            lineStartX,
            lineStartY,
            lineEndX,
            lineEndY,
            coordinate[0],
            coordinate[1],
            arrayCoordinates[ii2 + 1][0],
            arrayCoordinates[ii2 + 1][1]
          );
          if (result.onLine1 && result.onLine2) {
            arrayCoordinates.splice(ii2 + 1, 0, [result.x, result.y]);
            return result;
          }
        }
      }
    } else {
      for (let ii1 = 0; ii1 < arrayCoordinates.length; ii1++) {
        let coordinates = arrayCoordinates[ii1];
        for (let ii3 = 0; ii3 < coordinates.length; ii3++) {
          let coordinate = coordinates[ii3];
          if (coordinates[ii3 + 1]) {
            let result = coordinatesMod.checkSegmentIntersection(
              lineStartX,
              lineStartY,
              lineEndX,
              lineEndY,
              coordinate[0],
              coordinate[1],
              coordinates[ii3 + 1][0],
              coordinates[ii3 + 1][1]
            );
            if (result.onLine1 && result.onLine2) {
              coordinates.splice(ii3 + 1, 0, [result.x, result.y]);
              return result;
            }
          }
        }
      }
    }
  }
  return null;
};

exports.parse = parse;
