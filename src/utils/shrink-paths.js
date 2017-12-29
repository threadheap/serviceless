'use strict';

const Path = require('path');
const isObject = require('lodash/isObject');

const shrinkPaths = (basePath, pathsHash) => {
    const paths = [];

    const shrink = (path, hash) => {
        Object.keys(hash).forEach(key => {
            const newPath = Path.join(path, key);
            if (isObject(hash[key])) {
                return shrink(newPath, hash[key]);
            }
            paths.push(newPath);
        });
    };

    shrink(basePath, pathsHash);

    return paths;
};

module.exports = shrinkPaths;
