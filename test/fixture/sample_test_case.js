var reut = require("../../src")
  , TestCase = reut.TestCase
  , EventEmitter = require("events").EventEmitter
  , msg = {
      passed: "This should pass"
    , failed: "This should fail"
    }

var tc = new TestCase("a simple one", function(test) {
  test.instanceOf(test, EventEmitter, msg.passed)
  test.typeOf(0, "string", msg.failed)
  test.length([], 1)
  test.match("foo", /o+$/)
  test.throws(function() {
    return somethingUndefined
  }, ReferenceError)
  test.end()
})

module.exports = {
  tc: tc
, testCaseDesc: "a simple one"
, msg: msg
, num: {
    all: 5
  , passed: 3
  , failed: 2
  }
}