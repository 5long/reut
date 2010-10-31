var sys, e, util = require("../util")
  , AbstractReporter = require("./abstract")
try {
  sys = require("util")
} catch (e) {
  sys = require("sys")
}

function FailureReporter(writable) {
  this._output = writable || process.stdout
}
util.inherits(FailureReporter, AbstractReporter)

util.merge(FailureReporter.prototype, {
  _watchTestCase: function(tc, suite) {
    var self = this
    tc.on("assert", function(result) {
      if (result.passed) return
      self._report(result, tc, suite)
    })
  }
, _report: function(result, tc, suite) {
    this._output.write(this._format(result, tc, suite))
  }
, _format: function(result, tc, suite) {
    // Assuming path seperator is "/"
    // and the format of stack trace remains.
    var matched = result.stack.match(/([^\/]+:\d+:\d+)/)
      , source = matched && matched[1]
    return [ "Assertion fail at"
           , source
           , result.message
           , "\n    expecting: "
           , sys.inspect(result.expected)
           , "\n    got: "
           , sys.inspect(result.actual)
           , "(" + result.operator + ")\n"
           ].join(" ")
  }
})

module.exports = FailureReporter
