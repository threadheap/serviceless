'use strict';

class BaseError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(message).stack;
        }
    }
}

class NoServerlessConfigFoundError extends Error {
    constructor() {
        super('No serverless config found');
    }
}

class CantFindService extends Error {
    constructor(query) {
        super(`Could not find service matching query "${query}"`);
    }
}

class ServerlessExecutableNotFoundError extends Error {
    constructor() {
        super('Could not find serverless executable');
    }
}

class ServerlessCommandError extends Error {
    constructor(code, log, errorLog) {
        super(`Serverless existed with code ${code}`);
        this.log = log;
        this.errorLog = errorLog;
    }
}

module.exports = {
    NoServerlessConfigFoundError,
    CantFindService,
    ServerlessExecutableNotFoundError,
    ServerlessCommandError
};
