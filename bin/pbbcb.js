#!/usr/bin/env iojs

var program = require('commander'),
    Pennergame = require('../lib/Pennergame');

program.parse(process.argv);

if (process.argv.slice(2).length === 0) {
    program.help();
}
