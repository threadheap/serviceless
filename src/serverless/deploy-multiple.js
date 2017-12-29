'use strict';

const ora = require('ora');
const Sls = require('./command');
const { wrap } = require('../utils/child-process');

const deployOne = (path, flags, params) => {
    const sls = new Sls(path, flags);
    const spinner = ora(path);
    spinner.start();

    return wrap(
        sls.deploy(),
        // don't push logs to console when deploying multiple services
        Object.assign({}, params, { verbose: false })
    )
        .then(log => {
            spinner.succeed();

            if (params.verbose) {
                console.log(log);
            }

            return log;
        })
        .catch(err => {
            spinner.fail();
            return new Promise((resolve, reject) => reject(err));
        });
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
