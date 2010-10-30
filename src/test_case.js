var util = require("./util")
  , assert = require("./assert")
  , EventEmitter = require("events").EventEmitter
  , supportedAsserts = ("ok equal notEqual deepEqual notDeepEqual"
      + " strictEqual notStrictEqual throws doesNotThrow"
      + " instanceOf typeOf length match include cb").split(" ")

function TestCase(desc, action) {
  if (arguments.length < 2) throw TypeError("Wrong number of arguments")
  this.desc = desc
  this._action = action
  this._results = []
  this.end = this.end.bind(this)
}
util.inherits(TestCase, EventEmitter)
TestCase.supportedAsserts = supportedAsserts

supportedAsserts.forEach(function(name) {
  if (!(name in assert)) return
  TestCase.prototype[name] = function() {
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
})

util.def(TestCase.prototype, {
  /*
   * Supposed to be called by test runner.
   */
  run: function(cb) {
    var err
    this.emit("start")
    this._callback = cb
    try {this._action.call(null, this)}
    catch (err) {this._doEnd(err)}
  }
  /*
   * Set timeout in milliseconds ensuring async test
   * ends eventually.
   */
, set timeout(ms) {
    this._clearTimeout()
    this._timeoutHandler = setTimeout(function() {
      var msg = [ "Test"
                , this.desc
                , "doesn't end in"
                , ms
                , "ms"
                ].join(" ")
        , err = Error(msg)
      this.emit("error", err)
      this._doEnd(err)
    }.bind(this), ms || 0)
  }
, cb: function(fn) {
    return function() {
      fn.apply(this, arguments)
    }
  }
, _clearTimeout: function() {
    if (this._timeoutHandler) clearTimeout(this._timeoutHandler)
  }
  /*
   * Explicitly finish test case.
   */
, end: function() { this._doEnd(null) }
, _doEnd: function(err) {
    var result = this._report()
    this._clearTimeout()
    this.emit("end", result)
    process.nextTick(function() {
      this._callback(err, result)
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
, _log: function(passed, msg, err) {
    var result = err ? err : {message: msg}
    result.passed = passed

    this._results.push(result)
    this.emit("assert", result)
  }
})

module.exports = TestCase
