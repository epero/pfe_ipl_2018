const checkSegmentIntersection = (
  line1StartX,
  line1StartY,
  line1EndX,
  line1EndY,
  line2StartX,
  line2StartY,
  line2EndX,
  line2EndY
) => {
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
};

const metersBetweenCoordinates = (a_long, a_lat, b_long, b_lat) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2radians(a_lat - b_lat); // deg2rad below
  var dLon = deg2radians(a_long - b_long);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2radians(a_lat)) *
      Math.cos(deg2radians(b_lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //var d = R * c; // Distance in km
  var d = R * c * 1000; //Distance in m
  return d;
};

const deg2radians = deg => {
  return deg * (Math.PI / 180);
};

exports.checkSegmentIntersection = checkSegmentIntersection;
exports.metersBetweenCoordinates = metersBetweenCoordinates;
