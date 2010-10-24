var util = require("../util")
  , sys = require("sys")

function SimpleReporter(writable) {
  this._output = writable || process.stdout
}
util.merge(SimpleReporter.prototype, {
  watch: function(suite) {
    var self = this
    suite.on("yield", function(tc) {
      tc.on("assert", function(result) {
        if (result.passed) return
        self._report(result, tc, suite)
      })
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

module.exports = SimpleReporter
