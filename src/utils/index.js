'use strict';

const discoverServices = require('./discover-services');
const groupServices = require('./group-services');
const childProcess = require('./child-process');

module.exports = {
    discoverServices,
    groupServices,
    childProcess
};
