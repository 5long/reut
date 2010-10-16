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
    fail(instance, konstructor, msg, "instanceof", ext.instanceOf)
  }
}

ext.implement = function(instance, interface, msg) {
  var proto = interface.prototype
    , props = Object.getOwnPropertyNames(proto)
    , methods = props.filter(function(method) {
        return typeof proto[method] == "function"
      })
    , notImplemented = methods.filter(function(method) {
        return typeof instance[method] != "function"
      })
  if (notImplemented.length) {
    fail(instance, interface, msg, "implements", ext.implement)
  }
}

module.exports = extendedAssert
