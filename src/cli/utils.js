'use strict';

const Path = require('path');
const isObject = require('lodash/isObject');

const getChoicesFromServices = services => {
    const choices = [];

    const getChoises = (basePath, hash) => {
        if (isObject(hash)) {
            Object.keys(hash).forEach(key => {
                const path = Path.join(basePath, key);
                choices.push({
                    name: path,
                    path
                });

                getChoises(path, hash[key]);
            });
        }
    };
    getChoises('', services);

    return choices;
};

module.exports = { getChoicesFromServices };
