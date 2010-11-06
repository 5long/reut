var reut = require("../src")
  , Test = reut.Test
  , assert = require("assert")

var t = new Test("a failing one", function(t) {
  t.ok(0, "native failure")
  t.in(0, {}, "extended one")
  function cb(){}
  t.cb(cb, "an async one")
  process.nextTick(cb)
})

t.run(function(err, results) {
  if (err) throw err
  results = results.failed
  results.forEach(function(r) {
    assert.ok(
      r.stack.split("\n")[1].indexOf(__filename) != -1
    , r.message + " aint got proper stack top"
    )
  })
})
