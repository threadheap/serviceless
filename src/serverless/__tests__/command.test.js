'use strict';

// mocks
const mockWhich = jest.fn();
const mockCd = jest.fn();
const mockExec = jest.fn();
const mockResolve = jest.fn(path => '/' + path);

jest.mock('shelljs', () => ({
    which: mockWhich,
    cd: mockCd,
    exec: mockExec
}));
jest.mock('path', () => ({
    resolve: mockResolve
}));

const Sls = require('../command');

describe('serverless commands', () => {
    const flags = 'flags';
    const sls = new Sls('foo', flags);

    it('should resolve path', () => {
        expect(sls.path).toBe('foo');
    });

    it('should throw an error on missing sls', () => {
        expect(() => sls.__getSls()).toThrow();
    });

    describe('commands', () => {
        beforeEach(() => {
            mockWhich.mockReturnValue({ exec: mockExec });
        });

        it('should exec command', () => {
            sls.exec('foo');

            expect(mockExec).toBeCalledWith('sls foo flags', {
                async: true,
                silent: true
            });
        });

        ['install', 'create', 'package', 'deploy'].forEach(command => {
            it(`should ${command}`, () => {
                sls[command]();
                expect(mockExec).toBeCalledWith(`sls ${command} flags`, {
                    async: true,
                    silent: true
                });
            });
        });

        ['deployFunction', 'invoke'].forEach(command => {});

        it('should invoke', () => {
            sls.invoke('foo');
            expect(mockExec).toBeCalledWith(
                `sls invoke function -f foo flags`,
                {
                    async: true,
                    silent: true
                }
            );
        });

        it('should deploy function', () => {
            sls.deployFunction('foo');
            expect(mockExec).toBeCalledWith(
                `sls deploy function -f foo flags`,
                {
                    async: true,
                    silent: true
                }
            );
        });

        it('should invoke local function', () => {
            sls.invokeLocal('foo');
            expect(mockExec).toBeCalledWith(
                `sls invoke local function -f foo flags`,
                {
                    async: true,
                    silent: true
                }
            );
        });
    });
});
