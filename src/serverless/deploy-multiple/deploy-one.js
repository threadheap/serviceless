'use strict';

const Sls = require('../command');
const { ServerlessCommandError } = require('../../common/errors');
const { wrap } = require('../../utils/child-process');

const deployOne = ({ path, flags, config, logStream }) => {
    const sls = new Sls(path, flags);

    return wrap(
        sls.deploy(),
        // don't push logs to console when deploying multiple services
        config
    )
        .then(log => {
            logStream.write(log);
            return log;
        })
        .catch(err => {
            if (err instanceof ServerlessCommandError) {
                logStream.write(err.errorLog);
                logStream.write(err.log);
            }

            return Promise.reject(err);
        });
};

module.exports = deployOne;
