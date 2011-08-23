#!/usr/bin/env node
var runner = require("../runner")
  , util = require("../util")
  , async = util.async
  , path = require("path")

function main() {
  var files = util.makeArray(process.argv, 2)
    , cwd = process.cwd()

  async.map(files, function(file) {
    loadAndRun(path.join(cwd, file), this)
  }, function(err) {
    if (err) throw err
    runner.run({}, function(err, results) {
      if (err) throw err
      if (hasFailed(results)) process.exit(1)
    })
  })
}

function loadAndRun(filename, cb) {
  var modName = filename.replace(/\.(?:js|node)$/, "")
  require(modName)
  cb(null)
}

function hasFailed(results) {
  return results.some(function(suiteResult) {
    return suiteResult.some(function(testResult) {
      return !!testResult.failed.length
    })
  })
}

main()
