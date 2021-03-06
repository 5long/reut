var reut = require("../../src")
  , Test = reut.Test
  , EventEmitter = require("events").EventEmitter
  , desc = "Your cb() is not called in time"
  , lazyEventSource = new EventEmitter()

var undone = new Test(desc, function(assert) {
  lazyEventSource.on("launch", assert.cb(function() {
    assert.ok(1, "Alright, finally you called")
  }, "Expecting this to run"))
  process.nextTick(assert.end)
})

setTimeout(function() {
  lazyEventSource.emit("launch")
}, 10)

module.exports = {
  t: undone
, desc: desc
, timeout: 5
, num: {
    all: 1
  , passed: 0
  , fail: 1
  }
}
