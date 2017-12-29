'use strict';

const getArgv = require('../get-argv');

describe('getArgv', () => {
    it('should return empty string for empty array of arguments', () => {
        expect(getArgv([], [])).toBe('');
    });

    it('should return original arguments for empty array of options', () => {
        expect(getArgv(['--foo'], [])).toBe('--foo');
    });

    it('should filter arguments', () => {
        expect(
            getArgv(
                ['foo', 'bar', 'f', 'b'],
                [
                    {
                        short: 'f',
                        long: 'foo'
                    }
                ]
            )
        ).toBe('bar b');
    });
});
