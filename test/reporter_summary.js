var reut = require("../src")
  , EventEmitter = require("events").EventEmitter
  , assert = require("assert")
  , TestSuite = reut.TestSuite
  , SummaryReporter = reut.reporter.Summary
  , fixture = require("./fixture/sample_test_case")
  , sampleTestCase = fixture.tc
  , dummySuite = new TestSuite()
  , fakeWritable = {
      input: []
    , write: function(str) {
        this.input.push(str)
      }
    }

var sr = new SummaryReporter(fakeWritable)

sr.watch(dummySuite)
dummySuite.add(fixture.tc)
dummySuite.run(function(err) {
  assert.ifError(err)
})

process.on("exit", function() {
  var output = fakeWritable.input[0]
    , num = fixture.num
  assert.notEqual(output.indexOf(num.all), -1)
  assert.notEqual(output.indexOf(num.passed), -1)
  assert.notEqual(output.indexOf(num.failed), -1)
})
