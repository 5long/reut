var reut = require("../src")
  , assert = require("assert")
  , TestSuite = reut.TestSuite
  , SummaryReporter = reut.reporter.Summary
  , sampleTest = require("./fixture/sample_test")
  , dummySuite = new TestSuite()
  , spyWritable = {
      input: []
    , write: function(str) {
        this.input.push(str)
      }
    }

var sr = new SummaryReporter(spyWritable)

sr.watch(dummySuite)
dummySuite.add(sampleTest.t)
dummySuite.run(function(err) {
  assert.ifError(err)
})

process.on("exit", function() {
  process.emit("_reutTestEnd")
  var output = spyWritable.input[0]
    , num = sampleTest.num
  assert.notEqual(output.indexOf(num.all), -1)
  assert.notEqual(output.indexOf(num.passed), -1)
  assert.notEqual(output.indexOf(num.failed), -1)
})
