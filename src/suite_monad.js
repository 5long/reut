var util = require("./util")
  , Test = require("./test")

function SuiteMonad(suite) {
  this._suite = suite
}
util.merge(SuiteMonad.prototype, {
  test: function(desc, action) {
    this._suite.add(new Test(desc, action))
    return this
  }
})

"setup teardown startup shutdown".split(" ")
.forEach(defForward, SuiteMonad.prototype)

function defForward(old) {
  var neo = "add" + util.ucFirst(old)
  this[old] = function(fn) {
    this._suite[neo](fn)
    return this
  }
}

module.exports = SuiteMonad
