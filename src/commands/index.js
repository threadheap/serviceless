'use strict';

const fs = require('fs');
const Path = require('path');
const Deploy = require('./deploy');
const { ServerlessCommandError } = require('../common/errors');

module.exports = {
    deploy: (service, path, argv, options) => {
        return new Promise((resolve, reject) => {
            let failed = false;
            const logStream = fs.createWriteStream(
                Path.resolve('./serviceless.log')
            );
            logStream.on('error', err => reject(err));
            const deploy = new Deploy(path, argv, options, logStream);

            logStream.on('finish', () => {
                if (failed) {
                    process.exit(1);
                }
                resolve();
            });

            logStream.once('open', () => {
                deploy
                    .exec(service)
                    .catch(err => {
                        console.error(err);
                        console.error(
                            'sls deploy process failed, see `serviceless.log` for more information.'
                        );

                        failed = true;
                        logStream.end();
                    })
                    .then(() => {
                        logStream.end();
                    });
            });
        });
    }
};
