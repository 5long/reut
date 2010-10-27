var assert = require("assert")
  , reut = require("reut")
  , TestCase = reut.TestCase
  , fixture = require("./fixture/test_case_never_end")
  , remainingCallback = 3

var neverEnd = fixture.tc
neverEnd.timeout = fixture.timeout

neverEnd.on("end", function(result) {
  remainingCallback--
  assert.ok(1, "Still we caught the event")
  assert.equal(fixture.num.passed, result.passed.length)
})

neverEnd.on("error", function(err) {
  remainingCallback--
  timeoutError = err
  assert.ok(err instanceof Error, "Emit error event instead")
})

neverEnd.run(function(err) {
  remainingCallback--
  assert.ok(err instanceof Error, "Emit error event instead")
})

setTimeout(function() {
  process.exit(remainingCallback)
}, 2 * fixture.timeout)
