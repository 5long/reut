var assert = require("assert")
  , TestCase = require("reut").TestCase
  , holder = {remainingCallbacks: 1}
  , h = holder
  , msg = {
      passed: "This should pass"
    , failed: "This should fail"
    }

var theCase = new TestCase("a simple one", function(test) {
  test.ok(true, msg.passed)
  test.ok(0, msg.failed)
  test.equal("foo", "bar")
  test.end()
})

theCase.run(function(err, report) {
  h.remainingCallbacks--
  var passed = report.passed[0]
    , failed = report.failed[0]
    , withOutMsg = report.failed[1]
  assert.equal(report.all.length, 3, "3 assertions")
  assert.equal(report.passed.length, 1, "1 passed")
  assert.equal(report.failed.length, 2, "2 failed")
  assert.equal(passed.desc, msg.passed, 'same message')
  assert.equal(failed.desc, msg.failed, 'same message')
  assert.equal(typeof withOutMsg.desc, "undefined", 'no message')
})

setTimeout(function() {
  process.exit(h.remainingCallbacks)
}, 10)
