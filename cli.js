#!/usr/bin/env node
var runner = require("./src/runner")
  , util = require("./src/util")
  , async = util.async
  , path = require("path")

function main() {
  var files = util.makeArray(process.argv, 2)
    , cwd = process.cwd()

  async.map(files, function(file) {
    loadAndRun(path.join(cwd, file), this)
  }, function(err) {
    if (err) throw err
    runner.run(function(err) {
      if (err) throw err
    })
  })
}

function loadAndRun(filename, cb) {
  var modName = filename.replace(/\.(?:js|node)$/, "")
  require(modName)
  cb(null)
}

main()
