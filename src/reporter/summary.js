var util = require("../util")

function SummaryReporter(writable) {
  this._output = writable || process.stdout
}
util.merge(SummaryReporter.prototype, {
  watch: function(suite) {
    var self = this
    suite.on("yield", function(tc) {
      tc.on("end", function(result) {
        self._report(result)
      })
    })
  }
, _report: function(result) {
    this._output.write(this._format(result))
  }
, _format: function(result) {
    return [ result.all.length
           , "assertions,"
           , result.passed.length
           , "passed,"
           , result.failed.length
           , "failed.\n"
           ].join(" ")
  }
})

module.exports = SummaryReporter
