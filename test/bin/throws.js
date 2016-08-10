#!/usr/bin/env node

// uncomment the following line to demonstrate that test works
// throw new Error('bad handler')

var Parser = require('../')

var ignore = [ 'pipe', 'unpipe', 'prefinish', 'finish', 'newListener' ]
var fs = require('fs')

var eventName = process.argv[2]
var tapFile = process.argv[3]

var parser = new Parser
parser.on(eventName, function (data) {
  throw new Error('bad handler')
})

fs.createReadStream(tapFile).pipe(parser)
