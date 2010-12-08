var reut = require("reut")
  , EE = require("events").EventEmitter
  , fs = require("fs")
  , path = require("path")

reut.suite("Make it fun")
.startup(function(fixture) {
  // For synchronous setup/teardown/startup/shutdown
  // Keep using one argument in function definition
  fixture.filename = __filename
})
.shutdown(function(fixture) {
  delete fixture.filename
})
.setup(function thisIsAsync(fixture, done) {
  // call done() to finish asynchronous setup etc.
  fs.stat(fixture.filename, function(err, stat) {
    if (err) throw err
    fixture.stat = stat
    done()
  })
})
.shutdown(function(fixture) {
  delete fixture.stat
})
.test("good old synchronous", function(test, fixture) {
  // `test.timeout = 1` is set implicitly for all tests by default
  // So they work like synchronous tests
  test.in("stat", fixture)
})
.test("there we go async", function(test, fixture) {
  // Instead of specifying expected number of assertions,
  // reut prefers the timeout(in ms) way
  test.timeout = 2000

  // The callback function is wrapped in test.cb(),
  // which does the book keeping work for you
  fs.readFile(fixture.filename, test.cb(function(err, data) {
    // If this function is not called before test ends
    // see it in failure report

    test.equal(data.length, fixture.stat.size)

    // 2000ms is too long for unit test
    // better end it explicitly
    test.end()
  }))
})
.test("async again", function(test, fixture) {
  // test.end() is not called explicitly in this test
  // This'd be okay if your test runs really fast

  test.timeout = 30 // Enough for this

  var banana = new EE()
    , me = {}

  // Roughly equivalent to `banana.on("eaten", test.cb( ... ))`
  test.emits(banana, "eaten", function(who) {
    // Context and parameters are preserved
    test.equal(who, me)
    test.equal(this, banana)
  })

  setTimeout(function() {
    banana.emit("eaten", me)
  }, 10) // Less than 30
})
