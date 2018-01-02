'use strict';

// mocks
const mockDeploy = jest.fn();
const mockKill = jest.fn();

jest.mock('../commands', () => ({
    deploy: mockDeploy
}));
jest.mock('../utils/child-process', () => ({
    kill: mockKill
}));

jest.spyOn(process, 'on').mockImplementation(jest.fn());
jest.spyOn(process, 'exit').mockImplementation(jest.fn());
jest.spyOn(process, 'cwd').mockImplementation(() => 'path');

describe('index', () => {
    const originalArgv = process.argv;

    beforeEach(() => {
        jest.resetModules();
    });

    afterEach(() => {
        process.argv = originalArgv;
    });

    describe('with kill signals', () => {
        process.argv = ['node', 'index.js', 'deploy', 'service', '-b', '--foo'];

        require('../index');
        it('should handle exit events', () => {
            expect(process.on).toHaveBeenCalledWith('exit', mockKill);
            expect(process.on).toHaveBeenCalledWith(
                'SIGINT',
                expect.any(Function)
            );

            expect(process.on).toHaveBeenCalledWith(
                'SIGTERM',
                expect.any(Function)
            );

            process.on.mock.calls[0][1]();
            expect(mockKill).toHaveBeenCalled();

            process.on.mock.calls[1][1]();
            process.on.mock.calls[2][1]();

            expect(process.exit).toHaveBeenCalledTimes(2);
        });
    });

    describe('deploy', () => {
        it('should deploy service', () => {
            process.argv = [
                'node',
                'index.js',
                'deploy',
                'service',
                '-b',
                '--foo'
            ];

            require('../index');

            expect(mockDeploy).toHaveBeenCalledWith(
                'service',
                'path',
                '--foo',
                expect.objectContaining({
                    runInBand: true
                })
            );
        });

        it('should deploy', () => {
            process.argv = [
                'node',
                'index.js',
                'deploy',
                '--runInBand',
                '--foo'
            ];

            require('../index');

            expect(mockDeploy).toHaveBeenCalledWith(
                undefined,
                'path',
                '--foo',
                expect.objectContaining({
                    runInBand: true
                })
            );
        });
    });
});
