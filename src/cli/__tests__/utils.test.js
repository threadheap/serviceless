'use strict';

const { getChoicesFromServices } = require('../utils');

describe('cli utils', () => {
    describe('getChoicesFromServices', () => {
        it('should return empty choises', () => {
            expect(getChoicesFromServices({})).toEqual([]);
        });

        it('should generate choises', () => {
            expect(
                getChoicesFromServices({
                    service1: '',
                    service2: ''
                })
            ).toEqual([
                {
                    name: 'service1',
                    path: 'service1'
                },
                {
                    name: 'service2',
                    path: 'service2'
                }
            ]);
        });

        it('should generate deep nested choises', () => {
            expect(
                getChoicesFromServices({
                    'service/foo/bar': {
                        foo: '',
                        'bar/baz': ''
                    },
                    'service2/baz': ''
                })
            ).toEqual([
                {
                    name: 'service/foo/bar',
                    path: 'service/foo/bar'
                },
                {
                    name: 'service/foo/bar/foo',
                    path: 'service/foo/bar/foo'
                },
                {
                    name: 'service/foo/bar/bar/baz',
                    path: 'service/foo/bar/bar/baz'
                },
                {
                    name: 'service2/baz',
                    path: 'service2/baz'
                }
            ]);
        });
    });
});
