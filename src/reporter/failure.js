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
  _watchTest: function(t, suite) {
    var self = this
    t.on("assert", function(result) {
      if (result.passed) return
      self._report(result, t, suite)
    })
  }
, _report: function(result, t, suite) {
    this._output.write(this._format(result, t, suite))
  }
, _format: function(result, t, suite) {
    // Assuming the format of stack trace remains
    var matched = result.stack.match(/\n\s*at ([^:]+:\d+:\d+)/)
      , source = matched && matched[1].replace(process.cwd(), ".")
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
