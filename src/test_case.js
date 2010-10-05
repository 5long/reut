var util = require('./util')
  , assert = require('./assert')
  , EventEmitter = require('events').EventEmitter
  , supportedAsserts = ("ok equal notEqual deepEqual notDeepEqual"
      + " strictEqual notStrictEqual throws doesNotThrow"
      + " instanceOf typeOf").split(" ")

function TestCase(desc, action) {
  if (arguments.length < 2) throw TypeError("Wrong number of arguments")
  this.desc = desc
  this._action = action
  this._results = []
}

TestCase.prototype = Object.create(EventEmitter.prototype)
TestCase.supportedAsserts = supportedAsserts

supportedAsserts.forEach(function(name) {
  if (!(name in assert)) return
  this[name] = function() {
    var e, posForMsg = assert[name].length - 1
      , msg = arguments[posForMsg]
    try {
      assert[name].apply(assert, arguments)
      this._log(true, msg)
    } catch (e) {
      if (!(e instanceof assert.AssertionError)) this._doEnd(e)
      this._log(false, msg, e)
    }
  }
}, TestCase.prototype)

util.merge(TestCase.prototype, {
  /*
   * Supposed to be called by test runner.
   */
  run: function(cb) {
    var err
    this._callback = cb
    try {this._action(this)}
    catch (err) {this._doEnd(Error("Test Fail"))}
  }
  /*
   * Explicitly finish test case.
   */
, end: function() { this._doEnd(null) }
, _doEnd: function(err) {
    process.nextTick(function() {
      this._callback(err, this._report())
    }.bind(this))
  }
, _report: function() {
    var results = this._results.slice()
    return {
      all: results
    , passed: results.filter(function(r) {return r.passed })
    , failed: results.filter(function(r) {return !r.passed })
    }
  }
, _log: function(passed, msg, error) {
    var result = {passed: passed, desc: msg}
    if (error) result.error = error
    this._results.push(result)
    this.emit("assert", result)
  }
})

module.exports = TestCase
