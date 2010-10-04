var util = {
  makeArray: function(arrayLike) {
    return Array.prototype.slice.call(arrayLike)
  }
, merge: function() {
    if (!arguments.length) throw TypeError("Destination object needed")
    var sources = util.makeArray(arguments)
      , dest = sources.shift()
    sources.forEach(function(source) {
      for (var i in source) this[i] = source[i]
    }, dest)
    return dest
  }
}

module.exports = util
