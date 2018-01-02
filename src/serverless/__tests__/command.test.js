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

            expect(mockExec).toBeCalledWith('cd foo && sls foo flags', {
                async: true,
                silent: true
            });
        });

        it(`should deploy`, () => {
            sls.deploy();
            expect(mockExec).toBeCalledWith('cd foo && sls deploy flags', {
                async: true,
                silent: true
            });
        });
    });
});
