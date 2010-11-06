var reut = require("reut")
  , EE = require("events").EventEmitter
  , fs = require("fs")

if (module == require.main) process.nextTick(reut.run)

reut.suite("A suite to contain 'em all")
.setup(function(fixture, done) {
  fixture.answer = 42
  done()
})
.teardown(function(fixture, done) {
  delete fixture.answer
  done()
})
.test("Native assert methods", function(test, fixture) {
  test.ok(!test.fail, "Not provided")
  test.ok(!test.ifError, "Others are ok to use")
  test.notStrictEqual(0/0, NaN)
  test.strictEqual(42, fixture.answer)
  test.equal([], 0)
  test.throws(function() {
    return someth1ngUndefined
  }, ReferenceError)
})
.test("Extended assert methods", function(test, fixture) {
  test.typeOf(null, "object")
  test.instanceOf(Function, Function)

  test.include("foobar", "foo", "Works with string")
  test.include([3, 5, 6], 5, "And array")

  test.length([], 0)
  test.length("goofy", 5)

  test.match("holy shit", /hi/)

  test.in(1, ["o", "k"])
  // Setup for fixture.stat is defined below
  test.in("stat", fixture)

  test.is("0", 0, "Expected to fail: alias for strictEqual")
  test.isnt("0", 0)
})
// Async setup
.setup(function(fixture, done) {
  fs.stat("/", function(err, stat) {
    fixture.stat = stat
    done()
  })
})
.teardown(function(fixture, done) {
  delete fixture.stat
  done()
})
.test("Something async", function(test, fixture) {
  var boy = new EE()
  test.instanceOf(fixture.stat, fs.Stats)
  // Ensured callback
  setTimeout(test.cb(function(theBoy) {
    theBoy.emit("cry")
  }), 10, boy)
  test.timeout = 20  // Longer than 10

  // Ensured event
  test.emits(boy, "cry", function() {
    test.ok(false, "Expected to fail")
    test.equal(this, boy, "Still got tested")
  })
})
