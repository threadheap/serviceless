'use strict';

const Deploy = require('./deploy');
const { ServerlessCommandError } = require('../common/errors');

module.exports = {
    deploy: (service, path, argv, options) => {
        const deploy = new Deploy(path, argv, options);

        deploy.exec(service).catch((err, log) => {
            if (!options.verbose && err instanceof ServerlessCommandError) {
                console.log(err.log);
                console.error(err.errorLog);
            } else {
                throw err;
            }
        });
    }
};
