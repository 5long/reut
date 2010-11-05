var util = require('./util')
  , async = util.async
  , EventEmitter = require('events').EventEmitter

function TestSuite(desc) {
  this.desc = desc
  this._setupQueue = []
  this._teardownQueue = []
  this._tests = []
}
util.inherits(TestSuite, EventEmitter)

util.merge(TestSuite.prototype, {
  run: function(conf, cb) {
    var thisSuite = this
    if (util.isFunc(conf)) {
      cb = conf
      conf = {fixture: {}}
    }
    async.chain(
      function setup() {
        thisSuite._doSetup(conf.fixture, this)
      }
    , function test(err) {
        if (err) throw err
        thisSuite.emit("start")
        async.map(thisSuite._tests, function(t) {
          thisSuite.emit("yield", t)
          t.run(conf, this)
        }, this)
      }
    , function teardown(err, results) {
        if (err) return this(err, [])
        thisSuite._doTeardown(conf.fixture, this)
      }
    , function end(err, dummy, results) {
        thisSuite.emit("end")
        cb(err, results)
      }
    )
  }
, _doSetup: function(fixture, cb) {
    async.map(this._setupQueue, function(fn) {
      fn(fixture, this)
    }, cb)
  }
, _doTeardown: function(fixture, cb) {
    async.map(this._teardownQueue, function(fn) {
      fn(fixture, this)
    }, cb)
  }
, add: function(test) {
    this._tests.push(test)
  }
, addSetup: function(fn) {
    this._setupQueue.push(fn)
  }
, addTeardown: function(fn) {
    this._teardownQueue.push(fn)
  }
, reportTo: function(reporter) {
    reporter.watch(this)
  }
})

module.exports = TestSuite
