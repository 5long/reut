function AbstractReporter() {}

AbstractReporter.prototype.watch = function(suite) {
  var self = this
  suite.on("yield", function(tc) {
    self._watchTestCase(tc, suite)
  })
}

module.exports = AbstractReporter
