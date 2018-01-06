'use strict';

const isObject = require('lodash/isObject');
const Path = require('path');

const joinGroups = groups => {
    const innerJoin = (key, groups) => {
        const innerKeys = Object.keys(groups[key]);

        if (innerKeys.length === 1) {
            const innerKey = innerKeys[0];
            const newKey = Path.join(key, innerKey);
            groups[newKey] = groups[key][innerKey];
            delete groups[key];

            innerJoin(newKey, groups);
        } else {
            joinGroups(groups[key]);
        }
    };

    Object.keys(groups).forEach(key => {
        if (typeof groups[key] === 'object') {
            const innerKeys = Object.keys(groups[key]);

            innerJoin(key, groups);
        }
    });
};

const groupServices = services => {
    const groups = {};
    const paths = Object.keys(services).sort();

    paths.forEach(path => {
        let hash = groups;
        const parts = path.split(Path.sep);
        parts.slice(0, parts.length - 1).forEach((part, index) => {
            if (!hash[part]) {
                hash[part] = {};
            }
            if (typeof hash[part] !== 'object') {
                hash[part] = { '.': true };
            }
            hash = hash[part];
        });

        hash[parts[parts.length - 1]] = true;
    });

    joinGroups(groups);

    return groups;
};

module.exports = groupServices;
