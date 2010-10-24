var reut = require("../src")
  , EventEmitter = require("events").EventEmitter
  , assert = require("assert")
  , TestSuite = reut.TestSuite
  , SimpleReporter = reut.reporter.Simple
  , fixture = require("./fixture/sample_test_case")
  , sampleTestCase = fixture.tc
  , dummySuite = new TestSuite()
  , fakeWritable = {
      input: []
    , write: function(str) {
        this.input.push(str)
      }
    }


var sr = new SimpleReporter(fakeWritable)

sr.watch(dummySuite)
dummySuite.add(fixture.tc)
dummySuite.run()

process.on("exit", function() {
  assert.equal(fakeWritable.input.length, fixture.num.failed)
})
