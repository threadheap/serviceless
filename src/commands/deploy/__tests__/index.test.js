'use strict';

// mocks
const mockSelectService = jest.fn(() => Promise.resolve('path'));
const mockCli = jest.fn(() => ({
    selectService: mockSelectService
}));
const mockDeployMultiple = jest.fn();
const mockDiscoverServices = jest.fn();

jest.mock('../../../cli', () => mockCli);
jest.mock('../../../serverless/deploy-multiple', () => mockDeployMultiple);
jest.mock('../../../utils/discover-services', () => mockDiscoverServices);

const Errors = require('../../../common/errors');
const Deploy = require('../index');

describe('Deploy command', () => {
    const path = 'path';
    const argv = 'argv';
    const options = {};

    describe('with service', () => {
        it('should reject if no services found', () => {
            mockDiscoverServices.mockReturnValueOnce(Promise.resolve({}));
            const deploy = new Deploy(path, argv, options);

            return expect(deploy.exec()).rejects.toBeInstanceOf(
                Errors.NoServerlessConfigFoundError
            );
        });

        it('should deploy selected service', () => {
            const services = { path: true };
            mockDiscoverServices.mockReturnValueOnce(Promise.resolve(services));

            const deploy = new Deploy(path, argv, options);

            return deploy.exec().then(() => {
                expect(mockDeployMultiple).toHaveBeenCalledWith(
                    ['path/path'],
                    argv,
                    options
                );
            });
        });
    });

    describe('with cli lookup', () => {
        it('should deploy selected service', () => {
            const services = { path: true };
            mockDiscoverServices.mockReturnValueOnce(Promise.resolve(services));

            const deploy = new Deploy(path, argv, options);

            return deploy.exec('path').then(() => {
                expect(mockDeployMultiple).toHaveBeenCalledWith(
                    ['path/path'],
                    argv,
                    options
                );
            });
        });

        it('should call selectService if more than one service found', () => {
            const services = { aaa: true, aab: true };
            mockDiscoverServices.mockReturnValueOnce(Promise.resolve(services));

            const deploy = new Deploy(path, argv, options);

            return deploy.exec('aa').then(() => {
                expect(mockDeployMultiple).toHaveBeenCalledWith(
                    ['path/path'],
                    argv,
                    options
                );
                expect(mockSelectService).toHaveBeenCalledWith(services);
            });
        });

        it('should reject if no services found', () => {
            const services = { aaa: true, aab: true };
            mockDiscoverServices.mockReturnValueOnce(Promise.resolve(services));

            const deploy = new Deploy(path, argv, options);

            return expect(deploy.exec('zzz')).rejects.toBeInstanceOf(
                Errors.CantFindService
            );
        });
    });
});
