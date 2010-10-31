var assert = require("assert")
  , TestCase = require("../src").TestCase
  , EventEmitter = require("events").EventEmitter
  , resultsByEvent = []
  , fixture = require("./fixture/sample_test_case")
  , remainingCallbacks = 6
  , msg = fixture.msg
  , someEventSource = new EventEmitter()

function assertFunc(obj) {
  assert.equal(typeof obj, "function")
}

var simpleTest = fixture.tc
simpleTest.on("assert", function(result) {
  resultsByEvent.push(result)
})

var asyncTest = new TestCase("an async one", function(test) {
  remainingCallbacks--
  test.timeout = 5
  someEventSource.on("launch", test.cb(function(num) {
    remainingCallbacks--
    test.equal(num, num, "But it's NaN!")
  }))
})

process.nextTick(function() {
  someEventSource.emit("launch", NaN)
})

simpleTest.on("end", function(report) {
  remainingCallbacks--
  assert.ok(report.all instanceof Array)
})

asyncTest.on("start", function() {
  process.nextTick(function() {
    remainingCallbacks--
  })
})

for (var name in TestCase.supportedAsserts) {
  assertFunc(TestCase.prototype[name])
}

simpleTest.run(function(err, report) {
  remainingCallbacks--
  var passed = report.passed[0]
    , failed = report.failed[0]
    , withOutMsg = report.failed[1]
  assert.ifError(err)
  assert.equal(report.all.length, fixture.num.all)
  assert.equal(report.passed.length, fixture.num.passed)
  assert.equal(report.failed.length, fixture.num.failed)
  assert.equal(passed.message, msg.passed, "same message")
  assert.equal(failed.message, msg.failed, "same message")
  assert.ok(failed instanceof assert.AssertionError)
  assert.equal(typeof withOutMsg.desc, "undefined", "no message")
  assert.deepEqual(resultsByEvent, report.all)
})

asyncTest.run(function(err, result) {
  assert.ifError(err)
  remainingCallbacks--
  assert.equal(result.all.length, 2)
})

setTimeout(function() {
  process.exit(remainingCallbacks)
}, 10)
