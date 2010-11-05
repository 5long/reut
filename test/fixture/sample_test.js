var reut = require("../../src")
  , Test = reut.Test
  , EventEmitter = require("events").EventEmitter
  , msg = {
      passed: "This should pass"
    , failed: "This should fail"
    , notice: "I'm going on!"
    }

var t = new Test("a simple one", function(test) {
  test.notice(msg.notice)
  test.instanceOf(test, EventEmitter, msg.passed)
  test.typeOf(0, "string", msg.failed)
  test.length([], 1)
  test.include(["holy", "shit"], "holy")
  test.match("foo", /o+$/)
  test.throws(function() {
    return somethingUndefined
  }, ReferenceError)
  test.in("foo", {fo: 2})
  test.in(0, ["yep"])
  test.is(42, "42", "fail")
  test.isnt(0/0, NaN)
  test.empty("")
  test.empty([])
  test.empty({})
})

module.exports = {
  t: t
, testDesc: "a simple one"
, msg: msg
, num: {
    all: 13
  , passed: 9
  , failed: 4
  }
}
