var util = require("../util")
  , AbstractReporter = require("./abstract")

function ErrorReporter(writable) {
  this._output = writable || process.stdout
}
util.inherits(ErrorReporter, AbstractReporter)

util.merge(ErrorReporter.prototype, {
  _watchTestCase: function(tc) {
    var self = this
    tc.on("error", function(err) {
      self._report(err, tc)
    })
  }
, _report: function(err, tc) {
    this._output.write(this._format(err, tc))
  }
, _format: function(err, tc) {
    return [ "Test case"
           , tc.desc
           , "got error:"
           , err.message + "\n" + err.stack
           ].join(" ")
  }
})

module.exports = ErrorReporter
