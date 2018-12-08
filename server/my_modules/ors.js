/**
 * Imports
 */
const OrsDirections = require("openrouteservice-js/src/OrsDirections");

/**
 * Variables
 */
// add api_key here
const Directions = new OrsDirections({
  api_key: "5b3ce3597851110001cf62489e0ad257d6a243258d97b69f557db726" //TODO process.env.ORS_KEY
});

/**
 * Calculate direction
 */
let calculate = coordinates => {
  return new Promise((resolve, reject) => {
    Directions.calculate({
      coordinates: coordinates,
      profile: "cycling-regular",
      preference: "recommended",
      units: "m",
      language: "fr", //TODO change according to user language
      format: "geojson", // TODO change accordingly
      instructions: "true"
    })
      .then(json => {
        resolve(json);
      })
      .catch(err => {
        var str = "An error occured: " + err;
        reject(err);
      });
  });
};

exports.calculate = calculate;
