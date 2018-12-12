const graphMod = require("./graph.js");

const closestEntryToNetwork = (coordinate, range, precision) => {
  if (!graphMod.graph) {
    throw new Error(config.error._501);
  }

  let sorted_latitudes = graphMod.sorted_latitudes;
  let sorted_longitudes = graphMod.sorted_longitudes;

  let src_long = coordinate[0];
  let src_lat = coordinate[1];

  let regexLong = new RegExp("^" + src_long.substring(0, precision));
  let regexLat = new RegExp("^" + src_lat.substring(0, precision));

  let limits_longitude = binary_search(
    sorted_longitudes,
    src_long,
    regexLong,
    "longitude",
    range
  );

  if (limits_longitude === -1) {
    console.log("No entry found ... Searching within a shorter precision");
    return closestEntryToNetwork(coordinate, range * 2, precision - 1);
  }

  let limits_latitudes = binary_search(
    sorted_latitudes,
    src_lat,
    regexLat,
    "latitude",
    range
  );

  if (limits_latitudes === -1) {
    console.log("No entry found ... Searching within a shorter precision");
    return closestEntryToNetwork(coordinate, range * 2, precision - 1);
  }

  let potentialLongitudes = sorted_longitudes.slice(
    limits_longitude.min,
    limits_longitude.max
  );

  let potentialLatitudes = sorted_latitudes
    .slice(limits_latitudes.min, limits_latitudes.max)
    .map(a => `${a.longitude} ${a.latitude}`);

  potentialLatitudes = new Set(potentialLatitudes);

  let potentialEntries = potentialLongitudes.filter(value =>
    potentialLatitudes.has(`${value.longitude} ${value.latitude}`)
  );
  if (potentialEntries.length === 0) {
    console.log("No entry found ... Searching within a bigger range");
    return closestEntryToNetwork(coordinate, range * 2, precision);
  }

  let minDistance;
  let minIndex;
  for (let index = 0; index < potentialEntries.length; index++) {
    let currDistance = Math.sqrt(
      (src_long - potentialEntries[index].longitude) *
        (src_long - potentialEntries[index].longitude) +
        (src_lat - potentialEntries[index].latitude) *
          (src_lat - potentialEntries[index].latitude)
    );
    if (!minDistance || currDistance < minDistance) {
      minDistance = currDistance;
      minIndex = index;
    }
  }
  return {
    coordinates: [
      potentialEntries[minIndex].longitude,
      potentialEntries[minIndex].latitude
    ],
    distance: minDistance
  };
};

const closestEntryToNetworkSlow = coordinate => {
  let src_long = coordinate[0];
  let src_lat = coordinate[1];
  let minDistance;
  let minIndex;
  for (let index = 0; index < sorted_latitudes.length; index++) {
    let currDistance = Math.sqrt(
      (src_long - sorted_latitudes[index].longitude) *
        (src_long - sorted_latitudes[index].longitude) +
        (src_lat - sorted_latitudes[index].latitude) *
          (src_lat - sorted_latitudes[index].latitude)
    );
    if (!minDistance || currDistance < minDistance) {
      minDistance = currDistance;
      minIndex = index;
    }
  }
  return {
    coordinates: [
      sorted_latitudes[minIndex].longitude,
      sorted_latitudes[minIndex].latitude
    ],
    distance: minDistance
  };
};

const binary_search = (arr, source, regex, coord_type, range) => {
  let pointer_ind = Math.floor(arr.length / 2);
  let pointer_ind_min = 0;
  let previous_ind;
  let pointer_ind_max = arr.length - 1;
  let pointer = arr[pointer_ind];

  while (!String(pointer[coord_type]).match(regex)) {
    if (pointer[coord_type] > source) {
      pointer_ind_max = pointer_ind;
    } else {
      pointer_ind_min = pointer_ind;
    }
    previous_ind = pointer_ind;
    pointer_ind = Math.floor((pointer_ind_max + pointer_ind_min) / 2);
    if (previous_ind === pointer_ind) {
      return -1;
    }
    pointer = arr[pointer_ind];
  }

  pointer_ind_min = pointer_ind - range;
  if (pointer_ind_min < 0) pointer_ind_min = 0;
  pointer_ind_max = pointer_ind + range;
  if (pointer_ind_max >= arr.length) pointer_ind_max = arr.length - 1;

  return { min: pointer_ind_min, max: pointer_ind_max };
};

exports.closestEntryToNetwork = closestEntryToNetwork;
