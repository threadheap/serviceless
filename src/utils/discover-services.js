'use strict';

const path = require('path');
const fs = require('fs-extra');
const { containsServerlessConfig } = require('../common/utils');

const discover = (basePath, hash) => {
    return fs.readdir(basePath).then(files => {
        return Promise.all(
            files.map(file => {
                const filePath = path.join(basePath, file);

                return fs.lstat(filePath).then(stats => {
                    if (stats.isFile() && containsServerlessConfig(file)) {
                        hash[basePath] = path.join(basePath, file);
                    }

                    if (stats.isDirectory()) {
                        return discover(filePath, hash);
                    } else {
                        return Promise.resolve();
                    }
                });
            })
        );
    });
};

module.exports = basePath => {
    const hash = {};

    return discover(basePath, hash).then(() => hash);
};
