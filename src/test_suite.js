var util = require('./util')
  , async = util.async
  , EventEmitter = require('events').EventEmitter

function TestSuite(desc) {
  this.desc = desc
  this._tests = []
}
util.inherits(TestSuite, EventEmitter)

util.merge(TestSuite.prototype, {
  run: function(cb) {
    if (typeof cb != "function") cb = util.noop
    var thisSuite = this
    this.emit("start")

    async.map(this._tests, function(t) {
      thisSuite.emit("yield", t)
      t.run(this)
    }, function(err, results) {
      this.emit("end")
      cb(err, results)
    }.bind(this))
  }
, add: function(test) {
    this._tests.push(test)
  }
, reportTo: function(reporter) {
    reporter.watch(this)
  }
})

module.exports = TestSuite
