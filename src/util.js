var makeArray = Function.prototype.call.bind(Array.prototype.slice)

var util = module.exports = {
  makeArray: makeArray
, noop : function NOOP() {}
, isFunc: isFunc
, defer: defer
, pushAll: Function.prototype.apply.bind(Array.prototype.push)
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
    klass.prototype = Object.create(super.prototype, {
      constructor: {
        value: klass
      , enumerable: false
      }
    })
  }
, def: function(dest, source) {
    if (arguments.length < 2) throw TypeError("Wrong number of arguments")
    var props = Object.getOwnPropertyNames(source)
    props.forEach(function(prop) {
      var pd = Object.getOwnPropertyDescriptor(source, prop)
      Object.defineProperty(this, prop, pd)
    }, dest)
  }
, ucFirst: function(str) {
    return str.replace(/^[a-z]/, function(c) {
      return c.toUpperCase()
    })
  }
, shuffle: function(ary) {
    var result = util.makeArray(ary)
    return result.sort(function(a, b) {
      return Math.random() - 0.5
    })
  }
}

util.async = {
  serial: function(actions, cb) {
    actions = makeArray(actions)
    actions.forEach(function(action) {
      if (typeof action != "function") throw TypeError("An action is not callable")
    })

    actions.push(function(err) {
      var results = makeArray(arguments, 1).reverse()
      err = err instanceof Error ? err : null
      cb && cb(err, results)
    })
    defer(chainIter, [actions, []])
  }
, map: function(array, action, cb) {
    var array = array.slice()
    defer(mapIter, [array, action, [], cb])
  }
, paraMap: function(array, action, cb) {
    if (!array.length) return cb && cb(null, [])
    var results = []
      , latestErr = null
      , num = 0
    array.forEach(function(val, key) {
      num++
      function innerCallback(err, data) {
        latestErr = err
        results[key] = data || err
        defer(function() {
          if (!--num) cb && cb(latestErr, results)
        })
      }
      action.call(innerCallback, val)
    })
  }
, chain: function() {
    var actions = makeArray(arguments)
    process.nextTick(function() {
      chainIter(actions, [])
    })
  }
}

function chainIter(actions, initial) {
  var action = actions.shift()
  if (!action) return

  function innerCallback() {
    initial.shift()
    var recent = makeArray(arguments)
      , passingOn = recent.concat(initial)
    chainIter(actions, passingOn)
  }

  action.apply(innerCallback, initial)
}

function mapIter(array, action, results, cb) {
  if (!array.length) {
    cb && cb(null, results)
    return
  }
  action.call(innerCallback, array.shift())

  function innerCallback(err, data) {
    if (err) {
      cb && cb(err, results)
      return
    }
    results.push(data)
    mapIter(array, action, results, cb)
  }
}

function defer(fn, args) {
  if (!isFunc(fn)) throw TypeError("Not a callable object")
  process.nextTick(function() {
    fn.apply(null, args)
  })
}

function isFunc(obj) {
  return Object.prototype.toString.call(obj) == "[object Function]"
}
