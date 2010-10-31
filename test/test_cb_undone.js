var assert = require("assert")
  , reut = require("../src")
  , Test = reut.Test
  , fixture = require("./fixture/test_cb_undone")
  , remainingCallback = 3
  , t = fixture.t

t.run(function(err, result) {
  var failed = result.failed[0]
  assert.ifError(err)
  assert.equal(result.failed.length, fixture.num.fail)
  assert.equal(typeof failed.stack, "string")
})
