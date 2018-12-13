/**
 * Directions Use case controller
 */

const shortest_path = require("../my_modules/shortest_path");
const path_2_geojson = require("../my_modules/path_2_geojson");
const entry_2_networks = require("../my_modules/entry_2_network");
const ors = require("../my_modules/ors");
const coordinatesMod = require("../my_modules/coordinates");
const config = require("../config");

const find_directions = async coordinates => {
  /**
   * coordinates expected format: [[longitude,latitude], [longitude,latitude]]
   * ex: [[4.353434, 50.850575], [4.450772, 50.849415]]
   */
  if (
    !coordinates ||
    coordinates.length !== 2 ||
    coordinates[0].length !== 2 ||
    coordinates[1].length !== 2 ||
    isNaN(coordinates[0][0]) ||
    isNaN(coordinates[0][1]) ||
    isNaN(coordinates[1][0]) ||
    isNaN(coordinates[1][1])
  ) {
    throw new Error(config.error._412);
  }
  coordinates[0][0] = String(coordinates[0][0]);
  coordinates[0][1] = String(coordinates[0][1]);
  coordinates[1][0] = String(coordinates[1][0]);
  coordinates[1][1] = String(coordinates[1][1]);

  const min_long = config.map_limits.long_min;
  const max_long = config.map_limits.long_max;
  const min_lat = config.map_limits.lat_min;
  const max_lat = config.map_limits.lat_max;

  /**
   * coordinates must be within limits of bruxelles
   */
  if (
    coordinates[0][0] < min_long ||
    coordinates[0][0] > max_long ||
    coordinates[1][0] < min_long ||
    coordinates[1][0] > max_long ||
    coordinates[0][1] < min_lat ||
    coordinates[0][1] > max_lat ||
    coordinates[1][1] < min_lat ||
    coordinates[1][1] > max_lat
  ) {
    throw new Error(config.error._412);
  }

  /**
   * Source and destination can not be the same
   */
  if (
    coordinates[0][0] === coordinates[1][0] &&
    coordinates[0][1] === coordinates[1][1]
  ) {
    throw new Error(config.error._412);
  }

  /**
   * If distance between source and destination is below a certain distance
   * then return the path calculated by the ors api
   */
  if (
    coordinatesMod.metersBetweenCoordinates(
      coordinates[0][0],
      coordinates[0][1],
      coordinates[1][0],
      coordinates[1][1]
    ) < config.icr_search.min_distance
  ) {
    let geoJsonShortDistance = await ors.calculate(coordinates);
    return geoJsonShortDistance;
  }

  /**
   * find closest entry to the icr network from the start point
   */
  let startIcr = entry_2_networks.closestEntryToNetwork(
    coordinates[0],
    config.icr_search.range,
    config.icr_search.precision
  );
  /**
   * find closest exit from the icr network to the destination point
   */
  let endIcr = entry_2_networks.closestEntryToNetwork(
    coordinates[1],
    config.icr_search.range,
    config.icr_search.precision
  );

  /**
   * get the ors path : start => icr entry
   */
  let geoJsonStart = await ors.calculate([
    coordinates[0],
    startIcr.coordinates
  ]);

  /**
   * get the ors path :  icr exit => destination
   */
  let geoJsonEnd = await ors.calculate([endIcr.coordinates, coordinates[1]]);

  /**
   * get the shortest path within the icr network
   */
  let icr_path = shortest_path.calculate({
    source_long: startIcr.coordinates[0],
    source_lat: startIcr.coordinates[1],
    dest_long: endIcr.coordinates[0],
    dest_lat: endIcr.coordinates[1]
  });

  /**
   * Convert the icr shortest path into geojson format
   */
  let geoJsonIcr = path_2_geojson.convert(icr_path);
  /**
   * Add entry path and exit path to the icr geojson
   */
  geoJsonIcr.features[0] = geoJsonStart.features[0];
  geoJsonIcr.features.push(geoJsonEnd.features[0]);

  return geoJsonIcr;
};

module.exports.find_directions = find_directions;
