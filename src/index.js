'use strict';

const program = require('commander');
const { version } = require('../package.json');
const commands = require('./commands');

// deploy
program
    .version(version)
    .command('deploy [service]')
    .option('-v, --verbose', 'Show serverless output')
    .description('deploy service')
    .action((service, options) => {
        commands.deploy(service, process.cwd(), '', options);
    });

program.parse(process.argv);
