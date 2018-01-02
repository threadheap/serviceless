'use strict';

const mockWrapChildProcess = jest.fn();
const mockSls = jest.fn();
const mockOra = jest.fn(() => ({
    start: jest.fn(),
    succeed: jest.fn(),
    fail: jest.fn()
}));

jest.mock('../../utils/child-process', () => ({
    wrap: mockWrapChildProcess
}));
jest.mock('../command', () => mockSls);
jest.mock('ora', () => mockOra);

const deployMultiple = require('../deploy-multiple');

describe('serverless deploy multiple', () => {
    beforeEach(() => {
        mockWrapChildProcess.mockImplementation(child => child);
        mockSls.mockImplementation(() => ({
            deploy: () => new Promise(resolve => resolve('log'))
        }));
    });

    describe('deploy in parallel', () => {
        it('should deploy empty list', () => {
            return expect(deployMultiple([], '', {})).resolves.toEqual([]);
        });

        it('should deploy list of services', () => {
            return expect(
                deployMultiple(['foo', 'bar', 'baz'], '', {})
            ).resolves.toEqual(['log', 'log', 'log']);
        });

        it('should catch error', () => {
            const error = new Error('fail');
            mockSls.mockImplementation(() => ({
                deploy: () => new Promise((resolve, reject) => reject(error))
            }));

            return expect(
                deployMultiple(['foo', 'bar', 'baz'], '', {})
            ).resolves.toEqual([error, error, error]);
        });
    });

    describe('deploy in band', () => {
        it('should deploy empty list', () => {
            return expect(
                deployMultiple([], '', { runInBand: true })
            ).resolves.toEqual([]);
        });

        it('should deploy list of services', () => {
            return expect(
                deployMultiple(['foo', 'bar', 'baz'], '', { runInBand: true })
            ).resolves.toEqual(['log', 'log', 'log']);
        });

        it('should catch error', () => {
            const error = new Error('fail');
            mockSls.mockImplementation(() => ({
                deploy: () => new Promise((resolve, reject) => reject(error))
            }));

            return expect(
                deployMultiple(['foo', 'bar', 'baz'], '', { runInBand: true })
            ).resolves.toEqual([error, error, error]);
        });
    });
});
