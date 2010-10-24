var util = require('./util')
  , async = util.async
  , EventEmitter = require('events').EventEmitter

function TestSuite(desc) {
  this.desc = desc
  this._testCases = []
}
util.inherits(TestSuite, EventEmitter)

util.merge(TestSuite.prototype, {
  run: function(cb) {
    var thisSuite = this
    this.emit("start")

    async.map(this._testCases, function(tc) {
      thisSuite.emit("yield", tc)
      tc.run(this)
    }, function(err, results) {
      this.emit("end")
      cb(err, results)
    }.bind(this))
  }
, add: function(testCase) {
    this._testCases.push(testCase)
  }
, reportTo: function(reporter) {
    reporter.watch(this)
  }
})

module.exports = TestSuite
