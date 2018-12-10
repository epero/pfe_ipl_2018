var fs = require("fs");
//var obj  = require('../icr-2017-01-01')
//var obj = require("../latlong_icr.json");

const parse = file => {
  file = require(`../geojsons/${file}`);
  let features = file.features;
  for (ii = 0; ii < features.length; ii++) {
    let feature = features[ii];
    let color;
    switch (feature.properties.icr) {
      case "1":
        color = "#00cc00";
        break;
      case "2":
        color = "#99b3ff";
        break;
      case "3":
        color = "#FF3232";
        break;
      case "4":
        color = "#9932FF";
        break;
      case "5":
        color = "#00510A";
        break;
      case "6":
        color = "#00510A";
        break;
      case "7":
        color = "#D12200";
        break;
      case "8":
        color = "#00cc00";
        break;
      case "9":
        color = "#9932FF";
        break;
      case "10":
        color = "#FF3232";
        break;
      case "11":
        color = "#187c00";
        break;
      case "12":
        color = "#00510A";
        break;
      case "A":
        color = "#FF8205";
        break;
      case "B":
        color = "#FF8205";
        break;
      case "C":
        color = "#FF8205";
        break;
      case "CK":
        color = "#05AFFF";
        break;
      case "SZ":
        color = "#05AFFF";
        break;
      case "MM":
        color = "#00256B";
        break;
      case "PP":
        color = "#D12200";
        break;
      default:
        color = "#0000FF";
    }
    feature.properties["color"] = color;
  }

  //CAREFULL because ASYNC
  fs.writeFile(
    `./icr-with-colors-${new Date()}.json`,
    JSON.stringify(file, null, 2),
    "utf-8"
  );
};

exports.parse = parse;
