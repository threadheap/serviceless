'use strict';

// mocks
const mockDeploy = jest.fn();
jest.mock('../deploy', () => mockDeploy);

const commands = require('../index');
const { ServerlessCommandError } = require('../../common/errors');

jest.useFakeTimers();

describe('commands', () => {
    describe('deploy', () => {
        it('should deploy service', () => {
            const exec = jest.fn(() => new Promise(resolve => resolve('done')));
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
            const exec = jest.fn(
                () =>
                    new Promise((resolve, reject) =>
                        reject(new ServerlessCommandError())
                    )
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
                });
        });

        it('should catch random error', () => {
            const exec = jest.fn(
                () => new Promise((resolve, reject) => reject(new Error()))
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
                });
        });
    });
});
