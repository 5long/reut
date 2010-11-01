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
      fail(key, obj, msg, "in", eA.include)
    }
  }

})
