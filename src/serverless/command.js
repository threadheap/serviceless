'use strict';

const Path = require('path');
const sh = require('shelljs');

class ServerlessCommand {
    constructor(path, flags = '') {
        this.path = Path.resolve(path);
        this.flags = flags;
    }

    __getSls() {
        const sls = sh.which('sls');

        if (!sls) {
            throw new Error('Can not find serverless executable.');
        }

        return sls;
    }

    exec(command) {
        return this.__getSls().exec(`${command} ${this.flags}`, {
            async: true
        });
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

    deployList(functionNames) {
        sh.cd(this.path);

        return this.exec(`deploy list ${functionNames.join(' ')}`);
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
