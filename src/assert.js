var assert = require("assert")
  , fail = assert.fail
  , extendedAssert = Object.create(assert)
  , ext = extendedAssert

ext.typeOf = function(value, expected, msg) {
  if (typeof value != expected) {
    fail(value, expected, msg, "typeof", ext.typeOf)
  }
}

ext.instanceOf = function(instance, konstructor, msg) {
  if (!(instance instanceof konstructor)) {
    fail(instance, konstructor, msg, ext.instanceOf)
  }
}

module.exports = extendedAssert
