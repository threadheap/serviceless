'use strict';

const mockWrapChildProcess = jest.fn();
const mockSls = jest.fn();
const mockStream = {
    write: jest.fn()
};

jest.mock('../../utils/child-process', () => ({
    wrap: mockWrapChildProcess
}));
jest.mock('../command', () => mockSls);

const deployMultiple = require('../deploy-multiple');
const { ServerlessCommandError } = require('../../common/errors');

describe('serverless deploy multiple', () => {
    beforeEach(() => {
        mockWrapChildProcess.mockImplementation(child => child);
        mockSls.mockImplementation(() => ({
            deploy: () => new Promise(resolve => resolve('log'))
        }));
        mockStream.write.mockClear();
    });

    describe('deploy in parallel', () => {
        it('should deploy empty list', () => {
            expect.assertions(1);

            return expect(
                deployMultiple([], '', {}, mockStream)
            ).resolves.toEqual({});
        });

        it('should deploy list of services', () => {
            expect.assertions(2);

            return deployMultiple(
                ['foo', 'bar', 'baz'],
                '',
                {},
                mockStream
            ).then(() => {
                expect(mockStream.write).toHaveBeenCalledWith('log');
                expect(mockStream.write).toHaveBeenCalledTimes(3);
            });
        });

        it('should catch error', () => {
            expect.assertions(2);

            const error = new Error('fail');
            mockSls.mockImplementation(() => ({
                deploy: () => new Promise((resolve, reject) => reject(error))
            }));

            return deployMultiple(['foo', 'bar', 'baz'], '', {}).catch(err => {
                expect(err).toBeInstanceOf(Error);
                expect(mockStream.write).not.toHaveBeenCalled();
            });
        });

        it('should catch ServerlessCommandError', () => {
            expect.assertions(2);

            const error = new ServerlessCommandError(1, 'log', 'errorLog');
            mockSls.mockImplementation(() => ({
                deploy: () => new Promise((resolve, reject) => reject(error))
            }));

            return deployMultiple(
                ['foo', 'bar', 'baz'],
                '',
                {},
                mockStream
            ).catch(err => {
                expect(err).toBeInstanceOf(Error);
                expect(mockStream.write).toHaveBeenCalled();
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
            expect.assertions(2);

            return deployMultiple(
                ['foo', 'bar', 'baz'],
                '',
                { runInBand: true },
                mockStream
            ).then(() => {
                expect(mockStream.write).toHaveBeenCalledWith('log');
                expect(mockStream.write).toHaveBeenCalledTimes(3);
            });
        });

        it('should catch error', () => {
            expect.assertions(1);

            const error = new Error('fail');
            mockSls.mockImplementation(() => ({
                deploy: () => new Promise((resolve, reject) => reject(error))
            }));

            return expect(
                deployMultiple(
                    ['foo', 'bar', 'baz'],
                    '',
                    { runInBand: true },
                    mockStream
                )
            ).rejects.toBeInstanceOf(Error);
        });
    });
});
