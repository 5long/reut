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
      conf = {shuffle: false}
    }
    conf.fixture = conf.fixture || {}
    async.chain(
      function setup() {
        thisSuite._doStartup(conf.fixture, this)
        if (conf.shuffle) {
          thisSuite._tests = util.shuffle(thisSuite._tests)
        }
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
, reportTo: function(reporter) {
    reporter.watch(this)
  }
})

"setup teardown startup shutdown".split(" ")
.forEach(boundAsyncQueue, TestSuite.prototype)

function boundAsyncQueue(key) {
  var ucFirst = util.ucFirst(key)
    , keyExecute = "_do" + ucFirst
    , keyQueue = "_" + key + "Queue"
    , keyAdd = "add" + ucFirst

  this[keyExecute] = function(fixture, cb) {
    async.map(this[keyQueue], function(fn) {
      fn(fixture, this)
    }, cb)
  }
  this[keyAdd] = function(fn) {
    var oldFn = fn
    if (fn.length == 1) {
      fn = function wrapSync(fixture, done) {
        oldFn.apply(this, arguments)
        done()
      }
    }
    this[keyQueue].push(fn)
  }
}

module.exports = TestSuite
