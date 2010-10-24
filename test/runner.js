var reut = require("../src")
  , assert = require("assert")
  , holder = {status: 1}

function assertFunc(obj) {
  assert.equal(typeof obj, "function")
}

assertFunc(reut.suite)
assertFunc(reut.test)

reut.test("A test", function(test) {
  holder.status = 0
  test.end()
})

reut.run()

setTimeout(function() {
  process.exit(holder.status)
}, 20)
