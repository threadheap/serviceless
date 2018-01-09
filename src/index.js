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
    .option(
        '-b, --runInBand',
        'Deploy services one by one (parallel by default)'
    )
    .option('-e, --exitOnFailure', 'Stop deployment on failure')
    .option('-r, --rollbackOnFailure', 'Rollback deployed services on failure')
    .action((service, options) => {
        const args = program.rawArgs.slice(service ? 4 : 3);

        commands.deploy(
            service,
            process.cwd(),
            getArgv(args, program.commands[0].options),
            options
        );
    })
    .on('--help', () => {
        process.stdout.write(`
  Examples:

    deploy
    deploy all
    deploy path/to/app
    `);
    });

program.parse(process.argv);

if (program.args.length === 0) {
    program.outputHelp();
}

// kill all child processes on exit
process.on('exit', kill);
// handle kill signals
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
