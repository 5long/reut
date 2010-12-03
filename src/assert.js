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

, length: function(arrayLike, length, msg) {
    if (arrayLike.length !== length) {
      fail(arrayLike, length, msg, ".length ===", eA.length)
    }
  }

, match: function(str, regex, msg) {
    if (!regex.test(str)) {
      fail(regex, str, msg, ".test()", eA.match)
    }
  }

, include: function(haystack, needle, msg) {
    if (haystack.indexOf(needle) === -1) {
      fail(haystack, needle, msg, ".indexOf() !== -1", eA.include)
    }
  }

, in: function(key, obj, msg) {
    if (!(key in obj)) {
      fail(key, obj, msg, "in", eA.in)
    }
  }

, is: function(actual, expected, msg) {
    if (actual === expected) return
    fail(actual, expected, msg, "===", eA.is)
  }

, isnt: function(actual, expected, msg) {
    if (actual !== expected) return
    fail(actual, expected, msg, "!==", eA.isnt)
  }

, empty: function(val, msg) {
    if (val === ""
        || (Array.isArray(val) && !val.length)
        || (isObject(val) && !Object.keys(val).length)
    ) return
    fail(val, 0, msg, ".length !==", eA.empty)
  }

})

function isObject(val) {
  return Object.prototype.toString.call(val) === "[object Object]"
}
