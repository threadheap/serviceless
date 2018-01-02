'use strict';

const Listr = require('listr');
const Sls = require('./command');
const { ServerlessCommandError } = require('../common/errors');
const { wrap } = require('../utils/child-process');

const deployOne = (path, flags, params, logStream) => {
    const sls = new Sls(path, flags);

    return wrap(
        sls.deploy(),
        // don't push logs to console when deploying multiple services
        params
    )
        .then(log => {
            logStream.write(log);
        })
        .catch(err => {
            if (err instanceof ServerlessCommandError) {
                logStream.write(err.errorLog);
                logStream.write(err.log);
            }

            return Promise.reject(err);
        });
};

module.exports = (paths, flags, params, logStream) => {
    return new Listr(
        paths.map(path => {
            return {
                title: path,
                task: () => deployOne(path, flags, params, logStream)
            };
        }),
        { concurrent: !params.runInBand }
    ).run();
};
