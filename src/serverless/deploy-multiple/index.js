'use strict';

const logUpdate = require('log-update');
const chalk = require('chalk');
const lastIndexOf = require('lodash/lastIndexOf');
const Listr = require('listr');
const ListrVerboseRenderer = require('listr-verbose-renderer');
const deployOne = require('./deploy-one');
const rollback = require('./rollback');
const createStatusStream = require('./status-stream');

const colors = [
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'gray',
    'greenBright',
    'yellowBright',
    'blueBright',
    'magentaBright',
    'cyanBright'
];

const getColor = index => colors[index % colors.length];

module.exports = (paths, flags, config, logStream) => {
    const deployedPaths = [];

    const tasks = new Listr(
        paths.map((path, index) => {
            return {
                title: path,
                task: (ctx, task) => {
                    return deployOne({
                        path,
                        flags,
                        logStream,
                        stdout:
                            config.verbose &&
                            createStatusStream(path, getColor(index), task)
                    }).then(output => {
                        // check if service was deployed
                        if (
                            output.indexOf(
                                'Serverless: Stack update finished...'
                            ) > -1
                        ) {
                            deployedPaths.push(path);
                        } else {
                            task.skip();
                        }

                        const infoIndex = output.lastIndexOf(
                            'Service Information'
                        );
                        const info = output.substring(infoIndex);
                        if (config.verbose) {
                            task.output = info;
                        }
                        ctx[path] = info;
                    });
                }
            };
        }),
        {
            concurrent: !config.runInBand,
            exitOnError: Boolean(config.exitOnFailure),
            renderer: config.verbose && ListrVerboseRenderer,
            collapse: false
        }
    ).run();

    if (config.rollbackOnFailure) {
        return tasks.catch(err => {
            if (deployedPaths.length > 0) {
                console.log('Deployment failed');
                console.log('Rolling back');
                return new Listr(
                    deployedPaths.map((path, index) => {
                        return {
                            title: `rolling back ${path}`,
                            task: (ctx, task) =>
                                rollback({
                                    path,
                                    logStream,
                                    stdout:
                                        config.verbose &&
                                        createStatusStream(
                                            path,
                                            getColor(index),
                                            task
                                        )
                                })
                        };
                    }),
                    {
                        concurrent: !config.runInBand,
                        exitOnError: false,
                        renderer: config.verbose && ListrVerboseRenderer
                    }
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

    return tasks.then(ctx => {
        if (!config.verbose) {
            let output = '\nDeployment completed successfuly\n';
            paths.forEach((path, index) => {
                const color = getColor(index);

                output += `${chalk[color](`[${path}]: `)}\n${ctx[path]}`;
            });
            logUpdate(output);
        }
    });
};
