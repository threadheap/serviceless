'use strict';

const fs = require('fs');
const Path = require('path');
const Deploy = require('./deploy');
const { ServerlessCommandError } = require('../common/errors');

module.exports = {
    deploy: (service, path, argv, options) => {
        return new Promise((resolve, reject) => {
            const logStream = fs.createWriteStream(
                Path.resolve('./serviceless.log')
            );
            logStream.on('error', err => reject(err));
            const deploy = new Deploy(path, argv, options);

            logStream.once('open', () => {
                deploy.exec(service).then(results => {
                    let hasError = false;

                    results.forEach(res => {
                        if (res instanceof Error) {
                            hasError = true;
                            if (res instanceof ServerlessCommandError) {
                                logStream.write(res.errorLog);
                                logStream.write(res.log);
                            } else {
                                console.error(res);
                            }
                        } else {
                            logStream.write(res);
                        }
                    });

                    logStream.on('finish', () => {
                        if (hasError) {
                            console.error(
                                'sls deploy process failed, see `serviceless.log` for more information.'
                            );
                            process.exit(1);
                        }
                        resolve();
                    });

                    logStream.end();
                });
            });
        });
    }
};
