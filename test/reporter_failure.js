var reut = require("../src")
  , assert = require("assert")
  , TestSuite = reut.TestSuite
  , FailureReporter = reut.reporter.Failure
  , sampleTest = require("./fixture/sample_test")
  , dummySuite = new TestSuite()
  , spyWritable = {
      input: []
    , write: function(str) {
        this.input.push(str)
      }
    }

var fr = new FailureReporter(spyWritable)

fr.watch(dummySuite)
dummySuite.add(sampleTest.t)
dummySuite.run(function(err) {
  assert.ifError(err)
})

process.on("exit", function() {
  assert.equal(spyWritable.input.length, sampleTest.num.failed)
})
