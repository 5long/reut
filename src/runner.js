var TestSuite = require("./test_suite")
  , TestCase = require("./test_case")
  , util = require("./util")
  , fs = require("fs")
  , async = util.async
  , suites = []

// TODO Extract the test runner interface.
var runner = module.exports = {
  suite: function(desc) {
    var suite = new TestSuite(desc)
    suites.push(suite)
  }
, test: function(desc, action) {
    if (arguments.length < 2) throw TypeError("Wrong number of arguments")
    if (!suites.length) runner.suite("Anonymous test suite")
    var suite = suites[suites.length - 1]
    suite.add(new TestCase(desc, action))
  }
, run: function(opt, cb) {
    if (arguments.length < 2) cb = opt
    if (typeof cb != "function") cb = util.noop
    var reporters = opt.reporters || []
    async.map(suites, function(suite) {
      reporters.forEach(function(r) {
        suite.reportTo(r)
      })
      suite.run(this)
    }, cb)
  }
}
