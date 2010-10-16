var assert = require("assert")
  , util = require("./util")
  , fail = assert.fail
  , extendedAssert = Object.create(assert)
  , eA = extendedAssert

module.exports = util.merge(eA, {
  typeOf: function(value, expected, msg) {
    if (typeof value != expected) {
      fail(value, expected, msg, "typeof", eA.typeOf)
    }
  }

, instanceOf: function(instance, konstructor, msg) {
    if (!(instance instanceof konstructor)) {
      fail(instance, konstructor, msg, "instanceof", eA.instanceOf)
    }
  }

, implement: function(instance, interface, msg) {
    var proto = interface.prototype
      , props = Object.getOwnPropertyNames(proto)
      , methods = props.filter(function(method) {
          return typeof this[method] == "function"
        }, proto)
      , notImplemented = methods.filter(function(method) {
          return typeof this[method] != "function"
        }, instance)
    if (notImplemented.length) {
      fail(instance, interface, msg, "implements", eA.implement)
    }
  }
})
