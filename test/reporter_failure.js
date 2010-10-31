var reut = require("../src")
  , assert = require("assert")
  , TestSuite = reut.TestSuite
  , FailureReporter = reut.reporter.Failure
  , sampleTestCase = require("./fixture/sample_test_case")
  , dummySuite = new TestSuite()
  , spyWritable = {
      input: []
    , write: function(str) {
        this.input.push(str)
      }
    }

var fr = new FailureReporter(spyWritable)

fr.watch(dummySuite)
dummySuite.add(sampleTestCase.tc)
dummySuite.run(function(err) {
  assert.ifError(err)
})

process.on("exit", function() {
  assert.equal(spyWritable.input.length, sampleTestCase.num.failed)
})
