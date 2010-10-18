var reut = require('../src')
  , TestSuite = reut.TestSuite
  , TestCase = reut.TestCase
  , assert = require('assert')
  , totalCallbacks = 2
  , remainingCallbacks = totalCallbacks
  , testCaseDesc = "a test case"

var aSuite = new TestSuite("no desc")
aSuite.add(new TestCase(testCaseDesc, function(test) {
  setTimeout(function() {
    test.ok(1, "I'm done")
    test.end()
  }, 10)
}))

aSuite.on("testStart", function(tc) {
  remainingCallbacks--
  assert.ok(tc instanceof TestCase)
  assert.equal(tc.desc, testCaseDesc)
})

aSuite.run(function(err, report) {
  assert.ifError(err)
  remainingCallbacks--
  assert.equal(report.length, 1)
  assert.equal(report[0].desc, testCaseDesc)
  assert.equal(report[0].result.passed.length, 1)
})

assert.equal(remainingCallbacks, totalCallbacks)

setTimeout(function() {
  process.exit(remainingCallbacks)
}, 20)
