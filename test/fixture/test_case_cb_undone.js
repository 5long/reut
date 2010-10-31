var reut = require("../../src")
  , TestCase = reut.TestCase
  , EventEmitter = require("events").EventEmitter
  , desc = "Your cb() is not called in time"
  , lazyEventSource = new EventEmitter()

var undone = new TestCase(desc, function(assert) {
  lazyEventSource.on("launch", assert.cb(function() {
    assert.ok(1, "Alright, finally you called")
  }))
  process.nextTick(assert.end)
})

setTimeout(function() {
  lazyEventSource.emit("launch")
}, 10)

module.exports = {
  tc: undone
, desc: desc
, timeout: 5
, num: {
    all: 1
  , passed: 0
  , fail: 1
  }
}
