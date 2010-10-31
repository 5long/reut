var util = require("./util")
  , runner = require("./runner")
  , reporter = require("./reporter")

module.exports = {
  Test: require("./test")
, TestSuite: require('./test_suite')
, reporter: reporter
}

util.merge(module.exports, runner)
