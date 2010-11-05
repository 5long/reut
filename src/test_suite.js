var util = require('./util')
  , async = util.async
  , EventEmitter = require('events').EventEmitter

function TestSuite(desc) {
  this.desc = desc
  this._setupQueue = []
  this._teardownQueue = []
  this._startupQueue = []
  this._shutdownQueue = []
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
        thisSuite._doStartup(conf.fixture, this)
      }
    , function test(err) {
        if (err) throw err
        thisSuite.emit("start")
        async.map(thisSuite._tests, function(t) {
          thisSuite._runTest(t, conf, this)
        }, this)
      }
    , function teardown(err, results) {
        if (err) return this(err, [])
        thisSuite._doShutdown(conf.fixture, this)
      }
    , function end(err, dummy, results) {
        thisSuite.emit("end")
        cb(err, results)
      }
    )
  }
, _doSetup: function(fixture, cb) {
    async.paraMap(this._setupQueue, function(fn) {
      fn(fixture, this)
    }, cb)
  }
, _doTeardown: function(fixture, cb) {
    async.paraMap(this._teardownQueue, function(fn) {
      fn(fixture, this)
    }, cb)
  }
, _doStartup: function(fixture, cb) {
    async.paraMap(this._startupQueue, function(fn) {
      fn(fixture, this)
    }, cb)
  }
, _doShutdown: function(fixture, cb) {
    async.paraMap(this._startupQueue, function(fn) {
      fn(fixture, this)
    }, cb)
  }
, _runTest: function(t, conf, cb) {
    var thisSuite = this
    async.chain(
      function setup() {
        thisSuite._doSetup(conf.fixture, this)
      }
    , function run(err) {
        thisSuite.emit("yield", t)
        t.run(conf, this)
      }
    , function(err, result) {
        if (err) return this(err, result)
        thisSuite._doTeardown(conf.fixture, this)
      }
    , function(err, dummy, result) {
        cb(err, result)
      }
    )
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
