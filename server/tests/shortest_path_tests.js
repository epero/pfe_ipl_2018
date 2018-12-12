var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised).should();
const folder = "./geojsons/";
const config = require("../config.json");
const graph = require("../my_modules/graph");
const config = require("../config.json");
const test1 = require(folder + config.test._1.file);
const test2 = require(folder + config.test._2.file);

beforeEach("Setting up the graph", function() {
  graph.convert(config.icr_search.geojson);
});

describe(config.test._1.description, function() {
  it(config.test._1.message, function() {
    return graph
      .calculate({
        source_long: config.test._1.source_long,
        source_lat: config.test._1.source_lat,
        dest_long: config.test._1.dest_long,
        dest_lat: config.test._1.dest_lat
      })
      .should.deep.equal(test1);
  });
});

describe(config.test._2.description, function() {
  it(config.test._2.message, function() {
    return graph
      .calculate({
        source_long: config.test._2.source_long,
        source_lat: config.test._2.source_lat,
        dest_long: config.test._2.dest_long,
        dest_lat: config.test._2.dest_lat
      })
      .should.deep.equal(test2);
  });
});
