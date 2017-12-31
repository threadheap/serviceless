'use strict';

/**
 * verbose
 * stdout
 * stderr
 */
const wrap = (childProcess, params = {}) => {
    return new Promise((resolve, reject) => {
        let log = '';
        let errorLog = '';

        if (params.verbose) {
            childProcess.stdout.pipe(process.stdout);
            childProcess.stderr.pipe(process.stderr);
        }

        childProcess.stdout.on('data', data => {
            log += data.toString();
        });

        childProcess.stderr.on('data', data => {
            errorLog += data.toString();
        });

        if (params.stdout) {
            childProcess.stdout.pipe(params.stdout);
        }

        if (params.stderr) {
            childProcess.stderr.pipe(params.stderr);
        }

        childProcess.on('close', code => {
            if (code !== 0) {
                reject(new Error(`process existed with code ${code}`), log);
            } else {
                resolve(log);
            }
        });
    });
};

module.exports = wrap;
