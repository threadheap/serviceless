'use strict';

// mocks
const mockDeploy = jest.fn();
jest.mock('../deploy', () => mockDeploy);

const fs = require('fs');
const { Writable } = require('stream');
const commands = require('../index');

jest.useFakeTimers();

describe('commands', () => {
    describe('deploy', () => {
        it('should deploy service', () => {
            expect.assertions(2);

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
                        options,
                        expect.any(Writable)
                    );
                    expect(exec).toHaveBeenCalledWith('service');
                });
        });

        it('should catch error', () => {
            expect.assertions(3);

            const exec = jest.fn(() => Promise.reject(new Error()));
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
                        options,
                        expect.any(Writable)
                    );
                    expect(exec).toHaveBeenCalledWith('service');
                    expect(exit).toHaveBeenCalledWith(1);
                });
        });
    });
});
