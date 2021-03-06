var reut = require("../../src")
  , Test = reut.Test
  , EventEmitter = require("events").EventEmitter
  , desc = "Typical async test"
  , es = new EventEmitter()
  , msg = "Coming!"

var asyncTest = new Test(desc, function(assert) {
  assert.timeout = 15
  assert.emits(es, "launch", function(received) {
    assert.equal(received, msg)
  }, "This should emit")
  assert.emits(es, "finish")
  assert.emits(es, "nope")

  assert.throws(function() {
    assert.emit(es, "misSpell")
  })
})

process.nextTick(function() {
  es.emit("launch", msg)
})

setTimeout(function() {
  es.emit("finish")
}, 5)

module.exports = {
  t: asyncTest
, desc: desc
, timeout: 15
, msg: msg
, num: {
    all: 5
  , passed: 4
  , fail: 1
  }
}
