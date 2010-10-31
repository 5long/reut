var reut = require("../../src")
  , TestCase = reut.TestCase
  , EventEmitter = require("events").EventEmitter
  , msg = {
      passed: "This should pass"
    , failed: "This should fail"
    , notice: "I'm going on!"
    }

var tc = new TestCase("a simple one", function(test) {
  test.notice(msg.notice)
  test.instanceOf(test, EventEmitter, msg.passed)
  test.typeOf(0, "string", msg.failed)
  test.length([], 1)
  test.include(["holy", "shit"], "holy")
  test.match("foo", /o+$/)
  test.throws(function() {
    return somethingUndefined
  }, ReferenceError)
})

module.exports = {
  tc: tc
, testCaseDesc: "a simple one"
, msg: msg
, num: {
    all: 6
  , passed: 4
  , failed: 2
  }
}
