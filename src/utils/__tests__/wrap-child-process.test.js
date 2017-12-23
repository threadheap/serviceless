'use strict';

const { exec } = require('child_process');
const stream = require('stream');
const wrap = require('../wrap-child-process');

describe('wrap-child-process', () => {
    it('should wrap child process', () => {
        const promise = wrap(exec('ls -l'));

        expect(promise).resolves.toEqual(expect.any(String));
    });

    it('should reject on error', () => {
        const promise = wrap(exec('blah blah'));

        expect(promise).rejects.toBeDefined();
    });

    it('should pipe to stdout', () => {
        const outStream = new stream.Writable();
        let log = '';
        outStream._write = data => {
            log += data.toString();
        };
        const promise = wrap(exec('ls -l'), {
            stdout: outStream
        });

        expect(promise).resolves.toEqual(expect.any(String));
    });

    it('should pipe to stdout with verbose option', () => {
        const promise = wrap(exec('ls -l'), {
            verbose: true
        });

        expect(promise).resolves.toEqual(expect.any(String));
    });
});
