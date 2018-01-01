'use strict';

const Deploy = require('./deploy');
const { ServerlessCommandError } = require('../common/errors');

module.exports = {
    deploy: (service, path, argv, options) => {
        const deploy = new Deploy(path, argv, options);

        return deploy.exec(service).catch(err => {
            if (err instanceof ServerlessCommandError) {
                console.error(err.log);
                console.error(err.errorLog);
            } else {
                console.error(err);
            }
            process.exit(1);
        });
    }
};
