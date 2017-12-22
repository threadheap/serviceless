'use strict';

const groupServices = require('../group-services');

describe('groupServices', () => {
    it('should return empty groups for empty object', () => {
        expect(groupServices({})).toEqual({});
    });

    it('should return single group for root services', () => {
        expect(
            groupServices({
                service1: 'service1',
                service2: 'service2'
            })
        ).toEqual({
            service1: true,
            service2: true
        });
    });

    it('should return nested groups', () => {
        expect(
            groupServices({
                'service/foo/bar': '',
                'service/foo/baz': '',
                'service/blah': ''
            })
        ).toEqual({
            service: {
                foo: {
                    bar: true,
                    baz: true
                },
                blah: true
            }
        });
    });

    it('should join groups', () => {
        expect(
            groupServices({
                'service/foo/bar': '',
                'service/foo/baz': '',
                blah: ''
            })
        ).toEqual({
            'service/foo': {
                bar: true,
                baz: true
            },
            blah: true
        });
    });

    it('should join deep nested groups', () => {
        expect(
            groupServices({
                'service/foo/bar/baz1/blah/1': '',
                'service/foo/bar/baz1/blah/2': '',
                'service/foo': '',
                service: ''
            })
        ).toEqual({
            service: {
                foo: true,
                'bar/baz1/blah': {
                    '1': true,
                    '2': true
                }
            },
            service: true
        });
    });
});
