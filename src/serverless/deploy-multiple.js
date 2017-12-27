'use strict';

const Sls = require('./command');
const wrapChildProcess = require('../utils/wrap-child-process');

const deployOne = (path, flags, params) => {
    const sls = new Sls(path, flags);

    return wrapChildProcess(sls.deploy(), params);
};

const deployParallel = (paths, flags, params) => {
    return Promise.all(paths.map(path => deployOne(path, flags, params)));
};

const deployInBand = (paths, flags, params) => {
    let promise = new Promise(resolve => resolve());

    paths.forEach(path => {
        promise = promise.then(() => {
            return deployOne(path, flags, params);
        });
    });

    return promise;
};

module.exports = (paths, flags, params) => {
    if (params.runInBand) {
        return deployInBand(paths, flags, params);
    } else {
        return deployParallel(paths, flags, params);
    }
};
