var reut = require("../src")
  , assert = require("assert")
  , TestSuite = reut.TestSuite
  , ErrorReporter = reut.reporter.Error
  , errorTest = require("./fixture/error_test")
  , dummySuite = new TestSuite()
  , spyWritable = {
      input: []
    , write: function(str) {
        this.input.push(str)
      }
    }

var er = new ErrorReporter(spyWritable)

er.watch(dummySuite)
dummySuite.add(errorTest.t)
dummySuite.run(function(err) {
  if (err != errorTest.error) assert.ifError(err)
})

process.on("exit", function() {
  assert.equal(spyWritable.input.length, errorTest.num.error)
})
