'use strict';

const Path = require('path');
const isObject = require('lodash/isObject');

const getChoicesFromServices = services => {
    const choices = [];

    const getChoices = (basePath, hash) => {
        if (isObject(hash)) {
            Object.keys(hash).forEach(key => {
                const path = Path.join(basePath, key);
                choices.push({
                    name: path,
                    path
                });

                getChoices(path, hash[key]);
            });
        }
    };
    getChoices('', services);

    return choices;
};

module.exports = { getChoicesFromServices };
