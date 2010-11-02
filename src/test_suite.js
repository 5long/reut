var util = require('./util')
  , async = util.async
  , EventEmitter = require('events').EventEmitter

function TestSuite(desc) {
  this.desc = desc
  this._setupQueue = []
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
    this._doSetup(conf.fixture, function(err) {
      if (err) throw err
      this.emit("start")

      async.map(this._tests, function(t) {
        thisSuite.emit("yield", t)
        t.run(conf, this)
      }, function(err, results) {
        thisSuite.emit("end")
        cb(err, results)
      })
    }.bind(this))
  }
, _doSetup: function(fixture, cb) {
    async.map(this._setupQueue, function(fn) {
      fn(fixture, this)
    }, cb)
  }
, add: function(test) {
    this._tests.push(test)
  }
, addSetup: function(fn) {
    this._setupQueue.push(fn)
  }
, reportTo: function(reporter) {
    reporter.watch(this)
  }
})

module.exports = TestSuite
