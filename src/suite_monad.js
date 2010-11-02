var util = require("./util")
  , Test = require("./test")

function SuiteMonad(suite) {
  this._suite = suite
}
util.merge(SuiteMonad.prototype, {
  setup: function(fn) {
    this._suite.addSetup(fn)
    return this
  }
, test: function(desc, action) {
    if (arguments.length < 2) throw TypeError("Wrong number of arguments")
    this._suite.add(new Test(desc, action))
    return this
  }
})

module.exports = SuiteMonad
