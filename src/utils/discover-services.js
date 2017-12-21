'use strict';

const path = require('path');
const fs = require('fs-extra');
const { containsServerlessConfig } = require('../common/utils');

const discover = (basePath, list) => {
    return fs.readdir(basePath).then(files => {
        return Promise.all(
            files.map(file => {
                const filePath = path.join(basePath, file);

                return fs.lstat(filePath).then(stats => {
                    if (stats.isFile() && containsServerlessConfig(file)) {
                        list.push(basePath);
                    }

                    if (stats.isDirectory()) {
                        return discover(filePath, list);
                    } else {
                        return Promise.resolve();
                    }
                });
            })
        );
    });
};

module.exports = basePath => {
    const list = [];

    return discover(basePath, list).then(() => list);
};
