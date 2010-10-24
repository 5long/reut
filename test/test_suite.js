var reut = require('../src')
  , TestSuite = reut.TestSuite
  , TestCase = reut.TestCase
  , assert = require('assert')
  , totalCallbacks = 5
  , remainingCallbacks = totalCallbacks
  , testCaseDesc = "a test case"
  , fakeReporter = {
      watch: function() {
        process.nextTick(function() {
          remainingCallbacks--
        })
      }
    }

var aSuite = new TestSuite("no desc")
aSuite.reportTo(fakeReporter)
aSuite.add(new TestCase(testCaseDesc, function(test) {
  setTimeout(function() {
    test.ok(1, "I'm done")
    test.end()
  }, 10)
}))

aSuite.on("start", function() {
  process.nextTick(function() {
    remainingCallbacks--
  })
})

aSuite.on("yield", function(tc) {
  remainingCallbacks--
  assert.ok(tc instanceof TestCase)
  assert.equal(tc.desc, testCaseDesc)
})

aSuite.on("end", function() {
  remainingCallbacks--
})

aSuite.run(function(err, report) {
  assert.ifError(err)
  remainingCallbacks--
  assert.equal(report.length, 1)
  assert.equal(report[0].passed.length, 1)
})

assert.equal(remainingCallbacks, totalCallbacks)

setTimeout(function() {
  process.exit(remainingCallbacks)
}, 20)
