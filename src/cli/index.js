'use strict';

const inquirer = require('inquirer');
inquirer.registerPrompt(
    'autocomplete',
    require('inquirer-autocomplete-prompt')
);
const { getChoicesFromServices } = require('./utils');

class Cli {
    selectService(services) {
        const choices = getChoicesFromServices(services);
        return inquirer
            .prompt([
                {
                    type: 'autocomplete',
                    name: 'services',
                    message: 'Select service',
                    source: (answers, input) =>
                        choices.filter(choice => choice.indexOf(input) > -1)
                }
            ])
            .then(answer => answer.path);
    }
}

module.exports = Cli;
