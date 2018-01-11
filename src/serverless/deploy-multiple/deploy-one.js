'use strict';

const Sls = require('../command');
const { ServerlessCommandError } = require('../../common/errors');
const { wrap } = require('../../utils/child-process');

const deployOne = ({ path, flags, logStream, stdout }) => {
    const sls = new Sls(path, flags);

    return wrap(
        sls.deploy(),
        // don't push logs to console when deploying multiple services
        { stdout }
    )
        .then(log => {
            logStream.write(`\n[${path}]:\n${log}\n`);
            return log;
        })
        .catch(err => {
            if (err instanceof ServerlessCommandError) {
                logStream.write(`\n[${path}]:\n${err.log}\n`);
            }

            return Promise.reject(err);
        });
};

module.exports = deployOne;
