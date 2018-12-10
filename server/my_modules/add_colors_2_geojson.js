var fs = require("fs");
var irc_2_color = require("./icr_2_color");
//var obj  = require('../icr-2017-01-01')
//var obj = require("../latlong_icr.json");
let file = require("../geojsons/icr-with-intersections");

const parse = () => {
  //let pathname = `../geojsons/${source_file}`;
  //console.log(pathname);
  //let file = require(source_file);
  let features = file.features;
  for (ii = 0; ii < features.length; ii++) {
    let feature = features[ii];
    console.log(feature.properties.icr);
    let colorr = irc_2_color.find(feature.properties.icr);
    console.log(colorr);
    feature.properties["color"] = colorr;
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
