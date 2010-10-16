var TestSuite = require("./test_suite")
  , TestCase = require("./test_case")
  , util = require("./util")
  , suites = []

var runner = {
  suite: function(desc) {
    suites.push(new TestSuite(desc))
  }
, test: function(desc, action) {
    if (arguments.length < 2) throw TypeError("Wrong number of arguments")
    if (!suites.length) runner.suite("Anonymous test suite")
    var suite = suites[suites.length - 1]
    suite.add(new TestCase(desc, action))
  }
}

process.nextTick(function() {
  var actions = suites.map(function(suite) {
    return function() { suite.run(this) }
  })
  util.serial(actions)
})

module.exports = runner
