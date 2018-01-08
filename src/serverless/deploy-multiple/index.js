'use strict';

const Listr = require('listr');
const deployOne = require('./deploy-one');
const rollback = require('./rollback');

module.exports = (paths, flags, config, logStream) => {
    const deployedPaths = [];

    const tasks = new Listr(
        paths.map(path => {
            return {
                title: path,
                task: () =>
                    deployOne({ path, flags, config, logStream }).then(res => {
                        deployedPaths.push(path);
                    })
            };
        }),
        {
            concurrent: !config.runInBand,
            exitOnError: Boolean(config.exitOnFailure)
        }
    ).run();

    if (config.rollbackOnFailure) {
        return tasks.catch(err => {
            return new Listr(
                deployedPaths.map(path => {
                    return {
                        title: `rolling back ${path}`,
                        task: () => rollback({ path, logStream })
                    };
                }),
                { concurrent: !config.runInBand, exitOnError: false }
            )
                .run()
                .then(() => Promise.reject(err));
        });
    }

    return tasks;
};
