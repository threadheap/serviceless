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
                        // check if service was deployed
                        if (
                            res.indexOf(
                                'Serverless: Stack update finished...'
                            ) > -1
                        ) {
                            deployedPaths.push(path);
                        }
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
            if (deployedPaths.length > 0) {
                console.log('Deployment failed');
                console.log('Rolling back');
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
                    .catch(err => {
                        console.error(err);
                    })
                    .then(() => Promise.reject(err));
            }

            return Promise.reject(err);
        });
    }

    return tasks;
};
