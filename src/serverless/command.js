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
                sh.exec(`sls ${command}`, {
                    async: true,
                    silent: true
                })
        };
    }

    exec(command) {
        return this.__getSls().exec(`${command} ${this.flags}`);
    }

    install() {
        sh.cd(this.path);
        return this.exec(`install`);
    }

    create() {
        return this.exec(`create`);
    }

    package() {
        sh.cd(this.path);

        return this.exec(`package`);
    }

    deploy() {
        sh.cd(this.path);

        return this.exec(`deploy`);
    }

    deployFunction(functionName) {
        sh.cd(this.path);

        return this.exec(`deploy function -f ${functionName}`);
    }

    invoke(functionName) {
        sh.cd(this.path);

        return this.exec(`invoke function -f ${functionName}`);
    }

    invokeLocal(functionName) {
        sh.cd(this.path);

        return this.exec(`invoke local function -f ${functionName}`);
    }
}

module.exports = ServerlessCommand;
