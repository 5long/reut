var util = require("../util")
  , AbstractReporter = require("./abstract")

function ErrorReporter(writable) {
  this._output = writable || process.stdout
}
util.inherits(ErrorReporter, AbstractReporter)

util.merge(ErrorReporter.prototype, {
  _watchTest: function(t) {
    var self = this
    t.on("error", function(err) {
      self._report(err, t)
    })
  }
, _report: function(err, t) {
    this._output.write(this._format(err, t))
  }
, _format: function(err, t) {
    return [ "Test"
           , t.desc
           , "got error:"
           , err.message + "\n" + err.stack
           ].join(" ")
  }
})

module.exports = ErrorReporter
