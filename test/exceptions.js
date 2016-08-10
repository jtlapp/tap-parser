var Parser = require('../')
var stream = require('stream')
var spawn = require('child_process').spawn;

var test = require('tape')

var fixturePath = __dirname + '/fixtures'
var oneCommentFile = fixturePath + '/one-comment.tap'
var oneOkFile = fixturePath + '/one-ok.tap'
var oneNotOkFile = fixturePath + '/one-not-ok.tap'

var expectedStderr = /Error: bad handler/

testThrowingHandler(
  'comment handler throws exception',
  'comment',
  oneCommentFile
)

testThrowingHandler(
  'complete handler throws exception',
  'complete',
  oneOkFile
)

testThrowingHandler(
  'assert handler throws exception when ok',
  'assert',
  oneOkFile
)

testThrowingHandler(
  'assert handler throws exception when not ok',
  'assert',
  oneNotOkFile
)

testThrowingHandler(
  'complete handler throws exception when ok',
  'complete',
  oneOkFile
)

function testThrowingHandler (testName, event, tapFile) {
  test(testName, function (t) {
    var writable = new stream.Writable()
    var chunks = []
    writable._write = function (chunk) {
      chunks.push(chunk)
    }

    var cmd = __dirname + '/bin/throws.js'
    var ps = spawn(cmd, [event, tapFile], { cwd: __dirname })
    ps.stderr.pipe(writable)
    ps.on('exit', function (code) {
      var stderr = Buffer.concat(chunks).toString()
      if (expectedStderr.test(stderr))
        t.pass('got expected exception')
      else
        t.fail('did not get expected exception')
      t.equal(code, 1, 'expecting error exit code')
      t.end()
    })
  })
}
