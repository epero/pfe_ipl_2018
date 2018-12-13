const folder = "./geojsons/";
const fs = require("fs");
const add_colors_2_geojsons = require("../my_modules/add_colors_2_geojson");
const add_intersections_2_geojson = require("../my_modules/add_intersections_2_geojson");
const bl72_parseur = require("../my_modules/bl72_parseur");
const config = require("../config.json");

let newest;
fs.readdirSync(folder).forEach(file => {
  let currEnd = file.split("icr-").pop();
  if (!currEnd.startsWith("with")) {
    if (!newest || newest.split("icr-").pop() < currEnd) {
      newest = file;
    }
  }
});
let pathname = `../geojsons/${newest}`;
let file = require(pathname);
if (file.crs && file.crs.properties.name === "urn:ogc:def:crs:EPSG::31370") {
  newest = bl72_parseur.parse(newest);
}
let working_file = add_colors_2_geojsons.parse(newest);

config.icr_search.geojson = working_file;
