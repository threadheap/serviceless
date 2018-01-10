'use strict';

const chalk = require('chalk');
const { Writable } = require('stream');

module.exports = (path, color, task) => {
    const stream = new Writable({
        write: chunk => {
            const log = chunk.toString();

            if (log.indexOf('Serverless') > -1) {
                task.output = `${chalk[color](`[${path}]`)} ${log}`;
            }
        }
    });

    return stream;
};
