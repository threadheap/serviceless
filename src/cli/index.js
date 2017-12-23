'use strict';

const inquirer = require('inquirer');

const { getChoicesFromServices } = require('./utils');

class Cli {
    selectService(services) {
        return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'service',
                    message: 'Select service',
                    choices: getChoicesFromServices(services)
                }
            ])
            .then(answer => answer.service);
    }
}

module.exports = Cli;
