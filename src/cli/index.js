'use strict';

const inquirer = require('inquirer');
const { getChoicesFromServices } = require('./utils');

class Cli {
    selectService(services) {
        return inquirer
            .prompt([
                {
                    type: 'checkbox',
                    name: 'services',
                    message: 'Select service',
                    choices: getChoicesFromServices(services)
                }
            ])
            .then(answer => answer.path);
    }
}

module.exports = Cli;
