var reut = require("reut")

reut.suite("Some more assertion method")

reut.test("Cuz CommonJS is slow at evolving", function(assert) {
  assert.include("foo", "oo", "Wraps indexOf != -1")
  assert.length([], 1, "This should fail")
  assert.instanceOf({}, Object)
  assert.typeOf({}, "number", "This should fail")
  assert.match("blah", /ah/)
  assert.in(0, ["huh?"])
})
