var assert = require("assert")
  , Test = require("../src").Test
  , obj = {
      method: function() {
        return 42
      }
    }

var t = new Test("callback should return as original", function(test) {
  var originalMethod = obj.method
  obj.method = test.cb(function() {
    return originalMethod.apply(this, arguments)
  })
  var returned = obj.method()
  assert.equal(returned, 42)
})

t.run(function(err) {
  if (err) throw err
})
