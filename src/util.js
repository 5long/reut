var makeArray = Function.prototype.call.bind(Array.prototype.slice)
  , noop = Function()

var util = module.exports = {
  makeArray: makeArray
, isFunc: isFunc
, defer: defer
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
, noop: noop
}

util.async = {
  serial: function(actions, cb) {
    if (typeof cb == "undefined") cb = noop
    actions = makeArray(actions)
    actions.forEach(function(action) {
      if (typeof action != "function") throw TypeError("An action is not callable")
    })

    actions.push(function(err) {
      var results = makeArray(arguments, 1).reverse()
      err = err instanceof Error ? err : null
      cb(err, results)
    })
    defer(null, chainIter, [actions, []])
  }
, map: function(array, action, cb) {
    var array = array.slice()
    defer(null, mapIter, [array, action, [], cb])
  }
}

function chainIter(actions, initial) {
  var action = actions.shift()
  if (!action) return

  function innerCallback() {
    if (initial[0] instanceof Error) initial.shift()
    var recent = makeArray(arguments)
      , passingOn = recent.concat(initial)
    chainIter(actions, passingOn)
  }

  action.apply(innerCallback, initial)
}

function mapIter(array, action, results, cb) {
  if (!array.length) {
    cb(null, results)
    return
  }
  action.call(innerCallback, array.shift())

  function innerCallback(err, data) {
    if (err) {
      cb(err, results)
      return
    }
    results.push(data)
    mapIter(array, action, results, cb)
  }
}

function defer(context, fn, args) {
  fn = isFunc(fn) ? fn : context[fn]
  if (!isFunc(fn)) throw TypeError("Not a callable object")
  process.nextTick(function() {
    fn.apply(context, args)
  })
}

function isFunc(obj) {
  return Object.prototype.toString.call(obj) == "[object Function]"
}
