'use strict';

const program = require('commander');
const { version } = require('../package.json');
const commands = require('./commands');
const getArgv = require('./utils/get-argv');
const { kill } = require('./utils/child-process');

// deploy
program
    .version(version)
    .command('deploy [service]')
    .allowUnknownOption()
    .option('-v, --verbose', 'Show serverless output')
    .option(
        '-b, --runInBand',
        'Deploy services one by one (parallel by default)'
    )
    .description('deploy service')
    .action((service, options) => {
        const args = program.rawArgs.slice(service ? 3 : 4);

        commands.deploy(
            service,
            process.cwd(),
            getArgv(args, program.options),
            options
        );
    });

program.parse(process.argv);

// kill all child processes on exit
process.on('exit', kill);
// handle kill signals
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
