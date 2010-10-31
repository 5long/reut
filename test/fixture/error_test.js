var reut = require("../../src")
  , Test = reut.Test
  , desc = "Throw it on your face"

var thrower = new Test(desc, function(assert) {
  assert.include("wakakakakakaa", "aa", "Going")
  throw module.exports.error = Error("Yeeeeeeeeha!")
})

module.exports = {
  t: thrower
, desc: desc
, num: {
    all: 1
  , passed: 1
  , fail: 0
  , error: 1
  }
}
