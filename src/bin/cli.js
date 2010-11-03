#!/usr/bin/env node
var runner = require("../runner")
  , util = require("../util")
  , async = util.async
  , path = require("path")
  , reporterMod = require("../reporter")
  , reporters = [ new reporterMod.Failure()
                , new reporterMod.Summary()
                , new reporterMod.Error()
                ]

function main() {
  var files = util.makeArray(process.argv, 2)
    , cwd = process.cwd()

  async.map(files, function(file) {
    loadAndRun(path.join(cwd, file), this)
  }, function(err) {
    if (err) throw err
    runner.run({reporters:reporters}, function(err) {
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