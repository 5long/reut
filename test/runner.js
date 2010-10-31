var reut = require("../src")
  , assert = require("assert")
  , remainingCallbacks = 2
  , spyReporter = {
      watch: function() {
        remainingCallbacks--
      }
    }
  , opt = {
      reporters: [spyReporter]
    }

function assertFunc(obj) {
  assert.equal(typeof obj, "function")
}

assertFunc(reut.suite)
assertFunc(reut.test)

reut.test("A test", function(test) {
  remainingCallbacks--
  test.end()
})

assert.notDeepEqual(reut._suites, [])

reut.run(opt, function(err) {
  assert.ifError(err)
})

setTimeout(function() {
  process.exit(remainingCallbacks)
}, 20)
