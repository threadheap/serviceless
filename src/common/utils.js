'use strict';

const { configTypes } = require('./constants');

const containsServerlessConfig = path => {
    return configTypes.some(configType => {
        return path.indexOf(configType) > -1;
    });
};

module.exports = { containsServerlessConfig };
