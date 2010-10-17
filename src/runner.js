var TestSuite = require("./test_suite")
  , TestCase = require("./test_case")
  , util = require("./util")
  , sys = require("sys")
  , suites = []
  , pushAll = Function.prototype.apply.bind(Array.prototype.push)

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
    var actions = suites.map(function(suite) {
      return function() { suite.run(this) }
    })
    util.serial(actions, cb)
  }
}

process.nextTick(function() {
  // TODO Extract the following code as a standalone reporter
  runner.run(function(err, results) {
    var flatterned = results.reduce(function F(flatterned, result) {
          return flatterned.concat(
              result instanceof Array
            ? result.reduce(F, [])
            : [result]
            )
        }, [])
      , report = flatterned.reduce(function R(total, result) {
          result = result.result
          pushAll(total.all, result.all)
          pushAll(total.failed, result.failed)
          pushAll(total.passed, result.passed)
          return total
        }, {all:[], passed:[], failed:[]})
      , errorMsg = report.failed.map(function(err) {
          return err.stack || err.message
        }).join("\n")
    sys.print(errorMsg)
    console.log("%d assertions, %d failed.", report.all.length, report.failed.length)
  })
})
