'use strict';

const inquirer = require('inquirer');
inquirer.registerPrompt(
    'autocomplete',
    require('inquirer-autocomplete-prompt')
);
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
            .then(answer => {
                console.log(answer);

                return answer.service;
            });
    }
}

module.exports = Cli;
