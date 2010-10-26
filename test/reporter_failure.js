var reut = require("../src")
  , EventEmitter = require("events").EventEmitter
  , assert = require("assert")
  , TestSuite = reut.TestSuite
  , FailureReporter = reut.reporter.Failure
  , fixture = require("./fixture/sample_test_case")
  , sampleTestCase = fixture.tc
  , dummySuite = new TestSuite()
  , fakeWritable = {
      input: []
    , write: function(str) {
        this.input.push(str)
      }
    }


var fr = new FailureReporter(fakeWritable)

fr.watch(dummySuite)
dummySuite.add(fixture.tc)
dummySuite.run()

process.on("exit", function() {
  assert.equal(fakeWritable.input.length, fixture.num.failed)
})
