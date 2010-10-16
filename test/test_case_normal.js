var assert = require("assert")
  , TestCase = require("../src").TestCase
  , EventEmitter = require("events").EventEmitter
  , resultsByEvent = []
  , remainingCallbacks = 2
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
  test.implement(test, EventEmitter)
  test.equal("foo", "bar")
  test.throws(function() {
    return somethingUndefined
  }, ReferenceError)
  test.end()
})

var asyncTest = new TestCase("an async one", function(test) {
  process.nextTick(test.end)
})

TestCase.supportedAsserts.forEach(function(name) {
  assertFunc(this[name])
}, TestCase.prototype)

selfTest.run(function(err, report) {
  remainingCallbacks--
  var passed = report.passed[0]
    , failed = report.failed[0]
    , withOutMsg = report.failed[1]
  assert.ifError(err)
  assert.equal(report.all.length, 5, "5 assertions")
  assert.equal(report.passed.length, 3, "3 passed")
  assert.equal(report.failed.length, 2, "2 failed")
  assert.equal(passed.desc, msg.passed, "same message")
  assert.equal(failed.desc, msg.failed, "same message")
  assert.equal(typeof withOutMsg.desc, "undefined", "no message")
  assert.deepEqual(resultsByEvent, report.all)
})

asyncTest.run(function() {
  remainingCallbacks--
})

setTimeout(function() {
  process.exit(remainingCallbacks)
}, 10)
