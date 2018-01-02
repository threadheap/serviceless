'use strict';

const sh = require('shelljs');
const Errors = require('../common/errors');

class ServerlessCommand {
    constructor(path, flags) {
        this.path = path;
        this.flags = flags;
    }

    __getSls() {
        const sls = sh.which('sls');

        if (!sls) {
            throw new Errors.ServerlessExecutableNotFoundError();
        }

        return {
            exec: (command, ...args) =>
                sh.exec(`cd ${this.path} && sls ${command}`, {
                    async: true,
                    silent: true
                })
        };
    }

    exec(command) {
        return this.__getSls().exec(`${command} ${this.flags}`);
    }

    deploy() {
        return this.exec(`deploy`);
    }
}

module.exports = ServerlessCommand;
