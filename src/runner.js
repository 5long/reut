var TestSuite = require("./test_suite")
  , SuiteMonad = require("./suite_monad")
  , Test = require("./test")
  , async = require("./util").async
  , suites = []

// TODO Extract the test runner interface.
var runner = module.exports = {
  suite: function(desc) {
    var suite = new TestSuite(desc)
      , monad = new SuiteMonad(suite)
    suites.push(suite)
    return monad
  }
, test: function(desc, action) {
    return runner.suite("Anonymous test suite").test(desc, action)
  }
, run: function(opt, cb) {
    if (arguments.length < 2) cb = opt
    var reporters = opt.reporters || []
    async.paraMap(suites, function(suite) {
      reporters.forEach(function(r) {
        suite.reportTo(r)
      })
      suite.run(this)
    }, cb)
  }
, _suites: suites
}
