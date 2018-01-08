'use strict';

const Sls = require('../command');
const { CanNotRollback } = require('../../common/errors');
const { wrap } = require('../../utils/child-process');

const versionRegExp = /Serverless: Timestamp: (\d+)/;
const rollback = ({ path, logStream }) => {
    const sls = new Sls(path, '');

    return wrap(sls.rollback())
        .then(log => {
            const match = log.match(versionRegExp);

            if (match) {
                return versionRegExp.exec(match[0])[1];
            } else {
                return Promise.reject(new CanNotRollback());
            }
        })
        .then(version => {
            return wrap(sls.rollback(version));
        });
};

module.exports = rollback;
