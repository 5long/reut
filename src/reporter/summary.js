var util = require("../util")
  , pushAll = util.pushAll

function SummaryReporter(writable) {
  var self = this
  this._output = writable || process.stdout
  this._result = {all: [], passed: [], failed: []}
  process.on("exit", function() {
    self._report()
  })
}
util.merge(SummaryReporter.prototype, {
  watch: function(suite) {
    var self = this
    suite.on("yield", function(tc) {
      tc.on("end", function(result) {
        self._record(result)
      })
    })
  }
, _record: function(result) {
    var total = this._result
    pushAll(total.all, result.all)
    pushAll(total.passed, result.passed)
    pushAll(total.failed, result.failed)
  }
, _report: function() {
    this._output.write(this._format(this._result))
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
