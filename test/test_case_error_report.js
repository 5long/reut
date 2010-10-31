var reut = require("../src")
  , assert = require("assert")
  , TestSuite = reut.TestSuite
  , ErrorReporter = reut.reporter.Error
  , errorTestCase = require("./fixture/error_test_case")
  , dummySuite = new TestSuite()
  , spyWritable = {
      input: []
    , write: function(str) {
        this.input.push(str)
      }
    }

var er = new ErrorReporter(spyWritable)

er.watch(dummySuite)
dummySuite.add(errorTestCase.tc)
dummySuite.run(function(err) {
  if (err != errorTestCase.error) assert.ifError(err)
})

process.on("exit", function() {
  assert.equal(spyWritable.input.length, errorTestCase.num.error)
})
