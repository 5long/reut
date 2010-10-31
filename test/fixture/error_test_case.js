var reut = require("../../src")
  , TestCase = reut.TestCase
  , desc = "Throw it on your face"

var thrower = new TestCase(desc, function(assert) {
  assert.include("wakakakakakaa", "aa", "Going")
  throw module.exports.error = Error("Yeeeeeeeeha!")
})

module.exports = {
  tc: thrower
, desc: desc
, num: {
    all: 1
  , passed: 1
  , fail: 0
  , error: 1
  }
}
