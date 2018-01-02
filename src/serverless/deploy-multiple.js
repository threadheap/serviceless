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

            return log;
        })
        .catch(err => {
            spinner.fail();
            return Promise.resolve(err);
        });
};

const deployParallel = (paths, flags, params) => {
    return Promise.all(paths.map(path => deployOne(path, flags, params)));
};

const deployInBand = (paths, flags, params) => {
    let promise = new Promise(resolve => resolve());
    const results = [];

    paths.forEach(path => {
        promise = promise.then(() => {
            return deployOne(path, flags, params).then(result =>
                results.push(result)
            );
        });
    });

    return promise.then(() => results);
};

module.exports = (paths, flags, params) => {
    if (params.runInBand) {
        return deployInBand(paths, flags, params);
    } else {
        return deployParallel(paths, flags, params);
    }
};
