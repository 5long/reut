var util = require("./util")
  , assert = require("./assert")
  , AssertionError = assert.AssertionError
  , EventEmitter = require("events").EventEmitter
  , supportedAsserts = ("ok equal notEqual deepEqual notDeepEqual"
    + " strictEqual notStrictEqual throws doesNotThrow"
    + " instanceOf typeOf length match include cb in emits is isnt empty"
    ).split(" ")

function Test(desc, action) {
  if (arguments.length < 2) throw TypeError("Wrong number of arguments")
  this.desc = desc
  this._action = action
  this._results = []
  this.end = this.end.bind(this)
}
util.inherits(Test, EventEmitter)
Test.supportedAsserts = supportedAsserts.reduce(function(set, key) {
  set[key] = true
  return set
}, {})

supportedAsserts.forEach(function(name) {
  if (!(name in assert)) return
  Test.prototype[name] = function Self() {
    var e, posForMsg = assert[name].length - 1
      , msg = arguments[posForMsg]
    try {
      assert[name].apply(assert, arguments)
      this._log(true, msg)
    } catch (e) {
      if (!(e instanceof assert.AssertionError)) this._doEnd(e)
      e.stackStartFunction = Self
      this._log(false, msg, new AssertionError(e))
    }
  }
})

util.def(Test.prototype, {
  /*
   * Supposed to be called by test runner.
   */
  run: function(conf, cb) {
    var err
    this.emit("start")
    this._callback = util.isFunc(conf) ? conf : cb
    if (!this._timeoutHandler) this.timeout = 1
    try {this._action.call(null, this, conf.fixture || {})}
    catch (err) {this._doEnd(err)}
  }
  /*
   * Set timeout in milliseconds ensuring async test
   * ends eventually.
   */
, set timeout(ms) {
    this._clearTimeout()
    this._timeoutHandler = setTimeout(this.end, ms)
  }
, notice: function(msg) {
    this.emit("notice", msg)
  }
, cb: function Self(fn, msg) {
    // Hacky and incomplete, but it's the best I can do.
    var err = prepareError(fn, "not called", msg, "()", Self)
    return this._ensureExecute(fn, msg, err)
  }
, emits: function Self(source, type, fn, msg) {
    var err = prepareError(source, type, msg, "not emitted", Self)
    source.on(type, this._ensureExecute(fn, msg, err))
  }
, _ensureExecute: function(fn, msg, err) {
    var self = this
      , executed = false
    this.on("_beforeEnd", function() {
      if (!executed) this._log(false, msg, err)
    })
    return function() {
      executed = true
      self._log(true, msg)
      fn && fn.apply(this, arguments)
    }
  }
, _clearTimeout: function() {
    if (this._timeoutHandler) clearTimeout(this._timeoutHandler)
  }
  /*
   * Explicitly finish test
   */
, end: function() { this._doEnd(null) }
, _doEnd: function(err) {
    if (err) this.emit("error", err)
    this.emit("_beforeEnd")
    var result = this._report()
    this._clearTimeout()
    this.emit("end", result)
    util.defer(this._callback, [err, result])
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

function prepareError(expected, actual, msg, operator, stackTop) {
  return new AssertionError({
    message: msg
  , expected: expected
  , actual: actual
  , operator: operator
  , stackStartFunction: stackTop
  })
}

module.exports = Test
