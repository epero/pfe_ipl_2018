const fs = require("fs");
const irc_2_color = require("./icr_2_color");

/**
 * Add an appropriate color proprety to each feature in the geojson
 */
const parse = source_file => {
  let pathname = `../geojsons/${source_file}`;
  let file = require(pathname);
  let features = file.features;
  for (let index = 0; index < features.length; index++) {
    let feature = features[index];
    let color = irc_2_color.get(feature.properties.icr);
    feature.properties["color"] = color;
  }
  fs.writeFileSync(
    `./geojsons/icr-with-colors.json`,
    JSON.stringify(file, null, 2),
    "utf-8",
    err => {
      if (err) throw err;
    }
  );
};

return "icr-with-colors";

exports.parse = parse;
