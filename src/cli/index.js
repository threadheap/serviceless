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
                    message: 'Select service or folder to deploy',
                    choices: getChoicesFromServices(services),
                    prefix: '',
                    pageSize: 20
                }
            ])
            .then(answer => {
                // clear console
                process.stdout.write('\x1B[2J\x1B[0f');
                return answer.service;
            });
    }
}

module.exports = Cli;
