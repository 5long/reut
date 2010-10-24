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
    async.map(this._testCases, function(tc) {
      thisSuite.emit("testStart", tc)
      tc.run(this)
    }, cb)
  }
, add: function(testCase) {
    this._testCases.push(testCase)
  }
})

module.exports = TestSuite
