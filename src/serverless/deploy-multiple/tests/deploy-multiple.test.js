'use strict';

const mockDeployOne = jest.fn();
const mockRollback = jest.fn();

jest.mock('../deploy-one', () => mockDeployOne);
jest.mock('../rollback', () => mockRollback);

const deployMultiple = require('../index');

describe('serverless deploy multiple', () => {
    beforeEach(() => {
        mockDeployOne.mockClear();
        mockRollback.mockClear();
    });

    const mockStream = jest.fn();

    describe('deploy in parallel', () => {
        it('should deploy empty list', () => {
            return expect(
                deployMultiple([], '', {}, mockStream)
            ).resolves.toEqual({});
        });

        it('should deploy list of services', () => {
            mockDeployOne.mockImplementation(({ path }) =>
                Promise.resolve(path)
            );

            const services = ['foo', 'bar', 'baz'];
            expect.assertions(services.length);
            return deployMultiple(services, '', {}, mockStream).then(() => {
                services.forEach(service => {
                    expect(mockDeployOne).toBeCalledWith({
                        path: service,
                        flags: '',
                        config: {},
                        logStream: mockStream
                    });
                });
            });
        });

        it('should catch error', () => {
            expect.assertions(1);

            const error = new Error('fail');
            mockDeployOne.mockImplementation(({ path }) =>
                Promise.reject(error)
            );

            return deployMultiple(['foo', 'bar', 'baz'], '', {}).catch(err => {
                expect(err).toBeInstanceOf(Error);
            });
        });
    });

    describe('deploy in band', () => {
        it('should deploy empty list', () => {
            expect.assertions(1);

            return expect(
                deployMultiple([], '', { runInBand: true }, mockStream)
            ).resolves.toEqual({});
        });

        it('should deploy list of services', () => {
            mockDeployOne.mockImplementation(({ path }) =>
                Promise.resolve(path)
            );

            const services = ['foo', 'bar', 'baz'];
            const config = { runInBand: true };
            expect.assertions(services.length);
            return deployMultiple(services, '', config, mockStream).then(() => {
                services.forEach(service => {
                    expect(mockDeployOne).toBeCalledWith({
                        path: service,
                        flags: '',
                        config,
                        logStream: mockStream
                    });
                });
            });
        });

        it('should catch error', () => {
            expect.assertions(1);

            const error = new Error('fail');
            const config = { runInBand: true };
            mockDeployOne.mockImplementation(({ path }) =>
                Promise.reject(error)
            );

            return deployMultiple(['foo', 'bar', 'baz'], '', config).catch(
                err => {
                    expect(err).toBeInstanceOf(Error);
                }
            );
        });
    });

    describe('deploy with rollback', () => {
        it('should rollback deployed services on failure', () => {
            const error = new Error('failed');
            mockDeployOne.mockImplementation(({ path }) => {
                if (path === 'bar') {
                    return Promise.reject(error);
                } else {
                    return Promise.resolve(path);
                }
            });
            mockRollback.mockImplementation(() => Promise.resolve());

            const config = { rollbackOnFailure: true };
            const services = ['foo', 'bar', 'baz'];

            expect.assertions(services.length + 4);
            return deployMultiple(services, '', config, mockStream).catch(
                err => {
                    expect(err.errors).toHaveLength(1);
                    expect(err.errors[0]).toBe(error);

                    services.forEach(service => {
                        expect(mockDeployOne).toBeCalledWith({
                            path: service,
                            flags: '',
                            config,
                            logStream: mockStream
                        });
                    });

                    expect(mockRollback).toBeCalledWith({
                        path: 'foo',
                        logStream: mockStream
                    });
                    expect(mockRollback).toBeCalledWith({
                        path: 'baz',
                        logStream: mockStream
                    });
                }
            );
        });
    });
});
