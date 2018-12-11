var fs = require("fs");
var irc_2_color = require("./icr_2_color");
//let file = require('../icr-2017-01-01')
let file = require("../geojsons/icr-with-intersections");

const parse = () => {
  //let pathname = `../geojsons/${source_file}`;
  //console.log(pathname);
  //let file = require(source_file);
  let features = file.features;
  for (let index = 0; index < features.length; index++) {
    let feature = features[index];
    //console.log(feature.properties.icr);
    let color = irc_2_color.get(feature.properties.icr);
    //console.log(colorr);
    feature.properties["color"] = color;
  }
  //console.log(file);
  //CAREFULL because ASYNC
  fs.writeFile(
    `./geojsons/icr-with-colors.json`,
    JSON.stringify(file, null, 2),
    "utf-8",
    err => {
      if (err) throw err;
    }
  );
};

exports.parse = parse;
