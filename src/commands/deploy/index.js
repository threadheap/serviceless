'use strict';

const Path = require('path');
const isEmpty = require('lodash/isEmpty');
const pick = require('lodash/pick');
const Cli = require('../../cli');
const deployMultiple = require('../../serverless/deploy-multiple');
const Errors = require('../../common/errors');
const discoverServices = require('../../utils/discover-services');
const groupServices = require('../../utils/group-services');

class DeployCommand {
    constructor(path, argv, options) {
        this.argv = argv;
        this.options = options;
        this.cli = new Cli();
        this.basePath = path;
    }

    _loadServices() {
        return discoverServices(this.basePath).then(services => {
            this.services = services;
            this.serviceGroups = groupServices(this.services);
        });
    }

    _deploy(path) {
        return deployMultiple(
            this._normalizePath(path),
            this.argv,
            this.options
        );
    }

    _findService(query) {
        const matchServices = Object.keys(this.services).filter(
            service => service.indexOf(query) > -1
        );

        if (matchServices.length === 0) {
            return Promise.reject(new Errors.CantFindService());
        } else if (matchServices.length === 1) {
            return Promise.resolve(matchServices[1]);
        } else {
            return this.cli.selectService(
                groupServices(pick(this.services, matchServices))
            );
        }
    }

    _normalizePath(path) {
        return Object.keys(this.services)
            .filter(servicePath => servicePath.indexOf(path) === 0)
            .map(path => Path.join(this.basePath, path));
    }

    exec(service) {
        return this._loadServices().then(() => {
            if (isEmpty(this.services)) {
                return Promise.reject(
                    new Errors.NoServerlessConfigFoundError()
                );
            }

            if (service === 'all') {
                return deployMultiple(
                    Object.keys(this.services),
                    this.argv,
                    this.options
                );
            } else if (service) {
                return this._findService(service).then(path =>
                    this._deploy(path)
                );
            } else {
                return this.cli
                    .selectService(this.serviceGroups)
                    .then(path => this._deploy(path));
            }
        });
    }
}

module.exports = DeployCommand;
