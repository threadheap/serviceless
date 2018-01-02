'use strict';

// mocks
const mockDeploy = jest.fn();
jest.mock('../deploy', () => mockDeploy);

const fs = require('fs');
const commands = require('../index');
const { ServerlessCommandError } = require('../../common/errors');

jest.useFakeTimers();

describe('commands', () => {
    describe('deploy', () => {
        it('should deploy service', () => {
            const exec = jest.fn(
                () => new Promise(resolve => resolve(['done']))
            );
            mockDeploy.mockImplementation(() => ({
                exec: exec
            }));

            const options = {};
            return commands
                .deploy('service', 'path', 'flags', options)
                .then(() => {
                    expect(mockDeploy).toHaveBeenCalledWith(
                        'path',
                        'flags',
                        options
                    );
                    expect(exec).toHaveBeenCalledWith('service');
                });
        });

        it('should catch ServerlessCommandError', () => {
            const exec = jest.fn(() =>
                Promise.resolve([new ServerlessCommandError(1, 'foo', 'bar')])
            );
            const exit = jest
                .spyOn(process, 'exit')
                .mockImplementation(() => {});
            mockDeploy.mockImplementation(() => ({
                exec: exec
            }));

            const options = {};
            return commands
                .deploy('service', 'path', 'flags', options)
                .then(() => {
                    expect(mockDeploy).toHaveBeenCalledWith(
                        'path',
                        'flags',
                        options
                    );
                    expect(exec).toHaveBeenCalledWith('service');
                    expect(exit).toHaveBeenCalledWith(1);

                    const log = fs.readFileSync('./serviceless.log', 'utf8');
                    expect(log).toBe('barfoo');
                });
        });

        it('should catch random error', () => {
            const exec = jest.fn(() => Promise.resolve([new Error()]));
            const exit = jest
                .spyOn(process, 'exit')
                .mockImplementation(() => {});
            mockDeploy.mockImplementation(() => ({
                exec: exec
            }));

            const options = {};
            return commands
                .deploy('service', 'path', 'flags', options)
                .then(() => {
                    expect(mockDeploy).toHaveBeenCalledWith(
                        'path',
                        'flags',
                        options
                    );
                    expect(exec).toHaveBeenCalledWith('service');
                    expect(exit).toHaveBeenCalledWith(1);
                });
        });
    });
});
