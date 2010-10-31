# REimplementing Unit Test

Simply another unit test framework for node.js.

_CAUTION:_ barely usable now.

## Design

* Doesn't force you to use a flow control pattern
* Does a little bit magic but not too much

## Usage

### Installation

    $ npm install reut

### Give it a shot

    $ cat <<EOF >hello.js
    var reut = require("reut")
    reut.suite("Say hello!")
    reut.test("Chinese", function(test) {
      test.ok(true, "你好")
    })
    EOF
    # And here we go
    $ reut hello.js
