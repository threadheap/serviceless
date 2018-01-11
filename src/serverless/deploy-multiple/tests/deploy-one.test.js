'use strict';

const mockWrapChildProcess = jest.fn(child => child);
const mockSls = jest.fn();
const mockStream = {
    write: jest.fn()
};

jest.mock('../../../utils/child-process', () => ({
    wrap: mockWrapChildProcess
}));
jest.mock('../../command', () => mockSls);

const deployOne = require('../deploy-one');
const { ServerlessCommandError } = require('../../../common/errors');

describe('deployOne', () => {
    it('should deploy service', () => {
        mockSls.mockImplementation(child => child);

        const mockDeploy = jest.fn(() => Promise.resolve('log'));
        mockSls.mockImplementation(() => ({
            deploy: mockDeploy
        }));

        const config = {};
        return expect(
            deployOne({
                path: 'path',
                flags: 'flags',
                config,
                logStream: mockStream
            })
        )
            .resolves.toBe('log')
            .then(() => {
                expect(mockSls).toBeCalledWith('path', 'flags');
                expect(mockStream.write).toBeCalledWith('\n[path]:\nlog\n');
            });
    });

    it('should catch regular error', () => {
        const error = new Error();
        mockSls.mockImplementation(child => child);
        mockSls.mockImplementation(() => ({
            deploy: () => Promise.reject(error)
        }));

        const config = {};
        return expect(
            deployOne({
                path: 'path',
                flags: 'flags',
                config,
                logStream: mockStream
            })
        ).rejects.toBe(error);
    });

    it('should catch ServerlessCommandError', () => {
        const error = new ServerlessCommandError('log', 'errorLog');
        mockSls.mockImplementation(child => child);
        mockSls.mockImplementation(() => ({
            deploy: () => Promise.reject(error)
        }));

        const config = {};
        return expect(
            deployOne({
                path: 'path',
                flags: 'flags',
                config,
                logStream: mockStream
            })
        )
            .rejects.toBe(error)
            .then(() => {
                expect(mockStream.write).toBeCalledWith('\n[path]:\nlog\n');
            });
    });
});
