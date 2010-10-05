# REimplementing Unit Test

Simply another unit test framework for node.js.

_CAUTION:_ barely usable now.

## Design

* Assumes most tests run asynchronously
* Doesn't force you to use a flow control pattern
* Does a little bit magic but not too much

## Usage

### Install

    $ make link

### Try

    var TestCase = require("reut").TestCase
      , assert = require("assert")
      , hello = new TestCase("say hello", function(test) {
          test.ok(true, "Ahoi!")
          test.end()
        })

    hello.run(function(error, report) {
      if (!error) console.log("I'm done.")
    })

### Uninstall

    $ make unlink
