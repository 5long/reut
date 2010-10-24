var TestSuite = require("./test_suite")
  , TestCase = require("./test_case")
  , util = require("./util")
  , async = util.async
  , suites = []

// TODO Extract the test runner interface.
var runner = module.exports = {
  suite: function(desc) {
    suites.push(new TestSuite(desc))
  }
, test: function(desc, action) {
    if (arguments.length < 2) throw TypeError("Wrong number of arguments")
    if (!suites.length) runner.suite("Anonymous test suite")
    var suite = suites[suites.length - 1]
    suite.add(new TestCase(desc, action))
  }
, run: function(cb) {
    if (typeof cb != "function") cb = util.noop
    async.map(suites, function(suite) {
      suite.run(this)
    }, cb)
  }
}
