'use strict';

const shrinkPaths = require('../shrink-paths');

describe('shrinkPaths', () => {
    it('should return empty array for empty paths', () => {
        expect(shrinkPaths('', {})).toEqual([]);
    });

    it('should return uniq keys', () => {
        expect(shrinkPaths('', { foo: true, bar: true })).toEqual([
            'foo',
            'bar'
        ]);
    });

    it('should shrink paths', () => {
        expect(shrinkPaths('', { foo: { bar: true, baz: true } })).toEqual([
            'foo/bar',
            'foo/baz'
        ]);
    });

    it('should shrink deep nested paths', () => {
        expect(
            shrinkPaths('', {
                foo: { bar: { blah: true }, baz: { blah: true, baz: true } }
            })
        ).toEqual(['foo/bar/blah', 'foo/baz/blah', 'foo/baz/baz']);
    });
});
