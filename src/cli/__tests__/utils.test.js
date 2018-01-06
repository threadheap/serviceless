'use strict';

const { Separator } = require('inquirer');
const { getChoicesFromServices } = require('../utils');

describe('cli utils', () => {
    describe('getChoicesFromServices', () => {
        it('should return empty choises', () => {
            expect(getChoicesFromServices({})).toEqual([
                new Separator(),
                new Separator(),
                new Separator()
            ]);
        });

        it('should generate choises', () => {
            const choices = getChoicesFromServices({
                service1: '',
                service2: ''
            });

            expect(choices).toEqual([
                new Separator(),
                new Separator(),
                {
                    name: '(service)   service1',
                    path: 'service1',
                    isService: true
                },
                {
                    name: '(service)   service2',
                    path: 'service2',
                    isService: true
                },
                new Separator()
            ]);
        });

        it('should generate deep nested choises', () => {
            const choices = getChoicesFromServices({
                'service/foo/bar': {
                    foo: '',
                    'bar/baz': ''
                },
                'service2/baz': ''
            });

            expect(choices).toEqual([
                new Separator(),
                {
                    name: '(folder)    service/foo/bar',
                    path: 'service/foo/bar',
                    isService: false
                },
                new Separator(),
                {
                    name: '(service)   service/foo/bar/foo',
                    path: 'service/foo/bar/foo',
                    isService: true
                },
                {
                    name: '(service)   service/foo/bar/bar/baz',
                    path: 'service/foo/bar/bar/baz',
                    isService: true
                },
                {
                    name: '(service)   service2/baz',
                    path: 'service2/baz',
                    isService: true
                },
                new Separator()
            ]);
        });
    });
});
