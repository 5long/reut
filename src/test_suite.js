var util = require('./util')
  , EventEmitter = require('events').EventEmitter

function TestSuite(desc) {
  this.desc = desc
  this._testCases = []
}
util.inherits(TestSuite, EventEmitter)

util.merge(TestSuite.prototype, {
  run: function(cb) {
    var thisSuite = this
      , actions = this._testCases.map(function(tc) {
          return function() {
            tc.run(function(err, result) {
              this(err, {desc: tc.desc, result: result})
            }.bind(this))
          }
        })
    util.serial(actions, cb)
  }
, add: function(testCase) {
    this._testCases.push(testCase)
  }
})

module.exports = TestSuite
