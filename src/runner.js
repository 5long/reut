var TestSuite = require("./test_suite")
  , SuiteMonad = require("./suite_monad")
  , Test = require("./test")
  , util = require("./util")
  , async = util.async
  , suites = []
  , reporterMod = require("./reporter")
  , defaultReporters = [
      new reporterMod.Failure()
    , new reporterMod.Summary()
    , new reporterMod.Error()
    ]

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
    if (opt.shuffle) suites = util.shuffle(suites)
    var reporters = opt && opt.reporters || defaultReporters
    async.map(suites, function(suite) {
      reporters.forEach(function(r) {
        suite.reportTo(r)
      })
      suite.run({shuffle: opt.shuffle}, this)
    }, function(err, result) {
      process.emit("_reutTestEnd")
      cb && cb.apply(this, arguments)
    })
  }
, _suites: suites
}
