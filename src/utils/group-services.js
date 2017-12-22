'use strict';

const isObject = require('lodash/isObject');
const Path = require('path');

const joinGroups = groups => {
    const joinGroup = (prevPath, hash) => {
        if (isObject(hash)) {
            const keys = Object.keys(hash);
            if (keys.length === 1) {
                const newPath = Path.join(prevPath, keys[0]);
                const newHash = hash[keys[0]];
                delete groups[prevPath];
                groups[newPath] = newHash;
                return joinGroup(newPath, newHash);
            }
            keys.forEach(key => {
                joinGroup(Path.join(prevPath, key), hash[key]);
            });
        }
    };

    Object.keys(groups).forEach(key => {
        joinGroup(key, groups[key]);
    });

    return groups;
};

const groupServices = services => {
    const groups = {};
    const paths = Object.keys(services);

    paths.forEach(path => {
        let hash = groups;
        const parts = path.split(Path.sep);
        parts.slice(0, parts.length - 1).forEach((part, index) => {
            if (!hash[part]) {
                hash[part] = {};
            }
            hash = hash[part];
        });
        hash[parts[parts.length - 1]] = true;
    });

    return joinGroups(groups);
};

module.exports = groupServices;
