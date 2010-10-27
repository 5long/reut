var reut = require("../../src")
  , TestCase = reut.TestCase
  , desc = "I don't call end() explicitly"

var neverEnd = new TestCase(desc, function(assert) {
  assert.include("holy shit", "hi", "I don't fail")
  assert.typeOf(/blah/, "function", "I just don't end")
})

module.exports = {
  tc: neverEnd
, desc: desc
, timeout: 5
, num: {
    all: 2
  , passed: 2
  , fail: 0
  }
}
