var reut = require('../src')
  , TestSuite = reut.TestSuite
  , TestCase = reut.TestCase
  , assert = require('assert')
  , holder = {status: 1}
  , testCaseDesc = "a test case"

var aSuite = new TestSuite("no desc")
aSuite.add(new TestCase(testCaseDesc, function(test) {
  setTimeout(function() {
    test.ok(1, "I'm done")
    test.end()
  }, 10)
}))

aSuite.run(function(err, report) {
  assert.ifError(err)
  holder.status = 0
  assert.equal(report.length, 1)
  assert.equal(report[0].desc, testCaseDesc)
  assert.equal(report[0].result.passed.length, 1)
})

assert.ok(holder.status)

setTimeout(function() {
  process.exit(holder.status)
}, 20)
