var assert = require("assert")
  , reut = require("../src")
  , Test = reut.Test
  , fixture = require("./fixture/test_emit")
  , t = fixture.t

t.run(function(err, result) {
  assert.ifError(err)
  assert.equal(result.failed.length, fixture.num.fail)
  assert.equal(result.all.length, fixture.num.all)
  assert.equal(result.passed.length, fixture.num.passed)
})
