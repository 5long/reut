#!/usr/bin/env node
var runner = require("../runner")
  , util = require("../util")
  , async = util.async
  , path = require("path")
  , optimist = require("optimist")

function main() {
  var args = extractArgs()
    , files = args._.slice()
    , cwd = process.cwd()

  async.map(files, function(file) {
    loadAndRun(path.join(cwd, file), this)
  }, function(err) {
    if (err) throw err
    runner.run({shuffle: args.shuffle}, function(err, results) {
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

function extractArgs() {
  return optimist
    .demand(1)
    .usage("Usage: $0 [options]... [--] <test file...>")
    .describe("S", "Shuffle tests in each suite.")
    .boolean("S")
    .options("S", {
        alias: "shuffle"
      , default: false
      })
    .argv
}

main()
