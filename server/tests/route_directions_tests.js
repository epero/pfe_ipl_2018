/*var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised).should();

const ors = require("../routes/ors");
const graph = require("../my_modules/graph");
const test1 = require("../geojsons/timmer_arnold_test");
const test2 = require("../geojsons/francois-chapelle-test.json");

beforeEach("Setting up the graph", function() {
  console.log("beforeEach");
  graph.parse();
});

for (let index = 1; index < test1.features.length - 1; index++) {
  describe("Rue Timmermans => Avenue Arnold Delvaux Test", function() {
    it("should let me know that both objects are the same", function() {
      return ors
        .find_directions([
          ["4.3387555", "50.818967"],
          ["4.3407592", "50.8007046"]
        ])
        .should.eventually.have.property("features")
        .that.does.deep.include(test1.features[index]);
    });
  });
}

for (let index = 1; index < test2.features.length - 1; index++) {
  describe("Francois Gay => Clos Chapelle-aux-champs", function() {
    it("should let me know that both objects are the same", function() {
      return ors
        .find_directions([
          ["4.42749990163728", "50.83802865"],
          ["4.4495593", "50.8494209"]
        ])
        .should.eventually.have.property("features")
        .that.does.deep.include(test2.features[index]);
    });
  });
}*/
