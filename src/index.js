var util = require("./util")
  , runner = require("./runner")

module.exports = {
  TestCase: require("./test_case")
, TestSuite: require('./test_suite')
}

util.merge(module.exports, runner)
