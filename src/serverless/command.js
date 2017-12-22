'use strict';

const Path = require('path');
const sh = require('shelljs');

class ServerlessCommand {
    constructor(path) {
        this.path = Path.resolve(path);
    }

    __getSls() {
        const sls = sh.which('sls');

        if (!sls) {
            throw new Error('Can not find serverless executable.');
        }

        return sls;
    }

    install(flags) {
        sh.cd(this.path);
        return this.__getSls().exec(`install ${flags}`, { async: true });
    }

    create(flags) {
        return this.__getSls().exec(`create ${flags}`, { async: true });
    }

    package(flags) {
        sh.cd(this.path);

        return this.__getSls().exec(`package ${flags}`);
    }

    deploy(flags) {
        sh.cd(this.path);

        return this.__getSls().exec(`deploy ${flags}`);
    }

    deployFunction(functionName, flags) {
        sh.cd(this.path);

        return this.__getSls().exec(
            `deploy function -f ${functionName} ${flags}`
        );
    }

    deployList(functionNames, flags) {
        sh.cd(this.path);

        return this.__getSls().exec(
            `deploy list ${functionNames.join(' ')} ${flags}`
        );
    }

    invoke(functionName, flags) {
        sh.cd(this.path);

        return this.__getSls().exec(
            `invoke function -f ${functionName} ${flags}`
        );
    }

    invokeLocal(functionName, flags) {
        sh.cd(this.path);

        return this.__getSls().exec(
            `invoke local function -f ${functionName} ${flags}`
        );
    }
}

module.exports = new ServerlessCommand();
