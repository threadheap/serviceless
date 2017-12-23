'use strict';

const discoverServices = require('./discover-services');
const groupServices = require('./group-services');
const wrapChildProcess = require('./wrap-child-process');

module.exports = {
    discoverServices,
    groupServices,
    wrapChildProcess
};
