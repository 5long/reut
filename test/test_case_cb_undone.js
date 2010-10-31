var assert = require("assert")
  , reut = require("reut")
  , TestCase = reut.TestCase
  , fixture = require("./fixture/test_case_cb_undone")
  , remainingCallback = 3
  , tc = fixture.tc

tc.run(function(err, result) {
  var failed = result.failed[0]
  assert.ifError(err)
  assert.equal(result.failed.length, fixture.num.fail)
  assert.equal(typeof failed.stack, "string")
})
