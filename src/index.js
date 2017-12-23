'use strict';

const program = require('commander');
const { version } = require('../package.json');

// deploy
program
    .version(version)
    .command('deploy [service]')
    .option('-v, --verbose', 'Show serverless output')
    .description('deploy service')
    .action(deploy);

program.parse(process.argv);
