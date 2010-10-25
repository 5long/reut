var reut = require("reut")
reut.suite("Say hello!")
reut.test("Chinese", function(test) {
  test.ok(true, "你好")
  test.end()
})
