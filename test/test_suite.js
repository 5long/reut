var reut = require('../src')
  , TestSuite = reut.TestSuite
  , Test = reut.Test
  , assert = require('assert')
  , remainingCallbacks = 5
  , testDesc = "a test"
  , spyReporter = {
      watch: function() {
        process.nextTick(function() {
          remainingCallbacks--
        })
      }
    }

var theSuite = new TestSuite("no desc")
theSuite.reportTo(spyReporter)
theSuite.add(new Test(testDesc, function(test, fixture) {
  test.timeout = 10
  test.deepEqual(fixture, {foo: "foo"})
  setTimeout(function() {
    test.ok(1, "I'm done")
    test.end()
  }, 2)
}))

theSuite.addSetup(function(fixture, done) {
  fixture.foo = "foo"
  done()
})

theSuite.on("start", function() {
  remainingCallbacks--
})

theSuite.on("yield", function(t) {
  remainingCallbacks--
  assert.ok(t instanceof Test)
  assert.equal(t.desc, testDesc)
})

theSuite.on("end", function() {
  remainingCallbacks--
})

theSuite.run({fixture:{}}, function(err, report) {
  assert.ifError(err)
  remainingCallbacks--
  assert.equal(report.length, 1)
  assert.equal(report[0].passed.length, 2)
})

setTimeout(function() {
  process.exit(remainingCallbacks)
}, 20)
