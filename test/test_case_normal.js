var assert = require("assert")
  , TestCase = require("reut").TestCase
  , holder = {remainingCallbacks: 1}
  , EventEmitter = require('events').EventEmitter
  , h = holder
  , resultsByEvent = []
  , msg = {
      passed: "This should pass"
    , failed: "This should fail"
    }

function assertFunc(obj) {
  assert.equal(typeof obj, "function")
}

var selfTest = new TestCase("a simple one", function(test) {
  test.on("assert", function(result) {
    resultsByEvent.push(result)
  })
  test.instanceOf(test, EventEmitter, msg.passed)
  test.typeOf(0, "string", msg.failed)
  test.strictEqual(selfTest, test)
  test.equal("foo", "bar")
  test.throws(function() {
    return somethingUndefined
  }, ReferenceError)
  test.end()
})

TestCase.supportedAsserts.forEach(function(name) {
  assertFunc(this[name])
}, TestCase.prototype)

selfTest.run(function(err, report) {
  h.remainingCallbacks--
  var passed = report.passed[0]
    , failed = report.failed[0]
    , withOutMsg = report.failed[1]
  assert.ifError(err)
  assert.equal(report.all.length, 5, "5 assertions")
  assert.equal(report.passed.length, 3, "3 passed")
  assert.equal(report.failed.length, 2, "2 failed")
  assert.equal(passed.desc, msg.passed, 'same message')
  assert.equal(failed.desc, msg.failed, 'same message')
  assert.equal(typeof withOutMsg.desc, "undefined", 'no message')
  assert.deepEqual(resultsByEvent, report.all)
})

setTimeout(function() {
  process.exit(h.remainingCallbacks)
}, 10)
