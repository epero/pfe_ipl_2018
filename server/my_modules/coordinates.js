const checkSegmentIntersection = (
  segmant_a_start_long,
  segment_a_start_lat,
  segment_a_end_long,
  segment_a_end_lat,
  segment_b_start_long,
  segment_b_start_lat,
  segment_b_end_long,
  segment_b_end_lat
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

  if (
    segment_a_end_long === segment_b_start_long &&
    segment_a_end_lat === segment_b_start_lat
  ) {
    return result;
  }
  if (
    segment_b_end_long === segmant_a_start_long &&
    segment_b_end_lat === segment_a_start_lat
  ) {
    return result;
  }

  if (
    segmant_a_start_long === segment_b_start_long &&
    segment_a_start_lat === segment_b_start_lat
  ) {
    return result;
  }
  if (
    segment_a_end_long === segment_b_end_long &&
    segment_a_end_lat === segment_b_end_lat
  ) {
    return result;
  }

  denominator =
    (segment_b_end_lat - segment_b_start_lat) *
      (segment_a_end_long - segmant_a_start_long) -
    (segment_b_end_long - segment_b_start_long) *
      (segment_a_end_lat - segment_a_start_lat);
  if (denominator == 0) {
    return result;
  }
  a = segment_a_start_lat - segment_b_start_lat;
  b = segmant_a_start_long - segment_b_start_long;
  numerator1 =
    (segment_b_end_long - segment_b_start_long) * a -
    (segment_b_end_lat - segment_b_start_lat) * b;
  numerator2 =
    (segment_a_end_long - segmant_a_start_long) * a -
    (segment_a_end_lat - segment_a_start_lat) * b;
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  // if we cast these lines infinitely in both directions, they intersect here:
  result.x =
    segmant_a_start_long + a * (segment_a_end_long - segmant_a_start_long);
  result.y =
    segment_a_start_lat + a * (segment_a_end_lat - segment_a_start_lat);
  /*
          // it is worth noting that this should be the same as:
          x = segment_b_start_long + (b * (segment_b_end_long - segment_b_start_long));
          y = segment_b_start_long + (b * (segment_b_end_lat - segment_b_start_lat));
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
