var fs = require("fs");
//var obj  = require('../icr-2017-01-01')
//var obj = require("../latlong_icr.json");

const parse = file => {
  file = require(`../geojsons/${file}`);
  let features = file.features;
  //features.forEach((feature) => {
  for (ii = 0; ii < features.length; ii++) {
    let feature = features[ii];
    let arrayCoordinates = feature.geometry.coordinates;
    if (feature.geometry.type === "LineString") {
      //arrayCoordinates.forEach((coordinate, i2) => {
      for (i2 = 0; i2 < arrayCoordinates.length; i2++) {
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
            console.log("INSERTED : " + result);
            console.log(
              "BEFORE : " + file.features[ii].geometry.coordinates[i2]
            );
            console.log(
              "PUT :" + file.features[ii].geometry.coordinates[i2 + 1]
            );
            console.log(
              "AFTER : " + file.features[ii].geometry.coordinates[i2 + 2]
            );
            parse();
          }
        }
        //})
      }
    } else {
      //arrayCoordinates.forEach((coordinates, i1) => {
      for (i1 = 0; i1 < arrayCoordinates.length; i1++) {
        let coordinates = arrayCoordinates[i1];
        //coordinates.forEach((coordinate, i2) => {
        for (i3 = 0; i3 < coordinates.length; i3++) {
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
              console.log("INSERTED : " + result);
              console.log(
                "BEFORE : " + file.features[ii].geometry.coordinates[i1][i3]
              );
              console.log(
                "PUT :" + file.features[ii].geometry.coordinates[i1][i3 + 1]
              );
              console.log(
                "AFTER : " + file.features[ii].geometry.coordinates[i1][i3 + 2]
              );
              parse();
            }
          }
          //})
        }
        //})
      }
    }

    //})
  }
  //ASYNC
  fs.writeFile(
    `../geojsons/icr-with-intersections-${new Date()}.json`,
    JSON.stringify(file, null, 2),
    "utf-8"
  );
};

const compare_line_2_lines = (lineStartX, lineStartY, lineEndX, lineEndY) => {
  let features = file.features;
  for (iii = 0; iii < features.length; iii++) {
    let feature = features[iii];
    let arrayCoordinates = feature.geometry.coordinates;
    if (feature.geometry.type === "LineString") {
      for (ii2 = 0; ii2 < arrayCoordinates.length; ii2++) {
        let coordinate = arrayCoordinates[ii2];
        if (arrayCoordinates[ii2 + 1]) {
          let result = checkLineIntersection(
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
            console.log("abab : " + result);
            console.log();
            console.log("TEST BEF: " + lineStartX + ", " + lineStartY);
            console.log("TEST REP: " + lineEndX + ", " + lineEndY);
            console.log();
            arrayCoordinates.splice(ii2 + 1, 0, [result.x, result.y]);
            console.log(
              "BEFORE : " + file.features[iii].geometry.coordinates[ii2]
            );
            console.log(
              "PUT :" + file.features[iii].geometry.coordinates[ii2 + 1]
            );
            console.log(
              "AFTER : " + file.features[iii].geometry.coordinates[ii2 + 2]
            );
            return result;
          }
        }
      }
    } else {
      for (ii1 = 0; ii1 < arrayCoordinates.length; ii1++) {
        let coordinates = arrayCoordinates[ii1];
        for (ii3 = 0; ii3 < coordinates.length; ii3++) {
          let coordinate = coordinates[ii3];
          if (coordinates[ii3 + 1]) {
            let result = checkLineIntersection(
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
              console.log("abab : " + result);
              console.log();
              console.log("TEST BEF: " + lineStartX + ", " + lineStartY);
              console.log("TEST REP: " + lineEndX + ", " + lineEndY);
              console.log();
              coordinates.splice(ii3 + 1, 0, [result.x, result.y]);
              console.log(
                "BEFORE : " + file.features[iii].geometry.coordinates[ii1][ii3]
              );
              console.log(
                "PUT :" + file.features[iii].geometry.coordinates[ii1][ii3 + 1]
              );
              console.log(
                "AFTER : " +
                  file.features[iii].geometry.coordinates[ii1][ii3 + 2]
              );
              return result;
            }
          }
        }
      }
    }
  }
  return null;
};

function checkLineIntersection(
  line1StartX,
  line1StartY,
  line1EndX,
  line1EndY,
  line2StartX,
  line2StartY,
  line2EndX,
  line2EndY
) {
  // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
  var denominator,
    a,
    b,
    numerator1,
    numerator2,
    result = {
      x: null,
      y: null,
      onLine1: false,
      onLine2: false
    };

  //DEJA FAIT => COMMENT???
  if (line1EndX === line2StartX && line1EndY === line2StartY) return result;
  if (line2EndX === line1StartX && line2EndY === line1StartY) return result;

  if (line1StartX === line2StartX && line1StartY === line2StartY) return result;
  if (line1EndX === line2EndX && line1EndY === line2EndY) return result;

  denominator =
    (line2EndY - line2StartY) * (line1EndX - line1StartX) -
    (line2EndX - line2StartX) * (line1EndY - line1StartY);
  if (denominator == 0) {
    return result;
  }
  a = line1StartY - line2StartY;
  b = line1StartX - line2StartX;
  numerator1 = (line2EndX - line2StartX) * a - (line2EndY - line2StartY) * b;
  numerator2 = (line1EndX - line1StartX) * a - (line1EndY - line1StartY) * b;
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  // if we cast these lines infinitely in both directions, they intersect here:
  result.x = line1StartX + a * (line1EndX - line1StartX);
  result.y = line1StartY + a * (line1EndY - line1StartY);
  /*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
  // if line1 is a segment and line2 is infinite, they intersect if:
  if (a > 0 && a < 1) {
    result.onLine1 = true;
  }
  // if line2 is a segment and line1 is infinite, they intersect if:
  if (b > 0 && b < 1) {
    result.onLine2 = true;
  }
  // if line1 and line2 are segments, they intersect if both of the above are true
  return result;
}

exports.parse = parse;
