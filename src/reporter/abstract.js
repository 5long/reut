function AbstractReporter() {}

AbstractReporter.prototype.watch = function(suite) {
  var self = this
  suite.on("yield", function(t) {
    self._watchTest(t, suite)
  })
}

module.exports = AbstractReporter
