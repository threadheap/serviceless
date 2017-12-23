'use strict';

const isEmpty = require('lodash/isEmpty');
const pick = require('lodash/pick');
const Cli = require('../../cli');
const Sls = require('../../serverless/command');
const Errors = require('../../common/errors');
const Utils = require('../../utils');

class DeployCommand {
    constructor(path, argv, options = {}) {
        this.argv = argv;
        this.options = options;
        this.cli = new Cli();
        this.basePath = path;
        this.services = Utils.discoverServices(this.basePath);
    }

    loadServices() {
        return Utils.discoverServices(this.basePath).then(services => {
            this.services = services;
            this.serviceGroups = Utils.groupServices(this.services);
        });
    }

    deploy(servicePath) {
        const sls = new Sls(servicePath);

        return Utils.wrapChildProcess(sls.deploy(this.argv), this.options);
    }

    findService(query) {
        const matchServices = Object.keys(this.services).filter(
            service => service.indexOf(query) > -1
        );

        if (matchServices.length === 0) {
            return Promise.reject(new Errors.CantFindService());
        } else if (matchServices.length === 1) {
            return Promise.resolve(matchServices[1]);
        } else {
            return this.cli.selectService(
                Utils.groupServices(pick(this.services, matchServices))
            );
        }
    }

    exec(service) {
        return this.loadServices().then(() => {
            if (isEmpty(this.services)) {
                return Promise.reject(
                    new Errors.NoServerlessConfigFoundError()
                );
            }

            if (service) {
                return this.findService(service).then(path =>
                    this.deploy(path)
                );
            } else {
                return this.cli
                    .selectService(this.serviceGroups)
                    .then(path => this.deploy(path));
            }
        });
    }
}

module.exports = DeployCommand;
