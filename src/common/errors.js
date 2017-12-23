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
        const message = 'No serverless config found';
        super(message);
    }
}

class CantFindService extends Error {
    constructor(query) {
        const message = `Can not find service matching query "${query}"`;
        super(message);
    }
}

module.exports = {
    NoServicesFoundError,
    CantFindService
};
