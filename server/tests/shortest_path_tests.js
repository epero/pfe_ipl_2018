//timer
//4.338735111116296, 50.820070369227444, 4.341406007873148, 50.79994071139812;
//gay
//4.418409863814158,50.83854259432855,4.449578660453536,50.84759308341391
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised).should();

const graph = require("../my_modules/graph");
const test1 = require("../geojsons/timmer_arnold_icr_test");
const test2 = require("../geojsons/francois-chapelle-icr-test.json");

beforeEach("Setting up the graph", function() {
  console.log("beforeEach");
  graph.parse();
});

describe("Rue Timmermans => Avenue Arnold Delvaux Test", function() {
  it("should let me know that both objects are the same", function() {
    return graph
      .calculate({
        source_long: 4.338735111116296,
        source_lat: 50.820070369227444,
        dest_long: 4.341406007873148,
        dest_lat: 50.79994071139812
      })
      .should.deep.equal(test1);
  });
});

//4.418409863814158,50.83854259432855,4.449578660453536,50.84759308341391

describe("Francois Gay => Clos Chapelle-aux-champs", function() {
  it("should let me know that both objects are the same", function() {
    return graph
      .calculate({
        source_long: 4.418409863814158,
        source_lat: 50.83854259432855,
        dest_long: 4.449578660453536,
        dest_lat: 50.84759308341391
      })
      .should.deep.equal(test2);
  });
});
