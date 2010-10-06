var makeArray = Function.prototype.call.bind(Array.prototype.slice)
  , noop = Function()
  , assert = require("assert")
  , sys = require("sys")

var util = {
  makeArray: makeArray
, merge: function() {
    if (!arguments.length) throw TypeError("Destination object needed")
    var sources = makeArray(arguments)
      , dest = sources.shift()
    sources.forEach(function(source) {
      for (var i in source) this[i] = source[i]
    }, dest)
    return dest
  }
, inherits: function(klass, super) {
    klass.prototype = Object.create(super.prototype)
  }
, serial: function(actions, cb) {
    if (typeof cb == "undefined") cb = noop
    if (!actions.length) return
    actions = makeArray(actions)
    actions.forEach(function(action) {
      assert.equal(typeof action.apply, 'function', sys.inspect(action) + " is not callable")
    })

    actions.push(function(err) {
      var results = makeArray(arguments, 1).reverse()
      err = err instanceof Error ? err : null
      cb(err, results)
    })
    doChain(actions, [])
  }
, noop: new Function()
}

function doChain(actions, initial) {
  var action = actions.shift()
  if (!action) return

  function innerCallback() {
    initial.shift()
    var recent = makeArray(arguments)
      , passingOn = recent.concat(initial)
    doChain(actions, passingOn)
  }

  action.apply(innerCallback, initial)
}

module.exports = util
