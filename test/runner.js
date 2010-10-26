var reut = require("../src")
  , assert = require("assert")
  , remainingCallbacks = 2
  , dummyReporter = {
      watch: function() {
        remainingCallbacks--
      }
    }
  , opt = {
      reporters: [dummyReporter]
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

reut.run(opt)

setTimeout(function() {
  process.exit(remainingCallbacks)
}, 20)
