'use strict';

const inquirer = require('inquirer');

class Cli {
    deploy(services) {
        inquirer.prompt([
            {
                type: 'checkbox',
                name: 'services',
                choices: []
            }
        ]);
    }
}

module.exports = Cli;
