#!/usr/bin/env iojs

var program = require('commander'),
    Pennergame = require('../lib/Pennergame'),
    game;

program
    .version(require('../package').version)
    .option('-u, --username <username>', 'Your username')
    .option('-p, --password <password>', 'Your password')
    .option('-c, --city <city>', 'The City to log into');

program.parse(process.argv);

if (process.argv.slice(2).length === 0) {
    program.help();
}

if (!program.username) {
    console.error('Username is required');
    process.exit(1);
}

if (!program.password) {
    console.error('Password is required');
    process.exit(1);
}


var valid_cities = Object.keys(Pennergame.Cities);
if (program.city && valid_cities.indexOf(program.city) === -1) {

    console.error('Invalid City:', program.city);
    console.error('Valid choices are:');

    valid_cities.forEach(function (city, index) {
        console.error('\t%d. %s', index + 1, city);
    });

    process.exit(1);
}

game = new Pennergame({
    username: program.username,
    password: program.password
}, program.city);

game.on('error', function (errors) {
    console.error('Error:', errors);
});

game.on('loggedin', function (username, city) {
    console.log('Logged into %s as: %s', city, username);
});
