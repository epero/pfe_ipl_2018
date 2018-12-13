/**
 * Module qui encapsule les requêtes à l’API open route service.
 */
/**
 * Imports
 */
const OrsDirections = require("openrouteservice-js/src/OrsDirections");
const irc_2_color = require("./icr_2_color");
const config = require("../config");

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
      profile: config.ors.profile,
      preference: config.ors.preference,
      units: config.ors.units,
      language: config.ors.language,
      format: config.ors.format,
      instructions: config.ors.instructions,
      continue_straight: config.ors.continue_straight
    })
      .then(json => {
        //formatter les geojson renvoyés par ORS pour qu’il aient la structure défini par notre API
        json.features[0].properties.icr = "ors";
        json.features[0].properties.color = irc_2_color.get("ors");
        resolve(json);
      })
      .catch(err => {
        var str = "An error occured: " + err;
        reject(err);
      });
  });
};

exports.calculate = calculate;
